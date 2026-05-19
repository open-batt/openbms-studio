use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct BmsData {
    // SBS standard registers (0x08–0x17)
    pub temperature_dk: u16,         // 0x08 — 0.1 K units
    pub voltage_mv: u16,             // 0x09 — mV
    pub current_ma: i16,             // 0x0A — signed mA
    pub average_current_ma: i16,     // 0x0B — signed mA, 1-min rolling average
    pub relative_soc: u8,            // 0x0D — % of FullChargeCapacity
    pub absolute_soc: u8,            // 0x0E — % of DesignCapacity
    pub remaining_capacity: u16,     // 0x0F — mAh
    pub full_charge_capacity: u16,   // 0x10 — mAh
    pub run_time_to_empty: u16,      // 0x11 — minutes; 65535 = not discharging
    pub average_time_to_empty: u16,  // 0x12 — minutes; 65535 = not discharging
    pub average_time_to_full: u16,   // 0x13 — minutes; 65535 = not charging
    pub battery_status: u16,         // 0x16 — bitfield (see BatteryStatus register)
    pub cycle_count: u16,            // 0x17
    // OpenBMS extended registers
    pub cell_voltages_mv: [u16; 7],  // 0x48 — per-cell mV
    pub cell_temperatures: [i16; 7], // 0x49 — per-cell 0.1°C (signed)
    pub cell_soc: [u8; 7],           // 0x4B — per-cell %
    pub fet_status: u16,             // 0x4A — bit 0: main FETs, bit 1: aux FET
    pub balancing_status: u16,       // 0x5F — bitmask, bit N = cell N+1 balancing
    // Charging / AtRate (0x04–0x07, 0x14–0x15)
    pub at_rate: i16,                         // 0x04 — mA, negative = discharge
    pub at_rate_time_to_full: u16,            // 0x05 — minutes; 65535 = not charging
    pub at_rate_time_to_empty: u16,           // 0x06 — minutes; 65535 = not discharging
    pub at_rate_ok: u16,                      // 0x07 — 0 = battery would be exhausted
    pub charging_current_ma: u16,             // 0x14 — mA
    pub charging_voltage_mv: u16,             // 0x15 — mV
    // Control (0x42, 0x60)
    pub fet_state: u16,                       // 0x42 — bitfield, mirrors FETStatus
    pub balancing_control: u16,               // 0x60 — bitmask, bit N enables balancing on cell N+1
    // Per-cell extended (0x4C–0x4D)
    pub cell_soh: [u8; 7],                    // 0x4C — per-cell state-of-health %
    pub cell_remaining_capacity: [u16; 7],    // 0x4D — per-cell remaining capacity mAh
}