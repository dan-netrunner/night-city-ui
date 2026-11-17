import type { ReactNode } from "react";

/* ---------- Breadcrumbs ---------- */

export type Crumb = {
  label: ReactNode;
  href?: string;
};

export type BreadcrumbsProps = {
  items: Crumb[];
  label?: string;
  className?: string;
};

export function Breadcrumbs({
  items,
  label = "Breadcrumb",
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav className={`cp-breadcrumbs ${className}`} aria-label={label}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={index}>
              {item.href && !current ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span aria-current={current ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Pagination ---------- */

export type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label?: string;
  className?: string;
};

export function Pagination({
  page,
  pageCount,
  onChange,
  label = "Pagination",
  className = "",
}: PaginationProps) {
  const total = Math.max(1, pageCount);
  return (
    <nav className={`cp-pagination ${className}`} aria-label={label}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Prev
      </button>
      {/* shortcut: renders every page number; window it when pageCount routinely exceeds ~20 */}
      {Array.from({ length: total }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
      >
        Next
      </button>
    </nav>
  );
}
