import type { ActivityOverview } from "@/api/types";
import { formatInt } from "@/lib/format";

type Props = {
  overview: ActivityOverview;
};

export function ActivityTableSection({ overview }: Props) {
  const { totalActivities, totalApplicants, rows } = overview;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        活动共{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatInt(totalActivities)}
        </span>{" "}
        场，已报名总人次{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatInt(totalApplicants)}
        </span>
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-secondary/80 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">活动标题</th>
              <th className="px-3 py-2 font-medium">举办空间</th>
              <th className="px-3 py-2 font-medium text-right">报名人次</th>
            </tr>
          </thead>
        </table>
        <div className={rows.length > 10 ? "max-h-[360px] overflow-y-auto" : ""}>
          <table className="w-full min-w-[480px] text-left text-sm">
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    暂无活动数据
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={`${r.title}-${i}`} className="bg-card/60">
                    <td className="px-3 py-2">
                      {r.titleLink ? (
                        <a
                          href={r.titleLink}
                          className="text-chart-1 hover:underline"
                        >
                          {r.title || "—"}
                        </a>
                      ) : (
                        <span className="text-chart-1">{r.title || "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {r.spaceLink ? (
                        <a
                          href={r.spaceLink}
                          className="text-chart-1 hover:underline"
                        >
                          {r.space || "—"}
                        </a>
                      ) : (
                        <span className="text-chart-1">{r.space || "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-card-foreground">
                      {formatInt(r.applicants)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
