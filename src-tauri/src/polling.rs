use std::sync::{Arc, Mutex};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tauri::{AppHandle, Emitter};
use crate::bms_data::BmsData;
use crate::error::{BmsError, CommsError};
use crate::transport::BmsTransport;

pub struct BmsState {
    pub transport: Mutex<Option<Box<dyn BmsTransport>>>,
    pub stop_flag: Arc<AtomicBool>,
    pub interval_ms: Arc<Mutex<u64>>,
}

impl BmsState {
    pub fn new() -> Self {
        Self {
            transport: Mutex::new(None),
            stop_flag: Arc::new(AtomicBool::new(false)),
            interval_ms: Arc::new(Mutex::new(1_000)),
        }
    }
}

pub fn start_polling_loop(
    app: AppHandle,
    state: Arc<BmsState>,
    interval_ms: u64,
) {
    *state.interval_ms.lock().unwrap() = interval_ms;

    state.stop_flag.store(false, Ordering::SeqCst);
    let stop = state.stop_flag.clone();
    let interval_cell = state.interval_ms.clone();

    std::thread::spawn(move || {
        loop {
            if stop.load(Ordering::SeqCst) {
                break;
            }

            let result = {
                let mut guard = state.transport.lock().unwrap();
                match guard.as_mut() {
                    None => Err(BmsError::NotConnected),
                    Some(t) => read_telemetry(t.as_mut()),
                }
            };

            match result {
                Ok(data) => {
                    let _ = app.emit("bms_data", &data);
                }
                Err(e) => {
                    let _ = app.emit("comms_error", CommsError::from(e));
                }
            }

            let sleep_ms = *interval_cell.lock().unwrap();
            std::thread::sleep(Duration::from_millis(sleep_ms));
        }
    });
}

fn read_telemetry(transport: &mut dyn BmsTransport) -> Result<BmsData, BmsError> {
    let temperature_dk  = transport.read_word(0x08)?;
    let voltage_mv      = transport.read_word(0x09)?;
    let current_raw     = transport.read_word(0x0A)?;
    let avg_current_raw = transport.read_word(0x0B)?;
    let relative_soc    = transport.read_word(0x0D)? as u8;
    let absolute_soc    = transport.read_word(0x0E)? as u8;
    let remaining_cap   = transport.read_word(0x0F)?;
    let full_charge_cap = transport.read_word(0x10)?;
    let rte             = transport.read_word(0x11)?;
    let atte            = transport.read_word(0x12)?;
    let attf            = transport.read_word(0x13)?;
    let battery_status  = transport.read_word(0x16)?;
    let cycle_count     = transport.read_word(0x17)?;

    // Charging / AtRate
    let at_rate          = transport.read_word(0x04)?;
    let at_rate_ttf      = transport.read_word(0x05)?;
    let at_rate_tte      = transport.read_word(0x06)?;
    let at_rate_ok       = transport.read_word(0x07)?;
    let charging_current = transport.read_word(0x14)?;
    let charging_voltage = transport.read_word(0x15)?;
    // Control
    let fet_state        = transport.read_word(0x42)?;
    let bal_control      = transport.read_word(0x60)?;

    let cell_v_bytes   = transport.read_block(0x48, 7)?;
    let cell_t_bytes   = transport.read_block(0x49, 7)?;
    let fet_status     = transport.read_word(0x4A)?;
    let cell_s_bytes   = transport.read_block(0x4B, 4)?;
    // Per-cell extended
    let cell_soh_bytes = transport.read_block(0x4C, 4)?;  // 7 bytes packed
    let cell_rc_bytes  = transport.read_block(0x4D, 7)?;  // 14 bytes (7 × u16)
    let bal_status     = transport.read_word(0x5F)?;

    fn parse_u16_array<const N: usize>(bytes: &[u8]) -> [u16; N] {
        let mut out = [0u16; N];
        for i in 0..N {
            let off = i * 2;
            if off + 1 < bytes.len() {
                out[i] = u16::from_be_bytes([bytes[off], bytes[off + 1]]);
            }
        }
        out
    }

    fn parse_i16_array<const N: usize>(bytes: &[u8]) -> [i16; N] {
        let mut out = [0i16; N];
        for i in 0..N {
            let off = i * 2;
            if off + 1 < bytes.len() {
                out[i] = i16::from_be_bytes([bytes[off], bytes[off + 1]]);
            }
        }
        out
    }

    fn parse_u8_array<const N: usize>(bytes: &[u8]) -> [u8; N] {
        let mut out = [0u8; N];
        for i in 0..N.min(bytes.len()) {
            out[i] = bytes[i];
        }
        out
    }

    let mut cell_soc = [0u8; 7];
    for i in 0..7.min(cell_s_bytes.len()) {
        cell_soc[i] = cell_s_bytes[i];
    }

    Ok(BmsData {
        temperature_dk,
        voltage_mv,
        current_ma: current_raw as i16,
        average_current_ma: avg_current_raw as i16,
        relative_soc,
        absolute_soc,
        remaining_capacity: remaining_cap,
        full_charge_capacity: full_charge_cap,
        run_time_to_empty: rte,
        average_time_to_empty: atte,
        average_time_to_full: attf,
        battery_status,
        cycle_count,
        cell_voltages_mv: parse_u16_array::<7>(&cell_v_bytes),
        cell_temperatures: parse_i16_array::<7>(&cell_t_bytes),
        cell_soc,
        fet_status,
        balancing_status: bal_status,
        at_rate: at_rate as i16,
        at_rate_time_to_full: at_rate_ttf,
        at_rate_time_to_empty: at_rate_tte,
        at_rate_ok,
        charging_current_ma: charging_current,
        charging_voltage_mv: charging_voltage,
        fet_state,
        balancing_control: bal_control,
        cell_soh: parse_u8_array::<7>(&cell_soh_bytes),
        cell_remaining_capacity: parse_u16_array::<7>(&cell_rc_bytes),
    })
}