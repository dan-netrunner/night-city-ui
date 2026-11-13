import { useRef, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: ReactNode;
  count?: number | string;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
};

export function Tabs({
  items,
  value,
  onChange,
  label,
  className = "",
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    const index = tabs.findIndex((tab) => tab.dataset.tabId === value);
    const next =
      tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next?.focus();
    if (next?.dataset.tabId) onChange(next.dataset.tabId);
  }

  return (
    <div
      ref={listRef}
      className={`cp-tabs ${className}`}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            data-tab-id={item.id}
            className={`cp-tab${selected ? " is-active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="cp-tab__count">{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
