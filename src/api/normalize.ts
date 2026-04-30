import type {
  ActivityOverview,
  ActivityRow,
  HomestayStayOverview,
  MemberApplyItem,
  MonthStats,
  RevenueRankItem,
  SpaceUsageItem,
  TrendPoint,
} from "./types";

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export function normalizeMonthStats(raw: unknown): MonthStats {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  return {
    asOfDate: str(
      r.asOfDate ?? r.as_of_date ?? r.cutoffDate ?? r.endDate,
      "",
    ),
    totalRevenue: num(
      r.totalRevenue ?? r.total_revenue ?? r.totalIncome ?? r.income,
    ),
    homestayRevenue: num(
      r.homestayRevenue ?? r.homestay_revenue ?? r.bnbRevenue,
    ),
    activityRevenue: num(
      r.activityRevenue ?? r.activity_revenue ?? r.eventRevenue,
    ),
    netProfit: num(
      r.netProfit ?? r.net_profit ?? r.profit ?? r.totalProfit,
    ),
    cumulativeCheckIns: num(
      r.cumulativeCheckIns ??
        r.checkInCount ??
        r.check_in_count ??
        r.stayPersonTimes,
    ),
    avgStayDays: num(
      r.avgStayDays ?? r.avg_stay_days ?? r.averageStayDays ?? r.avgNights,
    ),
  };
}

const MEMBER_KEYS = [
  "digital_nomad",
  "co_creator",
  "prospective",
  "temporary",
] as const;

const MEMBER_TITLES: Record<string, string> = {
  digital_nomad: "数字游民",
  co_creator: "共创人",
  prospective: "老村民",
  temporary: "新村民",
};

export function normalizeMemberApply(raw: unknown): MemberApplyItem[] {
  if (!raw) return defaultMemberApply();
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.items)) list = o.items;
    else if (Array.isArray(o.list)) list = o.list;
    else if (Array.isArray(o.categories)) list = o.categories;
    else {
      // 兼容当前后端结构：直接返回一个对象，而不是数组
      // 例如：digitalNomadUserApplyTotal / coCreatorApplyTotal / oldVillagerApplyTotal / newVillagerApplyTotal
      return [
        {
          key: "digital_nomad",
          title: MEMBER_TITLES.digital_nomad,
          applied:
            num(o.digitalNomadUserApplyTotal) +
            num(
              o.digitalNomadFormApplyTotal ??
                o.digitalNomadApplyTotal ??
                o.digitalNomadTotal,
            ),
          passed:
            num(o.digitalNomadUserApplyApproved) +
            num(
              o.digitalNomadFormApplyApproved ??
                o.digitalNomadApplyApproved ??
                o.digitalNomadApproved,
            ),
        },
        {
          key: "co_creator",
          title: MEMBER_TITLES.co_creator,
          applied: num(o.coCreatorApplyTotal ?? o.coCreatorTotal),
          passed: num(o.coCreatorApplyApproved ?? o.coCreatorApproved),
        },
        {
          key: "prospective",
          title: MEMBER_TITLES.prospective,
          applied: num(o.oldVillagerApplyTotal ?? o.prospectiveApplyTotal),
          passed: num(o.oldVillagerApproved ?? o.prospectiveApproved),
        },
        {
          key: "temporary",
          title: MEMBER_TITLES.temporary,
          applied: num(o.newVillagerApplyTotal ?? o.temporaryApplyTotal),
          passed: num(o.newVillagerApproved ?? o.temporaryApproved),
        },
      ];
    }
  }
  if (!list.length) return defaultMemberApply();

  return list.map((item, i) => {
    if (!item || typeof item !== "object") {
      return {
        key: MEMBER_KEYS[i] ?? `m${i}`,
        title: MEMBER_TITLES[MEMBER_KEYS[i] ?? ""] ?? `类别 ${i + 1}`,
        applied: 0,
        passed: 0,
      };
    }
    const o = item as Record<string, unknown>;
    const key = str(o.key ?? o.type ?? o.code, MEMBER_KEYS[i] ?? `m${i}`);
    const title =
      str(o.title ?? o.name ?? o.label, "") ||
      MEMBER_TITLES[key] ||
      `类别 ${i + 1}`;
    return {
      key,
      title,
      applied: num(o.applied ?? o.applyCount ?? o.apply_count ?? o.total),
      passed: num(o.passed ?? o.passCount ?? o.pass_count ?? o.approved),
    };
  });
}

function defaultMemberApply(): MemberApplyItem[] {
  return MEMBER_KEYS.map((k) => ({
    key: k,
    title: MEMBER_TITLES[k] ?? k,
    applied: 0,
    passed: 0,
  }));
}

