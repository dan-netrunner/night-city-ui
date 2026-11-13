import { useEffect, useState } from "react";
import { Button } from "./Button";

export type CodeBlockProps = {
  code: string;
  label?: string;
  className?: string;
};

export function CodeBlock({
  code,
  label = "JSX // SNIPPET",
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`cp-code ${className}`}>
      <div className="cp-code__bar">
        <span className="cp-code__label">{label}</span>
        <Button
          variant={copied ? "outline" : "ghost"}
          size="sm"
          onClick={handleCopy}
          aria-live="polite"
        >
          {copied ? "Copied // OK" : "Copy"}
        </Button>
      </div>
      <pre className="cp-code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
