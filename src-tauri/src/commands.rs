use std::sync::Arc;
use tauri::State;
use crate::error::BmsError;
use crate::polling::{start_polling_loop, BmsState};
use crate::register_map::{addr, all_registers};
use crate::transport::modbus_rtu::ModbusRtu;
use crate::types::{FieldType, RegisterDef, RegisterValue};

#[tauri::command]
pub fn list_ports() -> Vec<String> {
    serialport::available_ports()
        .unwrap_or_default()
        .into_iter()
        .map(|p| p.port_name)
        .collect()
}

#[tauri::command]
pub fn connect(
    port: String,
    baud_rate: u32,
    state: State<'_, Arc<BmsState>>,
) -> Result<(), String> {
    let transport = ModbusRtu::new(&port, baud_rate).map_err(|e| e.to_string())?;
    *state.transport.lock().unwrap() = Some(Box::new(transport));
    Ok(())
}

#[tauri::command]
pub fn disconnect(state: State<'_, Arc<BmsState>>) -> Result<(), String> {
    state.stop_flag.store(true, std::sync::atomic::Ordering::SeqCst);
    *state.transport.lock().unwrap() = None;
    Ok(())
}

#[tauri::command]
pub fn start_polling(
    interval_ms: u64,
    app: tauri::AppHandle,
    state: State<'_, Arc<BmsState>>,
) -> Result<(), String> {
    if state.transport.lock().unwrap().is_none() {
        return Err("not connected".into());
    }
    start_polling_loop(app, state.inner().clone(), interval_ms);
    Ok(())
}

#[tauri::command]
pub fn stop_polling(state: State<'_, Arc<BmsState>>) -> Result<(), String> {
    state.stop_flag.store(true, std::sync::atomic::Ordering::SeqCst);
    Ok(())
}

#[tauri::command]
pub fn get_register_map() -> Vec<RegisterDef> {
    all_registers()
}

#[tauri::command]
pub fn read_register(
    name: String,
    state: State<'_, Arc<BmsState>>,
) -> Result<RegisterValue, String> {
    let reg_addr = addr(&name).ok_or_else(|| BmsError::UnknownRegister(name.clone()).to_string())?;
    let mut guard = state.transport.lock().unwrap();
    let transport = guard.as_mut().ok_or_else(|| BmsError::NotConnected.to_string())?;

    let reg_def = all_registers().into_iter().find(|r| r.name == name)
        .ok_or_else(|| format!("register {} not found in map", name))?;

    match &reg_def.value_type {
        crate::types::ValueType::Word => {
            let val = transport.read_word(reg_addr.address).map_err(|e| e.to_string())?;
            Ok(RegisterValue::Word(val))
        }
        crate::types::ValueType::SignedWord => {
            let val = transport.read_word(reg_addr.address).map_err(|e| e.to_string())?;
            Ok(RegisterValue::SignedWord(val as i16))
        }
        crate::types::ValueType::Block(_) => {
            let bytes = transport.read_block(reg_addr.address, reg_addr.num_registers)
                .map_err(|e| e.to_string())?;
            Ok(RegisterValue::Block(bytes[..reg_addr.byte_count as usize].to_vec()))
        }
    }
}

#[tauri::command]
pub fn write_register(
    name: String,
    value: RegisterValue,
    state: State<'_, Arc<BmsState>>,
) -> Result<(), String> {
    let reg_addr = addr(&name).ok_or_else(|| BmsError::UnknownRegister(name.clone()).to_string())?;
    let mut guard = state.transport.lock().unwrap();
    let transport = guard.as_mut().ok_or_else(|| BmsError::NotConnected.to_string())?;

    match value {
        RegisterValue::Word(v) => transport.write_word(reg_addr.address, v).map_err(|e| e.to_string()),
        RegisterValue::SignedWord(v) => transport.write_word(reg_addr.address, v as u16).map_err(|e| e.to_string()),
        RegisterValue::Block(bytes) => transport.write_block(reg_addr.address, &bytes).map_err(|e| e.to_string()),
    }
}

#[tauri::command]
pub fn set_polling_interval(
    state: State<'_, Arc<BmsState>>,
    interval_ms: u64,
) {
    *state.interval_ms.lock().unwrap() = interval_ms;
}

