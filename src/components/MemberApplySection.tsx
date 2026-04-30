import type { MemberApplyItem } from "@/api/types";

const ICONS = ["🧑‍💻", "🤝", "📋", "🛠️"] as const;

type Props = {
  items: MemberApplyItem[];
};

export function MemberApplySection({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((m, i) => (
        <div
          key={m.key}
          className="rounded-lg border border-border bg-secondary/50 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-lg" aria-hidden>
              {ICONS[i] ?? "•"}
            </span>
            <span className="text-right text-xs font-medium text-card-foreground">
              {m.title}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            申请{" "}
            <span className="text-foreground tabular-nums">{m.applied}</span> 名
          </p>
          <span className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-xs text-success ring-1 ring-success/30">
            通过 {m.passed} 名
          </span>
        </div>
      ))}
    </div>
  );
}
