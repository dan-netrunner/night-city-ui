import {
  useId,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

type FieldExtras = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

function fieldMessage(id: string, error?: ReactNode, hint?: ReactNode) {
  if (!error && !hint) return null;
  return (
    <p id={`${id}-msg`} className={`cp-field__msg${error ? " is-error" : ""}`}>
      {error ?? hint}
    </p>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldExtras;

export function Input({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={`cp-field ${className}`}>
      {label && (
        <label className="cp-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className={`cp-input${error ? " cp-input--error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fieldId}-msg` : undefined}
        {...props}
      />
      {fieldMessage(fieldId, error, hint)}
    </div>
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldExtras;

export function Select({
  label,
  hint,
  error,
  id,
  className = "",
  children,
  ...props
}: SelectProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={`cp-field ${className}`}>
      {label && (
        <label className="cp-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="cp-select">
        <select
          id={fieldId}
          className="cp-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${fieldId}-msg` : undefined}
          {...props}
        >
          {children}
        </select>
      </div>
      {fieldMessage(fieldId, error, hint)}
    </div>
  );
}

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: ReactNode;
};

export function Checkbox({
  label,
  hint,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label className={`cp-check ${className}`} htmlFor={fieldId}>
      <input
        type="checkbox"
        id={fieldId}
        className="cp-check__input"
        {...props}
      />
      <span className="cp-check__box" aria-hidden="true" />
      <span className="cp-check__text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export type ToggleProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: ReactNode;
};

export function Toggle({
  label,
  hint,
  id,
  className = "",
  ...props
}: ToggleProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label className={`cp-toggle ${className}`} htmlFor={fieldId}>
      <span className="cp-toggle__text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        id={fieldId}
        className="cp-toggle__input"
        {...props}
      />
      <span className="cp-toggle__track" aria-hidden="true">
        <span className="cp-toggle__thumb" />
      </span>
    </label>
  );
}

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max"
> & {
  label?: ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  suffix?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function Slider({
  label,
  value,
  defaultValue,
  min = 0,
  max = 100,
  suffix = "%",
  onChange,
  id,
  className = "",
  ...props
}: SliderProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [internal, setInternal] = useState(defaultValue ?? min);
  const current = value ?? internal;
  const range = max - min;
  const fill = range > 0 ? ((current - min) / range) * 100 : 0;

  return (
    <div className={`cp-slider ${className}`}>
      <div className="cp-slider__head">
        {label ? (
          <label className="cp-field__label" htmlFor={fieldId}>
            {label}
          </label>
        ) : (
          <span />
        )}
        <output className="cp-slider__value" htmlFor={fieldId}>
          {current}
          {suffix}
        </output>
      </div>
      <input
        type="range"
        id={fieldId}
        min={min}
        max={max}
        value={current}
        style={{ "--fill": `${fill}%` } as CSSProperties}
        onChange={(event) => {
          if (value === undefined) setInternal(Number(event.target.value));
          onChange?.(event);
        }}
        {...props}
      />
    </div>
  );
}