export function normalizeActivityOverview(raw: unknown): ActivityOverview {
  if (!raw || typeof raw !== "object") {
    return { totalActivities: 0, totalApplicants: 0, rows: [] };
  }
  const r = raw as Record<string, unknown>;
  const totalActivities = num(
    r.validActivityCount ??
      r.totalActivities ??
      r.activityCount ??
      r.total_activities ??
      r.count,
  );
  const totalApplicants = num(
    r.totalRegistrationCount ??
      r.totalApplicants ??
      r.total_applicants ??
      r.signupCount ??
      r.registrants,
  );
  let rowsRaw: unknown[] = [];
  if (Array.isArray(r.rows)) rowsRaw = r.rows;
  else if (Array.isArray(r.list)) rowsRaw = r.list;
  else if (Array.isArray(r.activities)) rowsRaw = r.activities;

  const rows: ActivityRow[] = rowsRaw.map((row) => {
    if (!row || typeof row !== "object") {
      return { title: "", space: "", applicants: 0 };
    }
    const o = row as Record<string, unknown>;
    return {
      title: str(o.title ?? o.name ?? o.activityTitle, ""),
      space: str(
        o.spaceName ?? o.space ?? o.venue ?? o.hostingSpace ?? o.location,
        "",
      ),
      applicants: num(o.registrationCount ?? o.applicants ?? o.signups ?? o.count),
      titleLink: str(o.titleLink ?? o.title_url, "") || undefined,
      spaceLink: str(o.spaceLink ?? o.space_url, "") || undefined,
    };
  });

  return { totalActivities, totalApplicants, rows };
}

export function normalizeSpaceUsage(raw: unknown): SpaceUsageItem[] {
  if (!raw) return [];
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.items)) list = o.items;
    else if (Array.isArray(o.spaces)) list = o.spaces;
    else if (Array.isArray(o.stats)) list = o.stats;
  }
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const name = str(o.name ?? o.spaceName ?? o.label ?? o.key, "");
      const value = num(
        o.usageCount ?? o.value ?? o.count ?? o.usage ?? o.times,
      );
      if (!name) return null;
      return { name, value };
    })
    .filter((x): x is SpaceUsageItem => x !== null);
}

export function normalizeBusinessTrend(
  raw: unknown,
): { points: TrendPoint[] } {
  if (!raw || typeof raw !== "object") return { points: [] };
  const r = raw as Record<string, unknown>;
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  if (Array.isArray(r.points)) list = r.points;
  else if (Array.isArray(r.series)) list = r.series;
  else if (Array.isArray(r.trend)) list = r.trend;
  else if (Array.isArray(r.data)) list = r.data;

  const points: TrendPoint[] = list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const date = normalizeDateLabel(
        o.date ?? o.period ?? o.month ?? o.label ?? o.time,
      );
      if (!date) return null;
      return {
        date,
        revenue: num(o.revenue ?? o.turnover ?? o.amount),
        profit: num(o.profit ?? o.netProfit),
      };
    })
    .filter((x): x is TrendPoint => x !== null);

  return { points };
}

function normalizeDateLabel(v: unknown): string {
  if (typeof v === "string") return v;
  // 兼容后端返回 [2026, 3, 31] 这种数组日期
  if (Array.isArray(v) && v.length >= 3) {
    const y = num(v[0]);
    const m = num(v[1]);
    const d = num(v[2]);
    if (y > 0 && m > 0 && d > 0) {
      return `${y}-${`${m}`.padStart(2, "0")}-${`${d}`.padStart(2, "0")}`;
    }
  }
  return "";
}

export function normalizeHomestayRevenue(raw: unknown): {
  totalItems: number;
  items: RevenueRankItem[];
} {
  if (!raw || typeof raw !== "object") {
    return { totalItems: 0, items: [] };
  }
  const r = raw as Record<string, unknown>;
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (Array.isArray(r.items)) list = r.items;
  else if (Array.isArray(r.list)) list = r.list;
  else if (Array.isArray(r.lines)) list = r.lines;
  else if (Array.isArray(r.categories)) list = r.categories;
  const totalItems = num(
    r.totalItems ?? r.total ?? r.count ?? r.totalCount,
    list.length,
  );

  const items: RevenueRankItem[] = list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const name = str(
        o.homestayName ??
          o.name ??
          o.categoryName ??
          o.line ??
          o.businessLine,
        "",
      );
      if (!name) return null;
      return {
        name,
        revenue: num(o.revenue ?? o.amount),
        profit: num(o.profit),
      };
    })
    .filter((x): x is RevenueRankItem => x !== null);

  const sorted = [...items].sort((a, b) => b.revenue - a.revenue);
  return {
    totalItems: totalItems || sorted.length,
    items: sorted,
  };
}

export function normalizeHomestayStayOverview(
  raw: unknown,
): HomestayStayOverview {
  if (!raw || typeof raw !== "object") {
    return { cumulativeCheckIns: 0, avgStayDays: 0 };
  }
  const r = raw as Record<string, unknown>;
  return {
    cumulativeCheckIns: num(
      r.cumulativeCheckIns ??
        r.cumulativeStayPersonTimes ??
        r.totalStayBookings ??
        r.paidStayOrderCount ??
        r.stayPersonTimes ??
        r.totalStayPersons ??
        r.totalCheckIns,
    ),
    avgStayDays: num(
      r.avgStayDays ??
        r.averageStayNights ??
        r.avgStayNights ??
        r.avgStayDuration ??
        r.averageStayDays ??
        r.averageNights,
    ),
  };
}
