import type { ActivityOverview } from "@/api/types";
import { formatInt } from "@/lib/format";

type Props = {
  overview: ActivityOverview;
};

export function ActivityTableSection({ overview }: Props) {
  const { totalActivities, totalApplicants, rows } = overview;
  const scrollBody = rows.length > 10;

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
        <div
          className={scrollBody ? "max-h-[360px] overflow-y-auto" : undefined}
        >
          <table className="w-full min-w-[520px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[46%]" />
              <col className="w-[30%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-secondary/95 text-xs uppercase text-muted-foreground backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-medium">活动标题</th>
                <th className="px-3 py-2 text-left font-medium">举办空间</th>
                <th className="px-3 py-2 text-right font-medium">报名人次</th>
              </tr>
            </thead>
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
                    <td className="px-3 py-2 align-top">
                      {r.titleLink ? (
                        <a
                          href={r.titleLink}
                          className="line-clamp-2 text-chart-1 hover:underline"
                        >
                          {r.title || "—"}
                        </a>
                      ) : (
                        <span className="line-clamp-2 text-chart-1">
                          {r.title || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {r.spaceLink ? (
                        <a
                          href={r.spaceLink}
                          className="line-clamp-2 text-chart-1 hover:underline"
                        >
                          {r.space || "—"}
                        </a>
                      ) : (
                        <span className="line-clamp-2 text-chart-1">
                          {r.space || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right align-top tabular-nums text-card-foreground">
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
