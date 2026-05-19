import type { BmsData } from "@/bindings/BmsData";

export interface SeriesDef {
    id: string;
    label: string;
    color: string;
    getValue: (d: BmsData) => number;
}

export interface ChartGroupDef {
    title: string;
    unit: string;
    series: SeriesDef[];
}

const PACK_COLOR = "#e0e0e0";
const SECONDARY_COLOR = "#aaaaaa";
const CELL_COLORS: readonly string[] = [
    "#8b6ec6",
    "#4ea8de",
    "#56cf8e",
    "#f5c542",
    "#f07070",
    "#d070d0",
    "#7ec8a8",
];

export function tempDkToCelsius(dk: number): number {
    return dk / 10 - 273.15;
}

export function cellTempToCelsius(raw: number): number {
    return raw / 10;
}

export const CHART_GROUPS: ChartGroupDef[] = [
    {
        title: "Voltages",
        unit: "mV",
        series: [
            {
                id: "voltage.pack",
                label: "Pack",
                color: PACK_COLOR,
                getValue: (d) => d.voltage_mv,
            },
            ...Array.from({ length: 7 }, (_, i) => ({
                id: `voltage.cell_${i + 1}`,
                label: `Cell ${i + 1}`,
                color: CELL_COLORS[i],
                getValue: (d: BmsData) => d.cell_voltages_mv[i],
            })),
        ],
    },
    {
        title: "Temperatures",
        unit: "°C",
        series: [
            {
                id: "temp.pack",
                label: "Pack",
                color: PACK_COLOR,
                getValue: (d) => tempDkToCelsius(d.temperature_dk),
            },
            ...Array.from({ length: 7 }, (_, i) => ({
                id: `temp.cell_${i + 1}`,
                label: `Cell ${i + 1}`,
                color: CELL_COLORS[i],
                getValue: (d: BmsData) =>
                    cellTempToCelsius(d.cell_temperatures[i]),
            })),
        ],
    },
    {
        title: "SoC",
        unit: "%",
        series: [
            {
                id: "soc.relative",
                label: "Relative",
                color: PACK_COLOR,
                getValue: (d) => d.relative_soc,
            },
            {
                id: "soc.absolute",
                label: "Absolute",
                color: SECONDARY_COLOR,
                getValue: (d) => d.absolute_soc,
            },
            ...Array.from({ length: 7 }, (_, i) => ({
                id: `soc.cell_${i + 1}`,
                label: `Cell ${i + 1}`,
                color: CELL_COLORS[i],
                getValue: (d: BmsData) => d.cell_soc[i],
            })),
        ],
    },
    {
        title: "Currents",
        unit: "mA",
        series: [
            {
                id: "current.current",
                label: "Current",
                color: PACK_COLOR,
                getValue: (d) => d.current_ma,
            },
            {
                id: "current.avg",
                label: "Avg Current",
                color: SECONDARY_COLOR,
                getValue: (d) => d.average_current_ma,
            },
        ],
    },
];

export function defaultVisibilityMap(): Record<string, boolean> {
    return Object.fromEntries(
        CHART_GROUPS.flatMap((g) => g.series.map((s) => [s.id, true])),
    );
}
