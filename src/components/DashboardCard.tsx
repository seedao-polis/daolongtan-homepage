import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** 追加到内容区（默认含 p-4） */
  bodyClassName?: string;
};

export function DashboardCard({
  title,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3.5">
        <h2 className="text-sm font-semibold tracking-tight text-card-foreground">
          {title}
        </h2>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className={`p-4 ${bodyClassName}`.trim()}>{children}</div>
    </section>
  );
}
