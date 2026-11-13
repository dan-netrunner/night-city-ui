import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  /** Optional micro-telemetry tag rendered inside the button (e.g. "01", "NET"). */
  code?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  code,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "cp-btn",
    `cp-btn--${variant}`,
    `cp-btn--${size}`,
    block && "cp-btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {code && (
        <span className="cp-btn__code" aria-hidden="true">
          {code}
        </span>
      )}
      <span className="cp-btn__label">{children}</span>
    </button>
  );
}
