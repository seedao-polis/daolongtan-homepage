import { apiGet } from "./client";
import {
  normalizeActivityOverview,
  normalizeBusinessTrend,
  normalizeHomestayRevenue,
  normalizeHomestayStayOverview,
  normalizeMemberApply,
  normalizeMonthStats,
  normalizeSpaceUsage,
} from "./normalize";
import type {
  ActivityOverview,
  HomestayStayOverview,
  MemberApplyItem,
  MonthStats,
  RevenueRankItem,
  SpaceUsageItem,
  TrendPoint,
} from "./types";

export async function fetchMonthStats(): Promise<MonthStats> {
  const raw = await apiGet<unknown>("/month-stats");
  return normalizeMonthStats(raw);
}

export async function fetchMemberApplyOverview(): Promise<MemberApplyItem[]> {
  const raw = await apiGet<unknown>("/member-apply-overview");
  return normalizeMemberApply(raw);
}

export async function fetchActivityOverview(): Promise<ActivityOverview> {
  const raw = await apiGet<unknown>("/activity-data-overview");
  return normalizeActivityOverview(raw);
}

export async function fetchSpaceUsageStats(): Promise<SpaceUsageItem[]> {
  const raw = await apiGet<unknown>("/space-usage-stats");
  return normalizeSpaceUsage(raw);
}

export async function fetchBusinessTrend(
  granularity: string,
): Promise<TrendPoint[]> {
  const { startDate, endDate } = getRecentMonthRange();
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  if (granularity) {
    params.set("granularity", granularity);
  }
  const q = `?${params.toString()}`;
  const raw = await apiGet<unknown>(`/business-trend${q}`);
  return normalizeBusinessTrend(raw).points;
}

export async function fetchHomestayRevenueStats(): Promise<{
  totalItems: number;
  items: RevenueRankItem[];
}> {
  const raw = await apiGet<unknown>("/homestay-revenue-stats?limit=50");
  return normalizeHomestayRevenue(raw);
}

export async function fetchHomestayStayOverview(): Promise<HomestayStayOverview> {
  const raw = await apiGet<unknown>("/homestay-stay-overview");
  return normalizeHomestayStayOverview(raw);
}

function getRecentMonthRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - 1);
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}
