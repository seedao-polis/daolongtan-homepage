import ReactECharts from "echarts-for-react";
import type { RevenueRankItem } from "@/api/types";

const BAR = "#ffa940";
const LINE = "#52c41a";
const AXIS = "#6b7280";

type Props = {
  totalItems: number;
  items: RevenueRankItem[];
};

export function HomestayRankingSection({ totalItems, items }: Props) {
  const names = items.map((i) => i.name);
  const revenue = items.map((i) => i.revenue);
  const profit = items.map((i) => i.profit);

  const option = {
    backgroundColor: "transparent",
    legend: {
      data: ["营业额", "利润"],
      textStyle: { color: AXIS },
      top: 0,
    },
    grid: { left: 48, right: 48, top: 40, bottom: 72 },
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
      axisLabel: { color: AXIS, rotate: 30, interval: 0, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      name: "元",
      nameTextStyle: { color: AXIS, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#2a2a2a" } },
      axisLabel: { color: AXIS },
    },
    series: [
      {
        name: "营业额",
        type: "bar",
        data: revenue,
        itemStyle: {
          color: BAR,
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 28,
      },
      {
        name: "利润",
        type: "line",
        yAxisIndex: 0,
        data: profit,
        smooth: true,
        itemStyle: { color: LINE },
        lineStyle: { width: 2, color: LINE },
      },
    ],
  };

  if (!items.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        暂无民宿营收数据
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">各民宿营收统计情况</p>
      <ReactECharts
        option={option}
        style={{ height: 320, width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
      <p className="text-center text-xs text-muted-foreground">
        共 {totalItems} 项
      </p>
    </div>
  );
}
