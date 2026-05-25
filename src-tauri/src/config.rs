use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct BmsConfig {
    pub version: u32,
    pub battery_mode: u16,
    pub at_rate: i16,
    pub charging_current_ma: u16,
    pub charging_voltage_mv: u16,
    pub configuration: u16,
    pub main_control: u16,
    pub fet_state: u16,
    pub balancing_control: u16,
    pub protection_voltage: Vec<u8>,
    pub protection_current: Vec<u8>,
    pub protection_temperature: Vec<u8>,
    pub calibration_current: Vec<u8>,
    pub calibration_voltage: Vec<u8>,
    pub calibration_temperature: Vec<u8>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip_serialization() {
        let config = BmsConfig {
            version: 1,
            battery_mode: 0x6001,
            at_rate: -500,
            charging_current_ma: 2000,
            charging_voltage_mv: 25200,
            configuration: 0x0007,
            main_control: 0x0007,
            fet_state: 0x0003,
            balancing_control: 0x007F,
            protection_voltage: vec![0xAA; 16],
            protection_current: vec![0xBB; 12],
            protection_temperature: vec![0xCC; 4],
            calibration_current: vec![0xDD; 4],
            calibration_voltage: vec![0xEE; 28],
            calibration_temperature: vec![0xFF; 1],
        };

        let json = serde_json::to_string(&config).unwrap();
        let decoded: BmsConfig = serde_json::from_str(&json).unwrap();

        assert_eq!(decoded.version, 1);
        assert_eq!(decoded.battery_mode, 0x6001);
        assert_eq!(decoded.at_rate, -500);
        assert_eq!(decoded.charging_current_ma, 2000);
        assert_eq!(decoded.charging_voltage_mv, 25200);
        assert_eq!(decoded.protection_voltage, vec![0xAAu8; 16]);
        assert_eq!(decoded.calibration_voltage.len(), 28);
    }
}
