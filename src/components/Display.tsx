import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "accent" | "ok" | "warn" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  solid?: boolean;
  /** Renders a pulsing HUD status node before the label. */
  pulse?: boolean;
};

export function Badge({
  tone = "neutral",
  solid = false,
  pulse = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`cp-badge cp-badge--${tone}${solid ? " cp-badge--solid" : ""}${pulse ? " cp-badge--pulse" : ""} ${className}`}
      {...props}
    >
      {pulse && <span className="cp-badge__node" aria-hidden="true" />}
      {children}
    </span>
  );
}

export type ProgressProps = {
  value: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  tone?: "accent" | "ok" | "warn" | "danger";
  /** Renders discrete Cyberpunk HUD segments instead of a continuous bar. */
  segmented?: boolean;
  segments?: number;
  className?: string;
};

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  tone = "accent",
  segmented = false,
  segments = 12,
  className = "",
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);
  const totalSegments = Math.max(4, Math.min(24, segments));
  const activeSegments = Math.round((percent / 100) * totalSegments);

  return (
    <div className={`cp-progress ${className}`}>
      {(label || showValue) && (
        <div className="cp-progress__meta">
          <span>{label}</span>
          {showValue && <span className="cp-progress__value">{percent}%</span>}
        </div>
      )}
      {segmented ? (
        <div
          className="cp-progress__segments"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={clamped}
          aria-label={typeof label === "string" ? label : undefined}
        >
          {Array.from({ length: totalSegments }, (_, index) => (
            <span
              key={index}
              className={`cp-progress__seg${index < activeSegments ? ` is-filled cp-progress__fill--${tone}` : ""}`}
            />
          ))}
        </div>
      ) : (
        <div
          className="cp-progress__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={clamped}
          aria-label={typeof label === "string" ? label : undefined}
        >
          <span
            className={`cp-progress__fill cp-progress__fill--${tone}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

const ALERT_GLYPHS = { info: "i", ok: "✓", warn: "!", danger: "!" } as const;

export type AlertProps = {
  tone?: keyof typeof ALERT_GLYPHS;
  title?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
};

export function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
  className = "",
}: AlertProps) {
  return (
    <div
      className={`cp-alert cp-alert--${tone} ${className}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <span className="cp-alert__icon" aria-hidden="true">
        {ALERT_GLYPHS[tone]}
      </span>
      <div className="cp-alert__content">
        {title && <p className="cp-alert__title">{title}</p>}
        {children && <p className="cp-alert__body">{children}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="cp-alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

/* ---------- Divider ---------- */

export type DividerProps = {
  label?: ReactNode;
  className?: string;
};

export function Divider({ label, className = "" }: DividerProps) {
  return (
    <div
      className={`cp-divider${label ? " cp-divider--label" : ""} ${className}`}
      role="separator"
    >
      {label && <span className="cp-divider__label">{label}</span>}
    </div>
  );
}

/* ---------- Kbd ---------- */

export type KbdProps = HTMLAttributes<HTMLElement>;

export function Kbd({ className = "", children, ...props }: KbdProps) {
  return (
    <kbd className={`cp-kbd ${className}`} {...props}>
      {children}
    </kbd>
  );
}

/* ---------- Avatar ---------- */

export type AvatarProps = {
  name: string;
  src?: string;
  status?: "online" | "busy" | "offline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({
  name,
  src,
  status,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      className={`cp-avatar cp-avatar--${size} ${className}`}
      role="img"
      aria-label={name}
    >
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials}</span>}
      {status && (
        <span
          className={`cp-avatar__status cp-avatar__status--${status}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

/* ---------- Skeleton ---------- */

export type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export function Skeleton({ width, height, className = "" }: SkeletonProps) {
  const style: CSSProperties = { width, height };
  return <span className={`cp-skeleton ${className}`} style={style} aria-hidden="true" />;
}

/* ---------- Spinner ---------- */

export type SpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Spinner({ label = "Loading", size = "md", className = "" }: SpinnerProps) {
  return (
    <span className={`cp-spinner-wrap ${className}`} role="status">
      <span className={`cp-spinner cp-spinner--${size}`} aria-hidden="true" />
      <span className="cp-spinner__label">{label}</span>
    </span>
  );
}

/* ---------- Metric ---------- */

export type MetricProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  delta?: ReactNode;
  tone?: "accent" | "ok" | "warn" | "danger";
  className?: string;
};

export function Metric({
  label,
  value,
  unit,
  delta,
  tone = "accent",
  className = "",
}: MetricProps) {
  return (
    <div className={`cp-metric cp-metric--${tone} ${className}`}>
      <span className="cp-metric__label">{label}</span>
      <span className="cp-metric__value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {delta && <span className="cp-metric__delta">{delta}</span>}
    </div>
  );
}

/* ---------- Empty state ---------- */

export type EmptyStateProps = {
  title: ReactNode;
  children?: ReactNode;
  glyph?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  children,
  glyph = "//",
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`cp-empty ${className}`}>
      <span className="cp-empty__glyph" aria-hidden="true">
        {glyph}
      </span>
      <p className="cp-empty__title">{title}</p>
      {children && <p className="cp-empty__body">{children}</p>}
      {action}
    </div>
  );
}
