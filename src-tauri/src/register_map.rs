use crate::types::*;

pub(crate) struct RegisterAddr {
    pub address: u8,
    pub num_registers: u16,
    pub byte_count: u32,
}

pub(crate) fn addr(name: &str) -> Option<RegisterAddr> {
    match name {
        "ManufacturerAccess"       => Some(RegisterAddr { address: 0x00, num_registers: 1, byte_count: 2 }),
        "RemainingCapacityAlarm"   => Some(RegisterAddr { address: 0x01, num_registers: 1, byte_count: 2 }),
        "RemainingTimeAlarm"       => Some(RegisterAddr { address: 0x02, num_registers: 1, byte_count: 2 }),
        "BatteryMode"              => Some(RegisterAddr { address: 0x03, num_registers: 1, byte_count: 2 }),
        "AtRate"                   => Some(RegisterAddr { address: 0x04, num_registers: 1, byte_count: 2 }),
        "AtRateTimeToFull"         => Some(RegisterAddr { address: 0x05, num_registers: 1, byte_count: 2 }),
        "AtRateTimeToEmpty"        => Some(RegisterAddr { address: 0x06, num_registers: 1, byte_count: 2 }),
        "AtRateOK"                 => Some(RegisterAddr { address: 0x07, num_registers: 1, byte_count: 2 }),
        "Temperature"              => Some(RegisterAddr { address: 0x08, num_registers: 1, byte_count: 2 }),
        "Voltage"                  => Some(RegisterAddr { address: 0x09, num_registers: 1, byte_count: 2 }),
        "Current"                  => Some(RegisterAddr { address: 0x0A, num_registers: 1, byte_count: 2 }),
        "AverageCurrent"           => Some(RegisterAddr { address: 0x0B, num_registers: 1, byte_count: 2 }),
        "MaxError"                 => Some(RegisterAddr { address: 0x0C, num_registers: 1, byte_count: 2 }),
        "RelativeStateOfCharge"    => Some(RegisterAddr { address: 0x0D, num_registers: 1, byte_count: 2 }),
        "AbsoluteStateOfCharge"    => Some(RegisterAddr { address: 0x0E, num_registers: 1, byte_count: 2 }),
        "RemainingCapacity"        => Some(RegisterAddr { address: 0x0F, num_registers: 1, byte_count: 2 }),
        "FullChargeCapacity"       => Some(RegisterAddr { address: 0x10, num_registers: 1, byte_count: 2 }),
        "RunTimeToEmpty"           => Some(RegisterAddr { address: 0x11, num_registers: 1, byte_count: 2 }),
        "AverageTimeToEmpty"       => Some(RegisterAddr { address: 0x12, num_registers: 1, byte_count: 2 }),
        "AverageTimeToFull"        => Some(RegisterAddr { address: 0x13, num_registers: 1, byte_count: 2 }),
        "ChargingCurrent"          => Some(RegisterAddr { address: 0x14, num_registers: 1, byte_count: 2 }),
        "ChargingVoltage"          => Some(RegisterAddr { address: 0x15, num_registers: 1, byte_count: 2 }),
        "BatteryStatus"            => Some(RegisterAddr { address: 0x16, num_registers: 1, byte_count: 2 }),
        "CycleCount"               => Some(RegisterAddr { address: 0x17, num_registers: 1, byte_count: 2 }),
        "DesignCapacity"           => Some(RegisterAddr { address: 0x18, num_registers: 1, byte_count: 2 }),
        "DesignVoltage"            => Some(RegisterAddr { address: 0x19, num_registers: 1, byte_count: 2 }),
        "SpecificationInfo"        => Some(RegisterAddr { address: 0x1A, num_registers: 1, byte_count: 2 }),
        "ManufactureDate"          => Some(RegisterAddr { address: 0x1B, num_registers: 1, byte_count: 2 }),
        "SerialNumber"             => Some(RegisterAddr { address: 0x1C, num_registers: 1, byte_count: 2 }),
        "ManufacturerName"         => Some(RegisterAddr { address: 0x20, num_registers: 16, byte_count: 32 }),
        "DeviceName"               => Some(RegisterAddr { address: 0x21, num_registers: 16, byte_count: 32 }),
        "DeviceChemistry"          => Some(RegisterAddr { address: 0x22, num_registers: 8,  byte_count: 16 }),
        "ManufacturerData"         => Some(RegisterAddr { address: 0x23, num_registers: 16, byte_count: 32 }),
        "Configuration"            => Some(RegisterAddr { address: 0x40, num_registers: 1, byte_count: 2 }),
        "MainControl"              => Some(RegisterAddr { address: 0x41, num_registers: 1, byte_count: 2 }),
        "FETState"                 => Some(RegisterAddr { address: 0x42, num_registers: 1, byte_count: 2 }),
        "VoltageProtectionControl" => Some(RegisterAddr { address: 0x43, num_registers: 8, byte_count: 16 }),
        "CurrentProtectionControl" => Some(RegisterAddr { address: 0x44, num_registers: 6, byte_count: 12 }),
        "TemperatureProtectionControl" => Some(RegisterAddr { address: 0x45, num_registers: 2, byte_count: 4 }),
        "OCV"                      => Some(RegisterAddr { address: 0x46, num_registers: 204, byte_count: 408 }),
        "Impedance"                => Some(RegisterAddr { address: 0x47, num_registers: 1428, byte_count: 2856 }),
        "CellVoltage"              => Some(RegisterAddr { address: 0x48, num_registers: 7, byte_count: 14 }),
        "CellTemperature"          => Some(RegisterAddr { address: 0x49, num_registers: 7, byte_count: 14 }),
        "FETStatus"                => Some(RegisterAddr { address: 0x4A, num_registers: 1, byte_count: 2 }),
        "CellSoC"                  => Some(RegisterAddr { address: 0x4B, num_registers: 4, byte_count: 7 }),
        "CellSoH"                  => Some(RegisterAddr { address: 0x4C, num_registers: 4, byte_count: 7 }),
        "CellRemainingCapacity"    => Some(RegisterAddr { address: 0x4D, num_registers: 7, byte_count: 14 }),
        "CellSelfDischarge"        => Some(RegisterAddr { address: 0x4E, num_registers: 7, byte_count: 14 }),
        "FaultSnapshot"            => Some(RegisterAddr { address: 0x4F, num_registers: 9, byte_count: 18 }),
        "FaultHistory"             => Some(RegisterAddr { address: 0x50, num_registers: 20, byte_count: 40 }),
        "ProtectionEventCounters"  => Some(RegisterAddr { address: 0x51, num_registers: 35, byte_count: 70 }),
        "CurrentSensorCalibration" => Some(RegisterAddr { address: 0x52, num_registers: 2, byte_count: 4 }),
        "VoltageCalibration"       => Some(RegisterAddr { address: 0x53, num_registers: 14, byte_count: 28 }),
        "TemperatureCalibration"   => Some(RegisterAddr { address: 0x54, num_registers: 1, byte_count: 1 }),
        "CellBalancingEnergy"      => Some(RegisterAddr { address: 0x55, num_registers: 7, byte_count: 14 }),
        "CellBalancingTime"        => Some(RegisterAddr { address: 0x56, num_registers: 7, byte_count: 14 }),
        "CellDeepestDischarge"     => Some(RegisterAddr { address: 0x57, num_registers: 4, byte_count: 7 }),
        "CellMaxTemperature"       => Some(RegisterAddr { address: 0x58, num_registers: 4, byte_count: 7 }),
        "CellQmax"                 => Some(RegisterAddr { address: 0x59, num_registers: 7, byte_count: 14 }),
        "FirmwareVersion"          => Some(RegisterAddr { address: 0x5A, num_registers: 16, byte_count: 32 }),
        "HardwareVersion"          => Some(RegisterAddr { address: 0x5B, num_registers: 16, byte_count: 32 }),
        "BoardSerialNumber"        => Some(RegisterAddr { address: 0x5C, num_registers: 16, byte_count: 32 }),
        "LastCommunicationTimestamp" => Some(RegisterAddr { address: 0x5D, num_registers: 2, byte_count: 4 }),
        "UptimeCounter"            => Some(RegisterAddr { address: 0x5E, num_registers: 1, byte_count: 2 }),
        "BalancingStatus"          => Some(RegisterAddr { address: 0x5F, num_registers: 1, byte_count: 2 }),
        "BalancingControl"         => Some(RegisterAddr { address: 0x60, num_registers: 1, byte_count: 2 }),
        _ => None,
    }
}

