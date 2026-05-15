import { useEffect, useState, type ReactNode } from "react";
import {
  fetchActivityOverview,
  fetchHomestayRevenueStats,
  fetchHomestayStayOverview,
  fetchMemberApplyOverview,
  fetchMonthStats,
  fetchSpaceUsageStats,
} from "@/api/homepage";
import type {
  ActivityOverview,
  HomestayStayOverview,
  MemberApplyItem,
  MonthStats,
  RevenueRankItem,
  SpaceUsageItem,
} from "@/api/types";
import { ActivityTableSection } from "@/components/ActivityTableSection";
import { BusinessTrendSection } from "@/components/BusinessTrendSection";
import { DashboardCard } from "@/components/DashboardCard";
import { DataStatsCards } from "@/components/DataStatsCards";
import { HomestayRankingSection } from "@/components/HomestayRankingSection";
import { MemberApplySection } from "@/components/MemberApplySection";
import { SpaceUsageChart } from "@/components/SpaceUsageChart";
import { SummaryRow } from "@/components/SummaryRow";

const emptyMonth: MonthStats = {};
const emptyActivity: ActivityOverview = {
  totalActivities: 0,
  totalApplicants: 0,
  rows: [],
};
const emptyHomestayStay: HomestayStayOverview = {
  cumulativeCheckIns: 0,
  avgStayDays: 0,
};

/** 累计统计起始日（上线口径） */
const CUMULATIVE_START_DATE = "2026-04-01";

function CardHeading({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="size-1.5 shrink-0 rounded-full bg-chart-1" aria-hidden />
      {children}
    </span>
  );
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [monthStats, setMonthStats] = useState<MonthStats>(emptyMonth);
  const [homestayStay, setHomestayStay] =
    useState<HomestayStayOverview>(emptyHomestayStay);
  const [members, setMembers] = useState<MemberApplyItem[]>([]);
  const [activity, setActivity] = useState<ActivityOverview>(emptyActivity);
  const [spaces, setSpaces] = useState<SpaceUsageItem[]>([]);
  const [rankItems, setRankItems] = useState<RevenueRankItem[]>([]);
  const [rankTotal, setRankTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);

      const results = await Promise.allSettled([
        fetchMonthStats(),
        fetchHomestayStayOverview(),
        fetchMemberApplyOverview(),
        fetchActivityOverview(),
        fetchSpaceUsageStats(),
        fetchHomestayRevenueStats(),
      ]);

      if (cancelled) return;

      const errs = results
        .map((r, i) =>
          r.status === "rejected"
            ? `${i}: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`
            : null,
        )
        .filter(Boolean);

      if (errs.length === results.length) {
        setLoadError(errs.join("；"));
      } else if (errs.length) {
        setLoadError(`部分接口失败：${errs.join("；")}`);
      }

      const [m, stay, mem, act, sp, hm] = results;

      if (m.status === "fulfilled") setMonthStats(m.value);
      if (stay.status === "fulfilled") setHomestayStay(stay.value);
      if (mem.status === "fulfilled") setMembers(mem.value);
      if (act.status === "fulfilled") setActivity(act.value);
      if (sp.status === "fulfilled") setSpaces(sp.value);
      if (hm.status === "fulfilled") {
        setRankItems(hm.value.items);
        setRankTotal(hm.value.totalItems);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-[1400px] items-start gap-4 px-4 py-4 md:px-6">
          <div
            className="mt-1 hidden h-11 w-1 shrink-0 rounded-full bg-primary sm:block"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              自上线以来累计（{CUMULATIVE_START_DATE} 至 {formatToday()}）
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              数据概览
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        {loadError ? (
          <div
            className="mb-6 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            {loadError}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-muted-foreground shadow-sm">
            数据加载中…
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
              <DashboardCard
                className="order-1 flex h-full min-h-0 flex-col"
                bodyClassName="flex min-h-0 flex-1 flex-col justify-start"
                title={<CardHeading>入住数据统计</CardHeading>}
              >
                <DataStatsCards stats={homestayStay} />
              </DashboardCard>

              <DashboardCard
                className="order-2 flex h-full min-h-0 flex-col"
                title={<CardHeading>成员申请统计</CardHeading>}
              >
                <MemberApplySection items={members} />
              </DashboardCard>
            </div>

            <SummaryRow stats={monthStats} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DashboardCard className="order-1" title={<CardHeading>活动数据概览</CardHeading>}>
                <ActivityTableSection overview={activity} />
              </DashboardCard>

              <DashboardCard className="order-2" title={<CardHeading>空间使用统计</CardHeading>}>
                <SpaceUsageChart items={spaces} />
              </DashboardCard>
            </div>

            <DashboardCard title={<CardHeading>经营分析</CardHeading>}>
              <BusinessTrendSection />
            </DashboardCard>

            <DashboardCard
              title={
                <CardHeading>
                  民宿营收统计
                  {rankTotal ? (
                    <span className="text-xs font-normal text-muted-foreground">
                      （共 {rankTotal} 项）
                    </span>
                  ) : null}
                </CardHeading>
              }
            >
              <HomestayRankingSection totalItems={rankTotal} items={rankItems} />
            </DashboardCard>
          </div>
        )}
      </main>
    </div>
  );
}

function formatToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}
