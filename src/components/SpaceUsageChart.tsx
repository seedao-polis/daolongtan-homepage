import ReactECharts from "echarts-for-react";
import type { SpaceUsageItem } from "@/api/types";

type Props = {
  items: SpaceUsageItem[];
};

const GREEN = "#52c41a";
const AXIS = "#6b7280";

/** 横向柱状图：长名称不挤横轴，桌面与移动端表现一致 */
export function SpaceUsageChart({ items }: Props) {
  const names = items.map((i) => i.name);
  const values = items.map((i) => i.value);

  const rowH = 24;
  const chartHeight = Math.max(260, Math.min(520, 40 + names.length * rowH));

  const option = {
    backgroundColor: "transparent",
    grid: {
      left: 8,
      right: 40,
      top: 16,
      bottom: 8,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(17,17,17,0.95)",
      borderColor: "#2a2a2a",
      textStyle: { color: "#e5e7eb" },
    },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#2a2a2a" } },
      axisLabel: { color: AXIS, fontSize: 11 },
      name: "次",
      nameTextStyle: { color: AXIS, fontSize: 11 },
      nameGap: 8,
    },
    yAxis: {
      type: "category",
      data: names,
      inverse: true,
      axisLine: { lineStyle: { color: AXIS } },
      axisLabel: {
        color: AXIS,
        fontSize: 11,
        width: 96,
        overflow: "truncate",
        ellipsis: "…",
      },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: {
          color: GREEN,
          borderRadius: [0, 4, 4, 0],
        },
        barMaxWidth: 22,
        label: {
          show: true,
          position: "right",
          color: AXIS,
          fontSize: 11,
        },
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
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        各空间使用频次（单位：次）
      </p>
      <ReactECharts
        option={option}
        style={{ height: chartHeight, width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
