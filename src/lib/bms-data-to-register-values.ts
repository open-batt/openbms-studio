import type { BmsData } from "@/bindings/BmsData";
import type { RegisterValue } from "@/bindings/RegisterValue";

function u16ArrayToBlock(arr: ArrayLike<number>): number[] {
    const out: number[] = [];
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i] & 0xffff;
        out.push((v >> 8) & 0xff, v & 0xff);
    }
    return out;
}

function i16ArrayToBlock(arr: ArrayLike<number>): number[] {
    return u16ArrayToBlock(arr); // bit pattern is identical; i16 as u16
}

export function bmsDataToRegisterValues(
    data: BmsData,
): Map<string, RegisterValue> {
    const m = new Map<string, RegisterValue>();

    // Scalar Word registers
    m.set("Temperature", { Word: data.temperature_dk });
    m.set("Voltage", { Word: data.voltage_mv });
    m.set("RelativeStateOfCharge", { Word: data.relative_soc });
    m.set("AbsoluteStateOfCharge", { Word: data.absolute_soc });
    m.set("RemainingCapacity", { Word: data.remaining_capacity });
    m.set("FullChargeCapacity", { Word: data.full_charge_capacity });
    m.set("RunTimeToEmpty", { Word: data.run_time_to_empty });
    m.set("AverageTimeToEmpty", { Word: data.average_time_to_empty });
    m.set("AverageTimeToFull", { Word: data.average_time_to_full });
    m.set("BatteryStatus", { Word: data.battery_status });
    m.set("CycleCount", { Word: data.cycle_count });
    m.set("FETStatus", { Word: data.fet_status });
    m.set("BalancingStatus", { Word: data.balancing_status });
    m.set("AtRateTimeToFull", { Word: data.at_rate_time_to_full });
    m.set("AtRateTimeToEmpty", { Word: data.at_rate_time_to_empty });
    m.set("AtRateOK", { Word: data.at_rate_ok });
    m.set("ChargingCurrent", { Word: data.charging_current_ma });
    m.set("ChargingVoltage", { Word: data.charging_voltage_mv });
    m.set("FETState", { Word: data.fet_state });
    m.set("BalancingControl", { Word: data.balancing_control });

    // Signed Word registers
    m.set("Current", { SignedWord: data.current_ma });
    m.set("AverageCurrent", { SignedWord: data.average_current_ma });
    m.set("AtRate", { SignedWord: data.at_rate });

    // Block: arrays of u16 (big-endian, 2 bytes per element)
    m.set("CellVoltage", { Block: u16ArrayToBlock(data.cell_voltages_mv) });
    m.set("CellTemperature", {
        Block: i16ArrayToBlock(data.cell_temperatures),
    });
    m.set("CellRemainingCapacity", {
        Block: u16ArrayToBlock(data.cell_remaining_capacity),
    });

    // Block: arrays of u8 (1 byte per element)
    m.set("CellSoC", { Block: Array.from(data.cell_soc) });
    m.set("CellSoH", { Block: Array.from(data.cell_soh) });

    return m;
}
