import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardCard({
  title,
  actions,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3.5">
        <h2 className="text-sm font-semibold tracking-tight text-card-foreground">
          {title}
        </h2>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