fn fd(name: &str, access: Access, field_type: FieldType) -> FieldDef {
    FieldDef { name: name.to_string(), access, field_type }
}

pub fn all_registers() -> Vec<RegisterDef> {
    vec![
        RegisterDef { name: "ManufacturerAccess".into(), access: Access::ReadWrite, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "RemainingCapacityAlarm".into(), access: Access::ReadWrite, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "RemainingTimeAlarm".into(), access: Access::ReadWrite, value_type: ValueType::Word, fields: vec![] },
        RegisterDef {
            name: "BatteryMode".into(), access: Access::ReadWrite, value_type: ValueType::Word,
            fields: vec![
                fd("CAPACITY_MODE",             Access::ReadWrite, FieldType::Bit(15)),
                fd("CHARGER_MODE",              Access::ReadWrite, FieldType::Bit(14)),
                fd("ALARM_MODE",                Access::ReadWrite, FieldType::Bit(13)),
                fd("PRIMARY_BATTERY",           Access::ReadWrite, FieldType::Bit(9)),
                fd("CHARGE_CONTROLLER_ENABLED", Access::ReadWrite, FieldType::Bit(8)),
                fd("CONDITION_FLAG",            Access::ReadWrite, FieldType::Bit(7)),
                fd("PRIMARY_BATTERY_SUPPORT",   Access::Read,      FieldType::Bit(1)),
                fd("INTERNAL_CHARGE_CONTROLLER",Access::Read,      FieldType::Bit(0)),
            ],
        },
        RegisterDef { name: "AtRate".into(), access: Access::ReadWrite, value_type: ValueType::SignedWord, fields: vec![] },
        RegisterDef { name: "AtRateTimeToFull".into(),  access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "AtRateTimeToEmpty".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "AtRateOK".into(),          access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "Temperature".into(),       access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "Voltage".into(),           access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "Current".into(),           access: Access::Read, value_type: ValueType::SignedWord, fields: vec![] },
        RegisterDef { name: "AverageCurrent".into(),    access: Access::Read, value_type: ValueType::SignedWord, fields: vec![] },
        RegisterDef { name: "MaxError".into(),          access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "RelativeStateOfCharge".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "AbsoluteStateOfCharge".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "RemainingCapacity".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "FullChargeCapacity".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "RunTimeToEmpty".into(),    access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "AverageTimeToEmpty".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "AverageTimeToFull".into(), access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "ChargingCurrent".into(),  access: Access::ReadWrite, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "ChargingVoltage".into(),  access: Access::ReadWrite, value_type: ValueType::Word, fields: vec![] },
        RegisterDef {
            name: "BatteryStatus".into(), access: Access::Read, value_type: ValueType::Word,
            fields: vec![
                fd("OVER_CHARGED_ALARM",        Access::Read, FieldType::Bit(15)),
                fd("TERMINATE_CHARGE_ALARM",    Access::Read, FieldType::Bit(14)),
                fd("OVER_TEMP_ALARM",           Access::Read, FieldType::Bit(12)),
                fd("TERMINATE_DISCHARGE_ALARM", Access::Read, FieldType::Bit(11)),
                fd("REMAINING_CAPACITY_ALARM",  Access::Read, FieldType::Bit(9)),
                fd("REMAINING_TIME_ALARM",      Access::Read, FieldType::Bit(8)),
                fd("INITIALIZED",               Access::Read, FieldType::Bit(7)),
                fd("DISCHARGING",               Access::Read, FieldType::Bit(6)),
                fd("FULLY_CHARGED",             Access::Read, FieldType::Bit(5)),
                fd("FULLY_DISCHARGED",          Access::Read, FieldType::Bit(4)),
                fd("ERROR_CODE",                Access::Read, FieldType::BitRange { high: 3, low: 0 }),
            ],
        },
        RegisterDef { name: "CycleCount".into(),       access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "DesignCapacity".into(),   access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef { name: "DesignVoltage".into(),    access: Access::Read, value_type: ValueType::Word, fields: vec![] },
        RegisterDef {
            name: "SpecificationInfo".into(), access: Access::Read, value_type: ValueType::Word,
            fields: vec![
                fd("IPScale",  Access::Read, FieldType::BitRange { high: 15, low: 12 }),
                fd("VScale",   Access::Read, FieldType::BitRange { high: 11, low: 8 }),
                fd("Version",  Access::Read, FieldType::BitRange { high: 7,  low: 4 }),
                fd("Revision", Access::Read, FieldType::BitRange { high: 3,  low: 0 }),
            ],
        },
        RegisterDef {
            name: "ManufactureDate".into(), access: Access::Read, value_type: ValueType::Word,
            fields: vec![
                fd("year_offset", Access::Read, FieldType::BitRange { high: 15, low: 9 }),
                fd("month",       Access::Read, FieldType::BitRange { high: 8,  low: 5 }),
                fd("day",         Access::Read, FieldType::BitRange { high: 4,  low: 0 }),
            ],
        },
        RegisterDef { name: "SerialNumber".into(),    access: Access::Read,      value_type: ValueType::Word,       fields: vec![] },
        RegisterDef { name: "ManufacturerName".into(),access: Access::Read,      value_type: ValueType::Block(32),  fields: vec![] },
        RegisterDef { name: "DeviceName".into(),      access: Access::Read,      value_type: ValueType::Block(32),  fields: vec![] },
        RegisterDef { name: "DeviceChemistry".into(), access: Access::Read,      value_type: ValueType::Block(16),  fields: vec![] },
        RegisterDef { name: "ManufacturerData".into(),access: Access::Read,      value_type: ValueType::Block(32),  fields: vec![] },
        RegisterDef {
            name: "Configuration".into(), access: Access::ReadWrite, value_type: ValueType::Word,
            fields: vec![
                fd("UART_ENABLED",  Access::ReadWrite, FieldType::Bit(6)),
                fd("CAN_ENABLED",   Access::ReadWrite, FieldType::Bit(5)),
                fd("I2C_ENABLED",   Access::ReadWrite, FieldType::Bit(4)),
                fd("CELL_COUNT",    Access::ReadWrite, FieldType::BitRange { high: 3, low: 0 }),
            ],
        },
        RegisterDef {
            name: "MainControl".into(), access: Access::ReadWrite, value_type: ValueType::Word,
            fields: vec![
                fd("TEMP_PROTECTIONS",    Access::ReadWrite, FieldType::Bit(5)),
                fd("CURRENT_PROTECTIONS", Access::ReadWrite, FieldType::Bit(4)),
                fd("VOLTAGE_PROTECTIONS", Access::ReadWrite, FieldType::Bit(3)),
                fd("TEST_MODE",           Access::ReadWrite, FieldType::Bit(1)),
                fd("OPENBMS_ENABLED",     Access::ReadWrite, FieldType::Bit(0)),
            ],
        },
        RegisterDef {
            name: "FETState".into(), access: Access::ReadWrite, value_type: ValueType::Word,
            fields: vec![
                fd("AUX_FET",  Access::ReadWrite, FieldType::Bit(1)),
                fd("MAIN_FET", Access::ReadWrite, FieldType::Bit(0)),
            ],
        },
        RegisterDef {
            name: "VoltageProtectionControl".into(), access: Access::ReadWrite, value_type: ValueType::Block(16),
            fields: vec![
                fd("slow_uvp_threshold_mv",      Access::ReadWrite, FieldType::ByteField { byte_offset: 0,  prim: PrimitiveType::U16 }),
                fd("slow_uvp_detection_time_ms", Access::ReadWrite, FieldType::ByteField { byte_offset: 2,  prim: PrimitiveType::U16 }),
                fd("fast_uvp_threshold_mv",      Access::ReadWrite, FieldType::ByteField { byte_offset: 4,  prim: PrimitiveType::U16 }),
                fd("fast_uvp_detection_time_ms", Access::ReadWrite, FieldType::ByteField { byte_offset: 6,  prim: PrimitiveType::U16 }),
                fd("slow_ovp_threshold_mv",      Access::ReadWrite, FieldType::ByteField { byte_offset: 8,  prim: PrimitiveType::U16 }),
                fd("slow_ovp_detection_time_ms", Access::ReadWrite, FieldType::ByteField { byte_offset: 10, prim: PrimitiveType::U16 }),
                fd("fast_ovp_threshold_mv",      Access::ReadWrite, FieldType::ByteField { byte_offset: 12, prim: PrimitiveType::U16 }),
                fd("fast_ovp_detection_time_ms", Access::ReadWrite, FieldType::ByteField { byte_offset: 14, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "CurrentProtectionControl".into(), access: Access::ReadWrite, value_type: ValueType::Block(12),
            fields: vec![
                fd("charge_ocp_threshold_ma",         Access::ReadWrite, FieldType::ByteField { byte_offset: 0,  prim: PrimitiveType::U16 }),
                fd("charge_ocp_detection_time_ms",    Access::ReadWrite, FieldType::ByteField { byte_offset: 2,  prim: PrimitiveType::U16 }),
                fd("slow_discharge_ocp_threshold_ma", Access::ReadWrite, FieldType::ByteField { byte_offset: 4,  prim: PrimitiveType::U16 }),
                fd("slow_discharge_ocp_time_ms",      Access::ReadWrite, FieldType::ByteField { byte_offset: 6,  prim: PrimitiveType::U16 }),
                fd("fast_discharge_ocp_threshold_ma", Access::ReadWrite, FieldType::ByteField { byte_offset: 8,  prim: PrimitiveType::U16 }),
                fd("fast_discharge_ocp_time_ms",      Access::ReadWrite, FieldType::ByteField { byte_offset: 10, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "TemperatureProtectionControl".into(), access: Access::ReadWrite, value_type: ValueType::Block(4),
            fields: vec![
                fd("otp_threshold_c",       Access::ReadWrite, FieldType::ByteField { byte_offset: 0, prim: PrimitiveType::U16 }),
                fd("otp_detection_time_ms", Access::ReadWrite, FieldType::ByteField { byte_offset: 2, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef { name: "OCV".into(),       access: Access::ReadWrite, value_type: ValueType::Block(408),  fields: vec![] },
        RegisterDef { name: "Impedance".into(), access: Access::ReadWrite, value_type: ValueType::Block(2856), fields: vec![] },
        RegisterDef {
            name: "CellVoltage".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_voltages_mv", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "CellTemperature".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_temperatures_dk", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::I16 }),
            ],
        },
        RegisterDef {
            name: "FETStatus".into(), access: Access::Read, value_type: ValueType::Word,
            fields: vec![
                fd("AUX_FET",  Access::Read, FieldType::Bit(1)),
                fd("MAIN_FET", Access::Read, FieldType::Bit(0)),
            ],
        },
        RegisterDef {
            name: "CellSoC".into(), access: Access::Read, value_type: ValueType::Block(7),
            fields: vec![
                fd("cell_soc_pct", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U8 }),
            ],
        },
        RegisterDef {
            name: "CellSoH".into(), access: Access::Read, value_type: ValueType::Block(7),
            fields: vec![
                fd("cell_soh_pct", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U8 }),
            ],
        },
        RegisterDef {
            name: "CellRemainingCapacity".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_remaining_mah", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "CellSelfDischarge".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_self_discharge_mah_month", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef { name: "FaultSnapshot".into(),           access: Access::Read, value_type: ValueType::Block(18), fields: vec![] },
        RegisterDef { name: "FaultHistory".into(),            access: Access::Read, value_type: ValueType::Block(40), fields: vec![] },
        RegisterDef { name: "ProtectionEventCounters".into(), access: Access::Read, value_type: ValueType::Block(70), fields: vec![] },
        RegisterDef {
            name: "CurrentSensorCalibration".into(), access: Access::ReadWrite, value_type: ValueType::Block(4),
            fields: vec![
                fd("offset", Access::ReadWrite, FieldType::ByteField { byte_offset: 0, prim: PrimitiveType::I16 }),
                fd("gain",   Access::ReadWrite, FieldType::ByteField { byte_offset: 2, prim: PrimitiveType::I16 }),
            ],
        },
        RegisterDef { name: "VoltageCalibration".into(),     access: Access::ReadWrite, value_type: ValueType::Block(28), fields: vec![] },
        RegisterDef { name: "TemperatureCalibration".into(), access: Access::ReadWrite, value_type: ValueType::Block(1),  fields: vec![] },
        RegisterDef {
            name: "CellBalancingEnergy".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_balancing_energy_mwh", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "CellBalancingTime".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_balancing_time_min", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef {
            name: "CellDeepestDischarge".into(), access: Access::Read, value_type: ValueType::Block(7),
            fields: vec![
                fd("cell_deepest_discharge_pct", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U8 }),
            ],
        },
        RegisterDef {
            name: "CellMaxTemperature".into(), access: Access::Read, value_type: ValueType::Block(7),
            fields: vec![
                fd("cell_max_temp_c", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U8 }),
            ],
        },
        RegisterDef {
            name: "CellQmax".into(), access: Access::Read, value_type: ValueType::Block(14),
            fields: vec![
                fd("cell_qmax_mah", Access::Read, FieldType::PrimitiveArray { count: 7, prim: PrimitiveType::U16 }),
            ],
        },
        RegisterDef { name: "FirmwareVersion".into(),            access: Access::Read, value_type: ValueType::Block(32), fields: vec![] },
        RegisterDef { name: "HardwareVersion".into(),            access: Access::Read, value_type: ValueType::Block(32), fields: vec![] },
        RegisterDef { name: "BoardSerialNumber".into(),          access: Access::Read, value_type: ValueType::Block(32), fields: vec![] },
        RegisterDef { name: "LastCommunicationTimestamp".into(), access: Access::Read, value_type: ValueType::Block(4),  fields: vec![] },
        RegisterDef { name: "UptimeCounter".into(),              access: Access::Read, value_type: ValueType::Word,      fields: vec![] },
        RegisterDef {
            name: "BalancingStatus".into(), access: Access::Read, value_type: ValueType::Word,
            fields: vec![
                fd("cell7", Access::Read, FieldType::Bit(6)),
                fd("cell6", Access::Read, FieldType::Bit(5)),
                fd("cell5", Access::Read, FieldType::Bit(4)),
                fd("cell4", Access::Read, FieldType::Bit(3)),
                fd("cell3", Access::Read, FieldType::Bit(2)),
                fd("cell2", Access::Read, FieldType::Bit(1)),
                fd("cell1", Access::Read, FieldType::Bit(0)),
            ],
        },
        RegisterDef {
            name: "BalancingControl".into(), access: Access::ReadWrite, value_type: ValueType::Word,
            fields: vec![
                fd("cell7", Access::ReadWrite, FieldType::Bit(6)),
                fd("cell6", Access::ReadWrite, FieldType::Bit(5)),
                fd("cell5", Access::ReadWrite, FieldType::Bit(4)),
                fd("cell4", Access::ReadWrite, FieldType::Bit(3)),
                fd("cell3", Access::ReadWrite, FieldType::Bit(2)),
                fd("cell2", Access::ReadWrite, FieldType::Bit(1)),
                fd("cell1", Access::ReadWrite, FieldType::Bit(0)),
            ],
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn known_registers_have_addresses() {
        assert!(addr("Voltage").is_some());
        assert!(addr("CellVoltage").is_some());
        assert!(addr("FETState").is_some());
        assert!(addr("VoltageProtectionControl").is_some());
    }

    #[test]
    fn unknown_register_returns_none() {
        assert!(addr("NonExistentRegister").is_none());
    }

    #[test]
    fn all_registers_have_addresses() {
        for reg in all_registers() {
            assert!(
                addr(&reg.name).is_some(),
                "register '{}' is in all_registers() but has no address in addr()",
                reg.name
            );
        }
    }
}