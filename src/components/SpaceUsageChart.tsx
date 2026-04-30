import ReactECharts from "echarts-for-react";
import type { SpaceUsageItem } from "@/api/types";

type Props = {
  items: SpaceUsageItem[];
};

const GREEN = "#52c41a";
const AXIS = "#6b7280";

export function SpaceUsageChart({ items }: Props) {
  const names = items.map((i) => i.name);
  const values = items.map((i) => i.value);

  const option = {
    backgroundColor: "transparent",
    grid: { left: 48, right: 16, top: 24, bottom: 56 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(17,17,17,0.95)",
      borderColor: "#2a2a2a",
      textStyle: { color: "#e5e7eb" },
    },
    xAxis: {
      type: "category",
      data: names,
      axisLine: { lineStyle: { color: AXIS } },
      axisLabel: {
        color: AXIS,
        rotate: 35,
        interval: 0,
        fontSize: 11,
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#2a2a2a" } },
      axisLabel: { color: AXIS },
      name: "次数",
      nameTextStyle: { color: AXIS, fontSize: 11 },
    },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: {
          color: GREEN,
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 36,
      },
    ],
  };

  if (!items.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        暂无空间使用数据
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: 300, width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
}
