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