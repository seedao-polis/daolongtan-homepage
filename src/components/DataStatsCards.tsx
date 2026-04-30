import { formatInt } from "@/lib/format";
import type { HomestayStayOverview } from "@/api/types";

type Props = {
  stats: HomestayStayOverview;
};

export function DataStatsCards({ stats }: Props) {
  const checkIns = stats.cumulativeCheckIns;
  const days = stats.avgStayDays;

  return (
    <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex min-h-[120px] flex-col justify-center rounded-xl border border-border bg-secondary/40 px-4 py-6">
        <p className="text-xs font-medium text-muted-foreground">累计入住人次</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-card-foreground">
          {formatInt(checkIns)}{" "}
          <span className="text-lg font-normal text-muted-foreground">人次</span>
        </p>
      </div>
      <div className="flex min-h-[120px] flex-col justify-center rounded-xl border border-border bg-secondary/40 px-4 py-6">
        <p className="text-xs font-medium text-muted-foreground">平均入住天数</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-card-foreground">
          {formatInt(days)}{" "}
          <span className="text-lg font-normal text-muted-foreground">天</span>
        </p>
      </div>
    </div>
  );
}
