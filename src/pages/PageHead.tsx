import type { ReactNode } from "react";

export function PageHead({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="page-head__copy">
        <div className="cp-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      {children && <div className="page-head__aside">{children}</div>}
    </header>
  );
}
