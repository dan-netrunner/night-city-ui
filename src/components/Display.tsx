import type { HTMLAttributes, ReactNode } from "react";

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
