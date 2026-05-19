import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import type { HistoryEntry } from "@/hooks/useBmsHistory";
import type { ChartGroupDef } from "./series-config";

interface ChartPanelProps {
    group: ChartGroupDef;
    history: HistoryEntry[];
    visibilityMap: Record<string, boolean>;
    windowSec: number;
}

export function ChartPanel({
    group,
    history,
    visibilityMap,
    windowSec,
}: ChartPanelProps) {
    const option = useMemo(() => {
        const t0 = history.length > 0 ? history[0].t : 0;

        const series = group.series
            .filter((s) => visibilityMap[s.id] !== false)
            .map((s) => ({
                name: s.label,
                type: "line" as const,
                data: history.map((e) => [
                    (e.t - t0) / 1000,
                    s.getValue(e.data),
                ]),
                lineStyle: { color: s.color, width: 1.5 },
                itemStyle: { color: s.color },
                showSymbol: false,
            }));

        return {
            backgroundColor: "transparent",
            title: {
                text: group.title,
                textStyle: { color: "#aaaaaa", fontSize: 12 },
                top: 4,
                left: 8,
            },
            xAxis: {
                type: "value" as const,
                min: 0,
                max: windowSec,
                axisLabel: {
                    color: "#888888",
                    fontSize: 10,
                    formatter: (v: number) => v.toFixed(2),
                },
                axisLine: { lineStyle: { color: "#444444" } },
                axisTick: { show: false },
                name: "s",
                nameTextStyle: { color: "#888888", fontSize: 10 },
            },
            yAxis: {
                type: "value" as const,
                name: group.unit,
                nameTextStyle: { color: "#888888", fontSize: 10 },
                axisLabel: {
                    color: "#888888",
                    fontSize: 10,
                    formatter: (v: number) => v.toFixed(2),
                },
                axisLine: { show: false },
                splitLine: { lineStyle: { color: "#333333" } },
            },
            series,
            grid: { left: 60, right: 8, top: 30, bottom: 28 },
        };
    }, [history, group, visibilityMap, windowSec]);

    return (
        <ReactECharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "100%" }}
            opts={{ renderer: "canvas" }}
        />
    );
}
