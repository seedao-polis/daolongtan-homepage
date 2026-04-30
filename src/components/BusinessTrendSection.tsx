import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { fetchBusinessTrend } from "@/api/homepage";
import type { TrendGranularity, TrendPoint } from "@/api/types";

const REV = "#fadb14";
const PROF = "#52c41a";
const AXIS = "#6b7280";

type Granularity = TrendGranularity;

const LABELS: Record<Granularity, string> = {
  day: "天",
  week: "周",
  month: "月",
};

export function BusinessTrendSection() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchBusinessTrend(granularity);
        if (!cancelled) setPoints(data);
      } catch (e) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "加载趋势失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [granularity]);

  const dates = points.map((p) => p.date);
  const revenue = points.map((p) => p.revenue);
  const profit = points.map((p) => p.profit);

  const option = {
    backgroundColor: "transparent",
    legend: {
      data: ["营业额", "利润"],
      textStyle: { color: AXIS },
      top: 0,
    },
    grid: { left: 56, right: 16, top: 40, bottom: 40 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(17,17,17,0.95)",
      borderColor: "#2a2a2a",
      textStyle: { color: "#e5e7eb" },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: AXIS } },
      axisLabel: { color: AXIS, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      name: "金额(元)",
      nameTextStyle: { color: AXIS, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#2a2a2a" } },
      axisLabel: { color: AXIS },
    },
    series: [
      {
        name: "营业额",
        type: "line",
        smooth: true,
        data: revenue,
        itemStyle: { color: REV },
        lineStyle: { width: 2, color: REV },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(250, 219, 20, 0.35)" },
              { offset: 1, color: "rgba(82, 196, 26, 0.05)" },
            ],
          },
        },
      },
      {
        name: "利润",
        type: "line",
        smooth: true,
        data: profit,
        itemStyle: { color: PROF },
        lineStyle: { width: 2, color: PROF },
      },
    ],
  };

  const toggle = (
    <div className="flex gap-1">
      {(["day", "week", "month"] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => setGranularity(g)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            granularity === g
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          {LABELS[g]}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          营业额与利润趋势（金额单位：元）
        </p>
        {toggle}
      </div>
      {err ? (
        <p className="text-xs text-rose-400">{err}</p>
      ) : null}
      {loading && !points.length ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          加载中…
        </div>
      ) : !points.length ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          暂无趋势数据
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: 320, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      )}
    </div>
  );
}
