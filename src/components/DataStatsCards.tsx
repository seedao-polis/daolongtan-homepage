import { formatInt } from "@/lib/format";
import type { HomestayStayOverview } from "@/api/types";

type Props = {
  stats: HomestayStayOverview;
};

export function DataStatsCards({ stats }: Props) {
  const checkIns = stats.cumulativeCheckIns;
  const days = stats.avgStayDays;

  const cardBase =
    "flex min-w-0 flex-col justify-start rounded-xl border border-border bg-secondary/40 px-3 py-3 sm:px-4 sm:py-4";

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
      <div className={cardBase}>
        <p className="text-xs font-medium text-muted-foreground">累计旅居人次</p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums text-card-foreground sm:text-3xl">
          {formatInt(checkIns)}{" "}
          <span className="text-base font-normal text-muted-foreground sm:text-lg">
            人次
          </span>
        </p>
      </div>
      <div className={cardBase}>
        <p className="text-xs font-medium text-muted-foreground">平均入住天数</p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums text-card-foreground sm:text-3xl">
          {formatInt(days)}{" "}
          <span className="text-base font-normal text-muted-foreground sm:text-lg">
            天
          </span>
        </p>
      </div>
    </div>
  );
}
