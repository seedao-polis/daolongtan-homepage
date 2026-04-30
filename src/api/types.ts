export type TrendGranularity = "day" | "week" | "month";

export interface MonthStats {
  asOfDate?: string;
  totalRevenue?: number;
  homestayRevenue?: number;
  activityRevenue?: number;
  netProfit?: number;
  /** 累计入住人次（若后端在 month-stats 中返回） */
  cumulativeCheckIns?: number;
  /** 平均入住天数 */
  avgStayDays?: number;
}

export interface MemberApplyItem {
  key: string;
  title: string;
  applied: number;
  passed: number;
}

export interface ActivityRow {
  title: string;
  space: string;
  applicants: number;
  titleLink?: string;
  spaceLink?: string;
}

export interface ActivityOverview {
  totalActivities: number;
  totalApplicants: number;
  rows: ActivityRow[];
}

export interface SpaceUsageItem {
  name: string;
  value: number;
}

export interface TrendPoint {
  date: string;
  revenue: number;
  profit: number;
}

export interface RevenueRankItem {
  name: string;
  revenue: number;
  profit: number;
}

export interface HomestayStayOverview {
  cumulativeCheckIns: number;
  avgStayDays: number;
}
