import { Accordion, Grid } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import type { RegisterDef } from "@/bindings";
import { BitFlagRegister } from "@/components/BitFlagRegister";
import { RegisterTable, type RegisterEntry } from "@/components/RegisterTable";
import { cellRows, scalarRows } from "@/components/RegisterTable/rows";

// ── Pack-level sub-groups (kept from original layout) ───────────────────────
const PACK_GROUPS: Record<string, string[]> = {
    Voltages: ["Voltage", "ChargingVoltage", "DesignVoltage"],
    Currents: ["Current", "AverageCurrent", "ChargingCurrent", "AtRate"],
    Temperatures: ["Temperature"],
    Capacities: ["RemainingCapacity", "FullChargeCapacity", "DesignCapacity"],
    Percentages: [
        "RelativeStateOfCharge",
        "AbsoluteStateOfCharge",
        "CycleCount",
    ],
};

const TIMERS = ["RunTimeToEmpty", "AverageTimeToEmpty", "AverageTimeToFull"];

const STATUS_BIT_REGISTERS = ["BatteryStatus", "FETStatus", "BalancingStatus"];
const CONTROL_BIT_REGISTERS = ["FETState", "BalancingControl"];

const CHARGING_REGISTERS = [
    "ChargingCurrent",
    "ChargingVoltage",
    "AtRate",
    "AtRateTimeToFull",
    "AtRateTimeToEmpty",
    "AtRateOK",
];

const DESIGN_REGISTERS = [
    "DesignCapacity",
    "DesignVoltage",
    "CycleCount",
    "SpecificationInfo",
    "ManufactureDate",
    "SerialNumber",
];

const IDENTITY_REGISTERS = [
    "FirmwareVersion",
    "HardwareVersion",
    "BoardSerialNumber",
    "ManufacturerName",
    "DeviceName",
    "DeviceChemistry",
    "ManufacturerData",
    "UptimeCounter",
    "LastCommunicationTimestamp",
];

const CELL_HISTORY: Array<{ name: string; title: string }> = [
    { name: "CellQmax", title: "Cell Qmax" },
    { name: "CellSelfDischarge", title: "Cell Self-Discharge" },
    { name: "CellBalancingEnergy", title: "Cell Balancing Energy" },
    { name: "CellBalancingTime", title: "Cell Balancing Time" },
    { name: "CellDeepestDischarge", title: "Cell Deepest Discharge" },
    { name: "CellMaxTemperature", title: "Cell Max Temperature" },
];

const PROTECTION_REGISTERS = [
    "VoltageProtectionControl",
    "CurrentProtectionControl",
    "TemperatureProtectionControl",
    "RemainingCapacityAlarm",
    "RemainingTimeAlarm",
];

const CONFIG_BIT_REGISTERS = ["Configuration", "MainControl", "BatteryMode"];
const CONFIG_VALUE_REGISTERS = ["ManufacturerAccess"];

const FAULT_REGISTERS = [
    "FaultSnapshot",
    "FaultHistory",
    "ProtectionEventCounters",
];

const CALIBRATION_REGISTERS = [
    "CurrentSensorCalibration",
    "VoltageCalibration",
    "TemperatureCalibration",
];

const DEFAULT_OPEN = [
    "pack-readings",
    "timers",
    "cell-voltages",
    "cell-temperatures",
    "cell-state",
    "status-flags",
    "control",
];

