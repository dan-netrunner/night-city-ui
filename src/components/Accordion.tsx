import type { ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Id of the item rendered open on mount. */
  defaultOpen?: string;
  className?: string;
};

export function Accordion({ items, defaultOpen, className = "" }: AccordionProps) {
  return (
    <div className={`cp-accordion ${className}`}>
      {items.map((item) => (
        <details
          key={item.id}
          className="cp-accordion__item"
          open={item.id === defaultOpen || undefined}
        >
          <summary className="cp-accordion__summary">
            <span className="cp-accordion__title">{item.title}</span>
            {item.meta && <span className="cp-accordion__meta">{item.meta}</span>}
            <span className="cp-accordion__chevron" aria-hidden="true" />
          </summary>
          <div className="cp-accordion__body">{item.children}</div>
        </details>
      ))}
    </div>
  );
}
