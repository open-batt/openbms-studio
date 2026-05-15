import { useMemo } from "react"
import ReactECharts from "echarts-for-react"

interface GaugeProps {
  value: number
  min?: number
  max?: number
  unit?: string
  label?: string
  color?: string
  size?: number
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  unit = "",
  label = "",
  color = "#7c5cbf",
  size = 160,
}: GaugeProps) {
  const option = useMemo(() => ({
    series: [
      {
        type: "gauge",
        startAngle: 225,
        endAngle: -45,
        min,
        max,
        radius: "90%",
        progress: {
          show: true,
          width: 10,
          roundCap: true,
          itemStyle: { color },
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [[1, "#2a2a3a"]],
          },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: (val: number) => `${val}${unit}`,
          color: "#ffffff",
          fontSize: 18,
          offsetCenter: [0, "10%"],
        },
        title: {
          show: !!label,
          offsetCenter: [0, "35%"],
          color: "#aaaaaa",
          fontSize: 12,
        },
        data: [{ value, name: label }],
      },
    ],
  }), [value, min, max, unit, label, color])

  return (
    <ReactECharts
      option={option}
      style={{ width: size, height: size }}
      opts={{ renderer: "canvas" }}
    />
  )
}