export function RegistersView() {
    const [regMap, setRegMap] = useState<Map<string, RegisterDef>>(new Map());

    useEffect(() => {
        invoke<RegisterDef[]>("get_register_map")
            .then((defs) => setRegMap(new Map(defs.map((d) => [d.name, d]))))
            .catch(console.error);
    }, []);

    function toEntries(names: string[]): RegisterEntry[] {
        return names.flatMap((n) => {
            const def = regMap.get(n);
            return def ? [{ def, value: null }] : [];
        });
    }

    function toEntry(name: string): RegisterEntry | undefined {
        const def = regMap.get(name);
        return def ? { def, value: null } : undefined;
    }

    return (
        <Accordion multiple variant="separated" defaultValue={DEFAULT_OPEN}>
            {/* ── 1. Pack Readings ─────────────────────────────────── */}
            <Accordion.Item value="pack-readings">
                <Accordion.Control>Pack Readings</Accordion.Control>
                <Accordion.Panel>
                    <Grid>
                        {Object.entries(PACK_GROUPS).map(([title, names]) => (
                            <Grid.Col key={title} span={6}>
                                <RegisterTable
                                    title={title}
                                    rows={scalarRows(toEntries(names))}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 2. Timers ────────────────────────────────────────── */}
            <Accordion.Item value="timers">
                <Accordion.Control>Timers</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Timers"
                        rows={scalarRows(toEntries(TIMERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 3. Cell Voltages ─────────────────────────────────── */}
            <Accordion.Item value="cell-voltages">
                <Accordion.Control>Cell Voltages</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Cell Voltages"
                        rows={cellRows(toEntry("CellVoltage"))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 4. Cell Temperatures ─────────────────────────────── */}
            <Accordion.Item value="cell-temperatures">
                <Accordion.Control>Cell Temperatures</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Cell Temperatures"
                        rows={cellRows(toEntry("CellTemperature"))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 5. Cell State ────────────────────────────────────── */}
            <Accordion.Item value="cell-state">
                <Accordion.Control>Cell State</Accordion.Control>
                <Accordion.Panel>
                    <Grid>
                        <Grid.Col span={4}>
                            <RegisterTable
                                title="Cell SoC"
                                rows={cellRows(toEntry("CellSoC"))}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <RegisterTable
                                title="Cell SoH"
                                rows={cellRows(toEntry("CellSoH"))}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <RegisterTable
                                title="Cell Remaining Capacity"
                                rows={cellRows(
                                    toEntry("CellRemainingCapacity"),
                                )}
                            />
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 6. Status & Flags ────────────────────────────────── */}
            <Accordion.Item value="status-flags">
                <Accordion.Control>Status & Flags</Accordion.Control>
                <Accordion.Panel>
                    <BitFlagRegister
                        registers={toEntries(STATUS_BIT_REGISTERS)}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 7. Control ───────────────────────────────────────── */}
            <Accordion.Item value="control">
                <Accordion.Control>Control</Accordion.Control>
                <Accordion.Panel>
                    <BitFlagRegister
                        registers={toEntries(CONTROL_BIT_REGISTERS)}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 8. Charging ──────────────────────────────────────── */}
            <Accordion.Item value="charging">
                <Accordion.Control>Charging</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Charging"
                        rows={scalarRows(toEntries(CHARGING_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 9. Design & Spec ─────────────────────────────────── */}
            <Accordion.Item value="design-spec">
                <Accordion.Control>Design & Spec</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Design & Spec"
                        rows={scalarRows(toEntries(DESIGN_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 10. Device Identity ──────────────────────────────── */}
            <Accordion.Item value="device-identity">
                <Accordion.Control>Device Identity</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Device Identity"
                        rows={scalarRows(toEntries(IDENTITY_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 11. Cell History ─────────────────────────────────── */}
            <Accordion.Item value="cell-history">
                <Accordion.Control>Cell History</Accordion.Control>
                <Accordion.Panel>
                    <Grid>
                        {CELL_HISTORY.map(({ name, title }) => (
                            <Grid.Col key={name} span={4}>
                                <RegisterTable
                                    title={title}
                                    rows={cellRows(toEntry(name))}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 12. Protection Settings ──────────────────────────── */}
            <Accordion.Item value="protection-settings">
                <Accordion.Control>Protection Settings</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Protection Settings"
                        rows={scalarRows(toEntries(PROTECTION_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 13. Configuration ────────────────────────────────── */}
            <Accordion.Item value="configuration">
                <Accordion.Control>Configuration</Accordion.Control>
                <Accordion.Panel>
                    <Grid>
                        <Grid.Col span={12}>
                            <BitFlagRegister
                                registers={toEntries(CONFIG_BIT_REGISTERS)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <RegisterTable
                                title="Settings"
                                rows={scalarRows(
                                    toEntries(CONFIG_VALUE_REGISTERS),
                                )}
                            />
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 14. Faults ───────────────────────────────────────── */}
            <Accordion.Item value="faults">
                <Accordion.Control>Faults & Diagnostics</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Faults & Diagnostics"
                        rows={scalarRows(toEntries(FAULT_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>

            {/* ── 15. Calibration ──────────────────────────────────── */}
            <Accordion.Item value="calibration">
                <Accordion.Control>Calibration</Accordion.Control>
                <Accordion.Panel>
                    <RegisterTable
                        title="Calibration"
                        rows={scalarRows(toEntries(CALIBRATION_REGISTERS))}
                    />
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
