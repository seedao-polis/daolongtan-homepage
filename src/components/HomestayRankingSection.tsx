import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { RevenueRankItem } from "@/api/types";

const BAR = "#ffa940";
const LINE = "#52c41a";
const AXIS = "#6b7280";

type Props = {
  totalItems: number;
  items: RevenueRankItem[];
};

function useIsNarrowScreen() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return narrow;
}

export function HomestayRankingSection({ totalItems, items }: Props) {
  const isMobile = useIsNarrowScreen();
  const names = items.map((i) => i.name);
  const revenue = items.map((i) => i.revenue);
  const profit = items.map((i) => i.profit);

  const desktopOption = useMemo(
    () => ({
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
        axisLabel: { color: AXIS, rotate: 28, interval: 0, fontSize: 10 },
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
          itemStyle: { color: BAR, borderRadius: [4, 4, 0, 0] },
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
    }),
    [names, revenue, profit],
  );

  const barH = Math.min(26, Math.max(14, 300 / Math.max(names.length, 1)));
  const mobileHeight = Math.max(280, Math.min(520, 56 + names.length * barH));

  const mobileOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      legend: {
        data: ["营业额", "利润"],
        textStyle: { color: AXIS },
        top: 0,
      },
      grid: {
        left: 8,
        right: 16,
        top: 36,
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
        axisLabel: { color: AXIS, fontSize: 10 },
        name: "元",
        nameTextStyle: { color: AXIS, fontSize: 10 },
      },
      yAxis: {
        type: "category",
        data: names,
        inverse: true,
        axisLine: { lineStyle: { color: AXIS } },
        axisLabel: {
          color: AXIS,
          fontSize: 10,
          width: 88,
          overflow: "truncate",
          ellipsis: "…",
        },
        axisTick: { show: false },
      },
      series: [
        {
          name: "营业额",
          type: "bar",
          data: revenue,
          itemStyle: { color: BAR, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 16,
        },
        {
          name: "利润",
          type: "bar",
          data: profit,
          itemStyle: { color: LINE, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 16,
        },
      ],
    }),
    [names, revenue, profit],
  );

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
        option={isMobile ? mobileOption : desktopOption}
        style={{ height: isMobile ? mobileHeight : 320, width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
      <p className="text-center text-xs text-muted-foreground">
        共 {totalItems} 项
      </p>
    </div>
  );
}
