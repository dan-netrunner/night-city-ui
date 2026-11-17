import {
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";

/* ---------- Tooltip ---------- */

export type TooltipProps = {
  label: ReactNode;
  /** The trigger must be focusable (button, link, input) to open the bubble. */
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
};

export function Tooltip({ label, children, side = "top", className = "" }: TooltipProps) {
  const id = useId();
  const trigger = isValidElement<{ "aria-describedby"?: string }>(children)
    ? cloneElement(children, {
        "aria-describedby": [
          children.props["aria-describedby"],
          id,
        ]
          .filter(Boolean)
          .join(" "),
      })
    : children;

  return (
    <span className={`cp-tooltip cp-tooltip--${side} ${className}`}>
      {trigger}
      <span className="cp-tooltip__bubble" role="tooltip" id={id}>
        {label}
      </span>
    </span>
  );
}

/* ---------- Toast ---------- */

type Tone = "info" | "ok" | "warn" | "danger";

const TONE_GLYPHS: Record<Tone, string> = {
  info: "i",
  ok: "✓",
  warn: "!",
  danger: "!",
};

export type ToastProps = {
  title: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  onDismiss?: () => void;
  className?: string;
};

export function Toast({
  title,
  children,
  tone = "info",
  onDismiss,
  className = "",
}: ToastProps) {
  return (
    <div
      className={`cp-toast cp-toast--${tone} ${className}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <span className="cp-toast__icon" aria-hidden="true">
        {TONE_GLYPHS[tone]}
      </span>
      <div className="cp-toast__content">
        <p className="cp-toast__title">{title}</p>
        {children && <p className="cp-toast__body">{children}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="cp-toast__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export type ToastItem = {
  id: string;
  title: ReactNode;
  message?: ReactNode;
  tone?: Tone;
};

export type ToastStackProps = {
  items: ToastItem[];
  onDismiss: (id: string) => void;
  label?: string;
  className?: string;
};

export function ToastStack({
  items,
  onDismiss,
  label = "Notifications",
  className = "",
}: ToastStackProps) {
  if (items.length === 0) return null;
  return (
    <div className={`cp-toasts ${className}`} role="region" aria-label={label}>
      {items.map((item) => (
        <Toast
          key={item.id}
          title={item.title}
          tone={item.tone}
          onDismiss={() => onDismiss(item.id)}
        >
          {item.message}
        </Toast>
      ))}
    </div>
  );
}
