import type { HTMLAttributes, ReactNode } from "react";

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  kicker?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  accent?: boolean;
  flush?: boolean;
};

export function Panel({
  title,
  kicker,
  actions,
  footer,
  accent = false,
  flush = false,
  className = "",
  children,
  ...props
}: PanelProps) {
  const hasHead = Boolean(title || kicker || actions);
  const classes = [
    "cp-panel",
    accent && "cp-panel--accent",
    flush && "cp-panel--flush",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {hasHead && (
        <div className="cp-panel__head">
          <div className="cp-panel__heading">
            {kicker && <div className="cp-panel__kicker">{kicker}</div>}
            {title && <h3 className="cp-panel__title">{title}</h3>}
          </div>
          {actions && <div className="cp-panel__actions">{actions}</div>}
        </div>
      )}
      <div className="cp-panel__body">{children}</div>
      {footer && <div className="cp-panel__footer">{footer}</div>}
    </div>
  );
}
