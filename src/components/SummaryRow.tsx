import type { ReactNode } from "react";
import { formatYuan } from "@/lib/format";
import { DISPLAY_OFFSET, withDisplayOffset } from "@/lib/displayOffsets";
import type { MonthStats } from "@/api/types";

type StatDef = {
  label: string;
  get: (m: MonthStats) => number | undefined;
  accent: "chart-1" | "chart-2" | "chart-3" | "chart-4";
  icon: ReactNode;
};

const accentRing: Record<StatDef["accent"], string> = {
  "chart-1": "ring-chart-1/25",
  "chart-2": "ring-chart-2/25",
  "chart-3": "ring-chart-3/25",
  "chart-4": "ring-chart-4/25",
};

const accentDot: Record<StatDef["accent"], string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
};

const STATS: StatDef[] = [
  {
    label: "累计总收入",
    get: (m) =>
      withDisplayOffset(m.totalRevenue, DISPLAY_OFFSET.totalRevenue),
    accent: "chart-1",
    icon: <CoinIcon />,
  },
  {
    label: "累计民宿收入",
    get: (m) =>
      withDisplayOffset(m.homestayRevenue, DISPLAY_OFFSET.homestayRevenue),
    accent: "chart-2",
    icon: <HomeIcon />,
  },
  {
    label: "累计活动收入",
    get: (m) => m.activityRevenue,
    accent: "chart-3",
    icon: <CalendarIcon />,
  },
  {
    label: "累计云租金（累计总利润）",
    get: (m) => m.netProfit,
    accent: "chart-4",
    icon: <ChartIcon />,
  },
];

type Props = {
  stats: MonthStats;
};

export function SummaryRow({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((s) => {
        const value = s.get(stats);
        return (
          <div
            key={s.label}
            className={`relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm ring-1 ring-inset ${accentRing[s.accent]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground [&_svg]:size-5">
                {s.icon}
              </div>
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${accentDot[s.accent]}`}
                aria-hidden
              />
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-card-foreground tabular-nums">
              ¥ {formatYuan(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
    </svg>
  );
}
