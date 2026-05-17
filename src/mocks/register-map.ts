import type { RegisterDef } from "@/bindings";

export const MOCK_REGISTER_MAP: RegisterDef[] = [
    // ── SBS standard registers (0x00–0x23) ──────────────────────────────────
    {
        name: "ManufacturerAccess",
        access: "ReadWrite",
        value_type: "Word",
        fields: [],
    },
    {
        name: "RemainingCapacityAlarm",
        access: "ReadWrite",
        value_type: "Word",
        fields: [],
    },
    {
        name: "RemainingTimeAlarm",
        access: "ReadWrite",
        value_type: "Word",
        fields: [],
    },
    {
        name: "BatteryMode",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            {
                name: "CAPACITY_MODE",
                access: "ReadWrite",
                field_type: { Bit: 15 },
            },
            {
                name: "CHARGER_MODE",
                access: "ReadWrite",
                field_type: { Bit: 14 },
            },
            {
                name: "ALARM_MODE",
                access: "ReadWrite",
                field_type: { Bit: 13 },
            },
            {
                name: "PRIMARY_BATTERY",
                access: "ReadWrite",
                field_type: { Bit: 9 },
            },
            {
                name: "CHARGE_CONTROLLER_ENABLED",
                access: "ReadWrite",
                field_type: { Bit: 8 },
            },
            {
                name: "CONDITION_FLAG",
                access: "ReadWrite",
                field_type: { Bit: 7 },
            },
            {
                name: "PRIMARY_BATTERY_SUPPORT",
                access: "Read",
                field_type: { Bit: 1 },
            },
            {
                name: "INTERNAL_CHARGE_CONTROLLER",
                access: "Read",
                field_type: { Bit: 0 },
            },
        ],
    },
    {
        name: "AtRate",
        access: "ReadWrite",
        value_type: "SignedWord",
        fields: [],
    },
    {
        name: "AtRateTimeToFull",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "AtRateTimeToEmpty",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    { name: "AtRateOK", access: "Read", value_type: "Word", fields: [] },
    { name: "Temperature", access: "Read", value_type: "Word", fields: [] },
    { name: "Voltage", access: "Read", value_type: "Word", fields: [] },
    { name: "Current", access: "Read", value_type: "SignedWord", fields: [] },
    {
        name: "AverageCurrent",
        access: "Read",
        value_type: "SignedWord",
        fields: [],
    },
    { name: "MaxError", access: "Read", value_type: "Word", fields: [] },
    {
        name: "RelativeStateOfCharge",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "AbsoluteStateOfCharge",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "RemainingCapacity",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "FullChargeCapacity",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    { name: "RunTimeToEmpty", access: "Read", value_type: "Word", fields: [] },
    {
        name: "AverageTimeToEmpty",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "AverageTimeToFull",
        access: "Read",
        value_type: "Word",
        fields: [],
    },
    {
        name: "ChargingCurrent",
        access: "ReadWrite",
        value_type: "Word",
        fields: [],
    },
    {
        name: "ChargingVoltage",
        access: "ReadWrite",
        value_type: "Word",
        fields: [],
    },
    {
        name: "BatteryStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            {
                name: "OVER_CHARGED_ALARM",
                access: "Read",
                field_type: { Bit: 15 },
            },
            {
                name: "TERMINATE_CHARGE_ALARM",
                access: "Read",
                field_type: { Bit: 14 },
            },
            {
                name: "OVER_TEMP_ALARM",
                access: "Read",
                field_type: { Bit: 12 },
            },
            {
                name: "TERMINATE_DISCHARGE_ALARM",
                access: "Read",
                field_type: { Bit: 11 },
            },
            {
                name: "REMAINING_CAPACITY_ALARM",
                access: "Read",
                field_type: { Bit: 9 },
            },
            {
                name: "REMAINING_TIME_ALARM",
                access: "Read",
                field_type: { Bit: 8 },
            },
            { name: "INITIALIZED", access: "Read", field_type: { Bit: 7 } },
            { name: "DISCHARGING", access: "Read", field_type: { Bit: 6 } },
            { name: "FULLY_CHARGED", access: "Read", field_type: { Bit: 5 } },
            {
                name: "FULLY_DISCHARGED",
                access: "Read",
                field_type: { Bit: 4 },
            },
            {
                name: "ERROR_CODE",
                access: "Read",
                field_type: { BitRange: { high: 3, low: 0 } },
            },
        ],
    },
    { name: "CycleCount", access: "Read", value_type: "Word", fields: [] },
    { name: "DesignCapacity", access: "Read", value_type: "Word", fields: [] },
    { name: "DesignVoltage", access: "Read", value_type: "Word", fields: [] },
    {
        name: "SpecificationInfo",
        access: "Read",
        value_type: "Word",
        fields: [
            {
                name: "IPScale",
                access: "Read",
                field_type: { BitRange: { high: 15, low: 12 } },
            },
            {
                name: "VScale",
                access: "Read",
                field_type: { BitRange: { high: 11, low: 8 } },
            },
            {
                name: "Version",
                access: "Read",
                field_type: { BitRange: { high: 7, low: 4 } },
            },
            {
                name: "Revision",
                access: "Read",
                field_type: { BitRange: { high: 3, low: 0 } },
            },
        ],
    },
    {
        name: "ManufactureDate",
        access: "Read",
        value_type: "Word",
        fields: [
            {
                name: "year_offset",
                access: "Read",
                field_type: { BitRange: { high: 15, low: 9 } },
            },
            {
                name: "month",
                access: "Read",
                field_type: { BitRange: { high: 8, low: 5 } },
            },
            {
                name: "day",
                access: "Read",
                field_type: { BitRange: { high: 4, low: 0 } },
            },
        ],
    },
    { name: "SerialNumber", access: "Read", value_type: "Word", fields: [] },
    {
        name: "ManufacturerName",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },
    {
        name: "DeviceName",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },
    {
        name: "DeviceChemistry",
        access: "Read",
        value_type: { Block: 16 },
        fields: [],
    },
    {
        name: "ManufacturerData",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },

    // ── OpenBMS extended registers (0x40–0x60) ───────────────────────────────
    {
        name: "Configuration",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            {
                name: "UART_ENABLED",
                access: "ReadWrite",
                field_type: { Bit: 6 },
            },
            {
                name: "CAN_ENABLED",
                access: "ReadWrite",
                field_type: { Bit: 5 },
            },
            {
                name: "I2C_ENABLED",
                access: "ReadWrite",
                field_type: { Bit: 4 },
            },
            {
                name: "CELL_COUNT",
                access: "ReadWrite",
                field_type: { BitRange: { high: 3, low: 0 } },
            },
        ],
    },
    {
        name: "MainControl",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            {
                name: "TEMP_PROTECTIONS",
                access: "ReadWrite",
                field_type: { Bit: 5 },
            },
            {
                name: "CURRENT_PROTECTIONS",
                access: "ReadWrite",
                field_type: { Bit: 4 },
            },
            {
                name: "VOLTAGE_PROTECTIONS",
                access: "ReadWrite",
                field_type: { Bit: 3 },
            },
            { name: "TEST_MODE", access: "ReadWrite", field_type: { Bit: 1 } },
            {
                name: "OPENBMS_ENABLED",
                access: "ReadWrite",
                field_type: { Bit: 0 },
            },
        ],
    },
    {
        name: "FETState",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            { name: "AUX_FET", access: "ReadWrite", field_type: { Bit: 1 } },
            { name: "MAIN_FET", access: "ReadWrite", field_type: { Bit: 0 } },
        ],
    },
    {
        name: "VoltageProtectionControl",
        access: "ReadWrite",
        value_type: { Block: 16 },
        fields: [
            {
                name: "slow_uvp_threshold_mv",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 0, prim: "U16" } },
            },
            {
                name: "slow_uvp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 2, prim: "U16" } },
            },
            {
                name: "fast_uvp_threshold_mv",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 4, prim: "U16" } },
            },
            {
                name: "fast_uvp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 6, prim: "U16" } },
            },
            {
                name: "slow_ovp_threshold_mv",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 8, prim: "U16" } },
            },
            {
                name: "slow_ovp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 10, prim: "U16" } },
            },
            {
                name: "fast_ovp_threshold_mv",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 12, prim: "U16" } },
            },
            {
                name: "fast_ovp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 14, prim: "U16" } },
            },
        ],
    },
    {
        name: "CurrentProtectionControl",
        access: "ReadWrite",
        value_type: { Block: 12 },
        fields: [
            {
                name: "charge_ocp_threshold_ma",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 0, prim: "U16" } },
            },
            {
                name: "charge_ocp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 2, prim: "U16" } },
            },
            {
                name: "slow_discharge_ocp_threshold_ma",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 4, prim: "U16" } },
            },
            {
                name: "slow_discharge_ocp_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 6, prim: "U16" } },
            },
            {
                name: "fast_discharge_ocp_threshold_ma",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 8, prim: "U16" } },
            },
            {
                name: "fast_discharge_ocp_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 10, prim: "U16" } },
            },
        ],
    },
    {
        name: "TemperatureProtectionControl",
        access: "ReadWrite",
        value_type: { Block: 4 },
        fields: [
            {
                name: "otp_threshold_c",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 0, prim: "U16" } },
            },
            {
                name: "otp_detection_time_ms",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 2, prim: "U16" } },
            },
        ],
    },
    {
        name: "OCV",
        access: "ReadWrite",
        value_type: { Block: 408 },
        fields: [],
    },
    {
        name: "Impedance",
        access: "ReadWrite",
        value_type: { Block: 2856 },
        fields: [],
    },
    {
        name: "CellVoltage",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_voltages_mv",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "CellTemperature",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_temperatures_dk",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "I16" } },
            },
        ],
    },
    {
        name: "FETStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            { name: "AUX_FET", access: "Read", field_type: { Bit: 1 } },
            { name: "MAIN_FET", access: "Read", field_type: { Bit: 0 } },
        ],
    },
    {
        name: "CellSoC",
        access: "Read",
        value_type: { Block: 7 },
        fields: [
            {
                name: "cell_soc_pct",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U8" } },
            },
        ],
    },
    {
        name: "CellSoH",
        access: "Read",
        value_type: { Block: 7 },
        fields: [
            {
                name: "cell_soh_pct",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U8" } },
            },
        ],
    },
    {
        name: "CellRemainingCapacity",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_remaining_mah",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "CellSelfDischarge",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_self_discharge_mah_month",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "FaultSnapshot",
        access: "Read",
        value_type: { Block: 18 },
        fields: [],
    },
    {
        name: "FaultHistory",
        access: "Read",
        value_type: { Block: 40 },
        fields: [],
    },
    {
        name: "ProtectionEventCounters",
        access: "Read",
        value_type: { Block: 70 },
        fields: [],
    },
    {
        name: "CurrentSensorCalibration",
        access: "ReadWrite",
        value_type: { Block: 4 },
        fields: [
            {
                name: "offset",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 0, prim: "I16" } },
            },
            {
                name: "gain",
                access: "ReadWrite",
                field_type: { ByteField: { byte_offset: 2, prim: "I16" } },
            },
        ],
    },
    {
        name: "VoltageCalibration",
        access: "ReadWrite",
        value_type: { Block: 28 },
        fields: [],
    },
    {
        name: "TemperatureCalibration",
        access: "ReadWrite",
        value_type: { Block: 1 },
        fields: [],
    },
    {
        name: "CellBalancingEnergy",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_balancing_energy_mwh",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "CellBalancingTime",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_balancing_time_min",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "CellDeepestDischarge",
        access: "Read",
        value_type: { Block: 7 },
        fields: [
            {
                name: "cell_deepest_discharge_pct",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U8" } },
            },
        ],
    },
    {
        name: "CellMaxTemperature",
        access: "Read",
        value_type: { Block: 7 },
        fields: [
            {
                name: "cell_max_temp_c",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U8" } },
            },
        ],
    },
    {
        name: "CellQmax",
        access: "Read",
        value_type: { Block: 14 },
        fields: [
            {
                name: "cell_qmax_mah",
                access: "Read",
                field_type: { PrimitiveArray: { count: 7, prim: "U16" } },
            },
        ],
    },
    {
        name: "FirmwareVersion",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },
    {
        name: "HardwareVersion",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },
    {
        name: "BoardSerialNumber",
        access: "Read",
        value_type: { Block: 32 },
        fields: [],
    },
    {
        name: "LastCommunicationTimestamp",
        access: "Read",
        value_type: { Block: 4 },
        fields: [],
    },
    {
        name: "UptimeCounter",
        access: "Read",
        value_type: { Block: 4 },
        fields: [],
    },
    {
        name: "BalancingStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            { name: "cell7", access: "Read", field_type: { Bit: 6 } },
            { name: "cell6", access: "Read", field_type: { Bit: 5 } },
            { name: "cell5", access: "Read", field_type: { Bit: 4 } },
            { name: "cell4", access: "Read", field_type: { Bit: 3 } },
            { name: "cell3", access: "Read", field_type: { Bit: 2 } },
            { name: "cell2", access: "Read", field_type: { Bit: 1 } },
            { name: "cell1", access: "Read", field_type: { Bit: 0 } },
        ],
    },
    {
        name: "BalancingControl",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            { name: "cell7", access: "ReadWrite", field_type: { Bit: 6 } },
            { name: "cell6", access: "ReadWrite", field_type: { Bit: 5 } },
            { name: "cell5", access: "ReadWrite", field_type: { Bit: 4 } },
            { name: "cell4", access: "ReadWrite", field_type: { Bit: 3 } },
            { name: "cell3", access: "ReadWrite", field_type: { Bit: 2 } },
            { name: "cell2", access: "ReadWrite", field_type: { Bit: 1 } },
            { name: "cell1", access: "ReadWrite", field_type: { Bit: 0 } },
        ],
    },
];
