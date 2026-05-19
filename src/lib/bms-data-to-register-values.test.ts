import { describe, expect, it } from "vitest";
import type { BmsData } from "@/bindings";
import { bmsDataToRegisterValues } from "./bms-data-to-register-values";

const base: BmsData = {
    temperature_dk: 2983,
    voltage_mv: 23000,
    current_ma: -1200,
    average_current_ma: -1150,
    relative_soc: 65,
    absolute_soc: 63,
    remaining_capacity: 3900,
    full_charge_capacity: 6000,
    run_time_to_empty: 195,
    average_time_to_empty: 200,
    average_time_to_full: 65535,
    battery_status: 0,
    cycle_count: 42,
    fet_status: 1,
    balancing_status: 0,
    cell_voltages_mv: [3290, 3285, 3295, 3300, 3288, 3292, 3250],
    cell_temperatures: [250, 248, 252, 251, 249, 253, 247],
    cell_soc: [66, 65, 67, 65, 64, 66, 65],
    at_rate: -1200,
    at_rate_time_to_full: 65535,
    at_rate_time_to_empty: 195,
    at_rate_ok: 1,
    charging_current_ma: 0,
    charging_voltage_mv: 0,
    fet_state: 1,
    balancing_control: 0,
    cell_soh: [98, 97, 99, 98, 97, 99, 96],
    cell_remaining_capacity: [555, 550, 560, 558, 552, 557, 528],
};

describe("bmsDataToRegisterValues", () => {
    it("maps scalar Word fields", () => {
        const m = bmsDataToRegisterValues(base);
        expect(m.get("Voltage")).toEqual({ Word: 23000 });
        expect(m.get("CycleCount")).toEqual({ Word: 42 });
        expect(m.get("RelativeStateOfCharge")).toEqual({ Word: 65 });
    });

    it("maps scalar SignedWord fields", () => {
        const m = bmsDataToRegisterValues(base);
        expect(m.get("Current")).toEqual({ SignedWord: -1200 });
        expect(m.get("AtRate")).toEqual({ SignedWord: -1200 });
    });

    it("encodes CellVoltage as big-endian Block", () => {
        const m = bmsDataToRegisterValues(base);
        const block = m.get("CellVoltage");
        expect(block).toBeDefined();
        if (!block || !("Block" in block)) throw new Error("expected Block");
        // 3290 = 0x0CDA → bytes [0x0C, 0xDA]
        expect(block.Block[0]).toBe(0x0c);
        expect(block.Block[1]).toBe(0xda);
        expect(block.Block.length).toBe(14); // 7 × 2 bytes
    });

    it("encodes CellSoC as byte Block", () => {
        const m = bmsDataToRegisterValues(base);
        const block = m.get("CellSoC");
        expect(block).toBeDefined();
        if (!block || !("Block" in block)) throw new Error("expected Block");
        expect(block.Block).toEqual([66, 65, 67, 65, 64, 66, 65]);
    });

    it("encodes CellSoH as byte Block", () => {
        const m = bmsDataToRegisterValues(base);
        const block = m.get("CellSoH");
        expect(block).toBeDefined();
        if (!block || !("Block" in block)) throw new Error("expected Block");
        expect(block.Block).toEqual([98, 97, 99, 98, 97, 99, 96]);
    });
});