#[tauri::command]
pub fn write_field(
    register: String,
    field: String,
    value: u32,
    state: State<'_, Arc<BmsState>>,
) -> Result<(), String> {
    let reg_addr = addr(&register).ok_or_else(|| BmsError::UnknownRegister(register.clone()).to_string())?;
    let reg_def = all_registers().into_iter().find(|r| r.name == register)
        .ok_or_else(|| format!("register {} not found", register))?;
    let field_def = reg_def.fields.into_iter().find(|f| f.name == field)
        .ok_or_else(|| BmsError::UnknownField(field.clone()).to_string())?;

    let mut guard = state.transport.lock().unwrap();
    let transport = guard.as_mut().ok_or_else(|| BmsError::NotConnected.to_string())?;

    match field_def.field_type {
        FieldType::Bit(bit) => {
            let current = transport.read_word(reg_addr.address).map_err(|e| e.to_string())?;
            let mask = 1u16 << bit;
            let new_val = if value != 0 { current | mask } else { current & !mask };
            transport.write_word(reg_addr.address, new_val).map_err(|e| e.to_string())
        }
        FieldType::BitRange { high, low } => {
            let current = transport.read_word(reg_addr.address).map_err(|e| e.to_string())?;
            let width = high - low + 1;
            let mask = ((1u16 << width) - 1) << low;
            let new_val = (current & !mask) | (((value as u16) << low) & mask);
            transport.write_word(reg_addr.address, new_val).map_err(|e| e.to_string())
        }
        FieldType::ByteField { byte_offset, prim } => {
            let mut bytes = transport.read_block(reg_addr.address, reg_addr.num_registers)
                .map_err(|e| e.to_string())?;
            let off = byte_offset as usize;
            match prim {
                crate::types::PrimitiveType::U8  => { bytes[off] = value as u8; }
                crate::types::PrimitiveType::U16 => {
                    bytes[off]     = (value >> 8) as u8;
                    bytes[off + 1] = (value & 0xFF) as u8;
                }
                crate::types::PrimitiveType::U32 => {
                    bytes[off]     = (value >> 24) as u8;
                    bytes[off + 1] = (value >> 16) as u8;
                    bytes[off + 2] = (value >> 8) as u8;
                    bytes[off + 3] = (value & 0xFF) as u8;
                }
                crate::types::PrimitiveType::I8  => { bytes[off] = (value as i8) as u8; }
                crate::types::PrimitiveType::I16 => {
                    let v = value as i16;
                    bytes[off]     = (v >> 8) as u8;
                    bytes[off + 1] = (v & 0xFF) as u8;
                }
                crate::types::PrimitiveType::I32 => {
                    let v = value as i32;
                    bytes[off]     = (v >> 24) as u8;
                    bytes[off + 1] = (v >> 16) as u8;
                    bytes[off + 2] = (v >> 8) as u8;
                    bytes[off + 3] = (v & 0xFF) as u8;
                }
            }
            transport.write_block(reg_addr.address, &bytes).map_err(|e| e.to_string())
        }
        FieldType::PrimitiveArray { .. } => Err("array fields are not writable via write_field".into()),
    }
}

#[tauri::command]
pub fn read_config(state: State<'_, Arc<BmsState>>) -> Result<crate::config::BmsConfig, String> {
    use crate::config::BmsConfig;

    let mut guard = state.transport.lock().unwrap();
    let t = guard.as_mut().ok_or_else(|| BmsError::NotConnected.to_string())?;

    macro_rules! rword {
        ($name:expr) => {{
            let a = addr($name).ok_or_else(|| format!("unknown register {}", $name))?;
            t.read_word(a.address).map_err(|e| e.to_string())?
        }};
    }
    macro_rules! rblock {
        ($name:expr) => {{
            let a = addr($name).ok_or_else(|| format!("unknown register {}", $name))?;
            let bytes = t.read_block(a.address, a.num_registers).map_err(|e| e.to_string())?;
            bytes[..a.byte_count as usize].to_vec()
        }};
    }

    Ok(BmsConfig {
        version: 1,
        battery_mode:          rword!("BatteryMode"),
        at_rate:               rword!("AtRate") as i16,
        charging_current_ma:   rword!("ChargingCurrent"),
        charging_voltage_mv:   rword!("ChargingVoltage"),
        configuration:         rword!("Configuration"),
        main_control:          rword!("MainControl"),
        fet_state:             rword!("FETState"),
        balancing_control:     rword!("BalancingControl"),
        protection_voltage:    rblock!("VoltageProtectionControl"),
        protection_current:    rblock!("CurrentProtectionControl"),
        protection_temperature:rblock!("TemperatureProtectionControl"),
        calibration_current:   rblock!("CurrentSensorCalibration"),
        calibration_voltage:   rblock!("VoltageCalibration"),
        calibration_temperature:rblock!("TemperatureCalibration"),
    })
}

#[tauri::command]
pub fn write_config(
    config: crate::config::BmsConfig,
    state: State<'_, Arc<BmsState>>,
) -> Result<(), String> {
    let mut guard = state.transport.lock().unwrap();
    let t = guard.as_mut().ok_or_else(|| BmsError::NotConnected.to_string())?;

    macro_rules! wword {
        ($name:expr, $val:expr) => {{
            let a = addr($name).ok_or_else(|| format!("unknown register {}", $name))?;
            t.write_word(a.address, $val).map_err(|e| e.to_string())?;
        }};
    }
    macro_rules! wblock {
        ($name:expr, $val:expr) => {{
            let a = addr($name).ok_or_else(|| format!("unknown register {}", $name))?;
            if $val.len() != a.byte_count as usize {
                return Err(format!(
                    "register {}: expected {} bytes, got {}",
                    $name,
                    a.byte_count,
                    $val.len()
                ));
            }
            let mut bytes = $val.clone();
            if bytes.len() % 2 != 0 {
                bytes.push(0);
            }
            t.write_block(a.address, &bytes).map_err(|e| e.to_string())?;
        }};
    }

    wword!("BatteryMode",              config.battery_mode);
    wword!("AtRate",                   config.at_rate as u16);
    wword!("ChargingCurrent",          config.charging_current_ma);
    wword!("ChargingVoltage",          config.charging_voltage_mv);
    wword!("Configuration",            config.configuration);
    wword!("MainControl",              config.main_control);
    wword!("FETState",                 config.fet_state);
    wword!("BalancingControl",         config.balancing_control);
    wblock!("VoltageProtectionControl",    config.protection_voltage);
    wblock!("CurrentProtectionControl",    config.protection_current);
    wblock!("TemperatureProtectionControl",config.protection_temperature);
    wblock!("CurrentSensorCalibration",    config.calibration_current);
    wblock!("VoltageCalibration",          config.calibration_voltage);
    wblock!("TemperatureCalibration",      config.calibration_temperature);

    Ok(())
}