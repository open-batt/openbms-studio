import type {
    LogEntry,
    LogSeverity,
    TestDef,
} from "@/components/views/TestsView/types";

export const MOCK_TESTS: TestDef[] = [
    {
        id: "cell_voltage_balance",
        label: "Cell Voltage Balance",
        config: [
            { key: "maxDelta", label: "Max Delta", unit: "mV", default: 5 },
            { key: "timeout", label: "Timeout", unit: "s", default: 30 },
        ],
    },
    {
        id: "capacity_estimation",
        label: "Capacity Estimation",
        config: [
            {
                key: "dischargeCurrent",
                label: "Discharge Current",
                unit: "mA",
                default: 2500,
            },
            {
                key: "cutoffVoltage",
                label: "Cutoff Voltage",
                unit: "mV",
                default: 3000,
            },
        ],
    },
    {
        id: "isolation_resistance",
        label: "Isolation Resistance",
        config: [],
    },
    {
        id: "temperature_stress",
        label: "Temperature Stress",
        config: [
            {
                key: "maxTemp",
                label: "Max Temperature",
                unit: "°C",
                default: 55,
            },
            { key: "duration", label: "Duration", unit: "s", default: 60 },
        ],
    },
];

type SequenceStep = { severity: LogSeverity; message: string; delayMs: number };

const SEQUENCES: Record<string, SequenceStep[]> = {
    cell_voltage_balance: [
        {
            severity: "info",
            message: "Initializing cell voltage balance test...",
            delayMs: 200,
        },
        { severity: "info", message: "Reading cell voltages...", delayMs: 700 },
        {
            severity: "info",
            message: "Cell voltages: 3812mV, 3809mV, 3815mV, 3807mV",
            delayMs: 1300,
        },
        {
            severity: "warn",
            message: "Cell delta: 8mV — exceeds threshold, starting balancing",
            delayMs: 1900,
        },
        {
            severity: "info",
            message: "Balancing sequence in progress...",
            delayMs: 2600,
        },
        {
            severity: "info",
            message:
                "Cell voltages after balancing: 3811mV, 3810mV, 3812mV, 3810mV",
            delayMs: 3400,
        },
        {
            severity: "info",
            message: "PASS — Cell delta within threshold (2mV)",
            delayMs: 3900,
        },
    ],
    capacity_estimation: [
        {
            severity: "info",
            message: "Starting capacity estimation test...",
            delayMs: 200,
        },
        { severity: "info", message: "Initial SOC: 98%", delayMs: 700 },
        {
            severity: "info",
            message: "Applying discharge current: 2500mA",
            delayMs: 1300,
        },
        {
            severity: "info",
            message: "Monitoring voltage drop...",
            delayMs: 1900,
        },
        {
            severity: "warn",
            message: "Voltage approaching cutoff: 3100mV",
            delayMs: 2700,
        },
        {
            severity: "info",
            message: "Cutoff reached. Measuring elapsed charge...",
            delayMs: 3200,
        },
        {
            severity: "info",
            message: "PASS — Estimated capacity: 4820mAh",
            delayMs: 3800,
        },
    ],
    isolation_resistance: [
        {
            severity: "info",
            message: "Starting isolation resistance test...",
            delayMs: 200,
        },
        {
            severity: "info",
            message: "Applying test voltage to pack terminals...",
            delayMs: 800,
        },
        {
            severity: "info",
            message: "Measuring leakage current: 0.02mA",
            delayMs: 1600,
        },
        {
            severity: "info",
            message: "Calculated isolation resistance: 1.8MΩ",
            delayMs: 2400,
        },
        {
            severity: "info",
            message: "PASS — Isolation resistance above minimum (1MΩ)",
            delayMs: 2900,
        },
    ],
    temperature_stress: [
        {
            severity: "info",
            message: "Starting temperature stress test...",
            delayMs: 200,
        },
        {
            severity: "info",
            message: "Ambient temperature: 24°C",
            delayMs: 800,
        },
        {
            severity: "warn",
            message: "Temperature rising: 38°C",
            delayMs: 1600,
        },
        {
            severity: "warn",
            message: "Temperature rising: 52°C",
            delayMs: 2400,
        },
        {
            severity: "error",
            message: "FAIL — Temperature exceeded threshold (60°C > 55°C)",
            delayMs: 3100,
        },
    ],
};

export function runMockTest(
    testId: string,
    onLog: (entry: LogEntry) => void,
    onDone: () => void,
): () => void {
    const sequence = SEQUENCES[testId] ?? [];

    if (sequence.length === 0) {
        const h = setTimeout(onDone, 0);
        return () => clearTimeout(h);
    }

    const handles: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    sequence.forEach((step, i) => {
        const h = setTimeout(() => {
            if (cancelled) return;
            onLog({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                severity: step.severity,
                message: step.message,
            });
            if (i === sequence.length - 1) {
                onDone();
            }
        }, step.delayMs);
        handles.push(h);
    });

    return () => {
        cancelled = true;
        handles.forEach(clearTimeout);
    };
}
