import type { RegisterDef } from "@/bindings";

export const MOCK_REGISTER_MAP: RegisterDef[] = [
    // ── Value registers ──────────────────────────────────────────────────────
    { name: "Voltage", access: "Read", value_type: "Word", fields: [] },
    { name: "ChargingVoltage", access: "Read", value_type: "Word", fields: [] },
    { name: "DesignVoltage", access: "Read", value_type: "Word", fields: [] },
    { name: "Current", access: "Read", value_type: "SignedWord", fields: [] },
    {
        name: "AverageCurrent",
        access: "Read",
        value_type: "SignedWord",
        fields: [],
    },
    { name: "ChargingCurrent", access: "Read", value_type: "Word", fields: [] },
    {
        name: "AtRate",
        access: "ReadWrite",
        value_type: "SignedWord",
        fields: [],
    },
    { name: "Temperature", access: "Read", value_type: "Word", fields: [] },
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
    { name: "DesignCapacity", access: "Read", value_type: "Word", fields: [] },
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
    { name: "CycleCount", access: "Read", value_type: "Word", fields: [] },

    // ── Bit-flag registers ────────────────────────────────────────────────────
    {
        name: "BatteryStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            { name: "OCA", access: "Read", field_type: { Bit: 15 } }, // Over-Charged Alarm
            { name: "TCA", access: "Read", field_type: { Bit: 14 } }, // Terminate Charge Alarm
            { name: "OTA", access: "Read", field_type: { Bit: 12 } }, // Over-Temp Alarm
            { name: "TDA", access: "Read", field_type: { Bit: 11 } }, // Terminate Discharge Alarm
            { name: "RCA", access: "Read", field_type: { Bit: 9 } }, // Remaining Capacity Alarm
            { name: "RTA", access: "Read", field_type: { Bit: 8 } }, // Remaining Time Alarm
            { name: "INIT", access: "Read", field_type: { Bit: 7 } }, // Initialized
            { name: "DSG", access: "Read", field_type: { Bit: 6 } }, // Discharging
            { name: "FC", access: "Read", field_type: { Bit: 5 } }, // Fully Charged
            { name: "FD", access: "Read", field_type: { Bit: 4 } }, // Fully Discharged
        ],
    },
    {
        name: "FETStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            { name: "PDSG", access: "Read", field_type: { Bit: 3 } }, // Pre-discharge FET
            { name: "PCHG", access: "Read", field_type: { Bit: 2 } }, // Pre-charge FET
            { name: "DSG", access: "Read", field_type: { Bit: 1 } }, // Discharge FET
            { name: "CHG", access: "Read", field_type: { Bit: 0 } }, // Charge FET
        ],
    },
    {
        name: "BalancingStatus",
        access: "Read",
        value_type: "Word",
        fields: [
            { name: "CB6", access: "Read", field_type: { Bit: 6 } },
            { name: "CB5", access: "Read", field_type: { Bit: 5 } },
            { name: "CB4", access: "Read", field_type: { Bit: 4 } },
            { name: "CB3", access: "Read", field_type: { Bit: 3 } },
            { name: "CB2", access: "Read", field_type: { Bit: 2 } },
            { name: "CB1", access: "Read", field_type: { Bit: 1 } },
            { name: "CB0", access: "Read", field_type: { Bit: 0 } },
        ],
    },
    {
        name: "BalancingControl",
        access: "ReadWrite",
        value_type: "Word",
        fields: [
            { name: "AUTO_BAL", access: "ReadWrite", field_type: { Bit: 1 } },
            { name: "BAL_EN", access: "ReadWrite", field_type: { Bit: 0 } },
        ],
    },
];
