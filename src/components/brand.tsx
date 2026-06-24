import type { SVGProps } from "react";

export function CircleMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      {...props}
    >
      <path
        d="M65 14.5C51.4 2.4 30.3 4.1 17.9 17.7 5.3 31.5 5.9 52.8 20 65.2c13.4 11.7 34 10.8 46.2-2.1"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M40 24c1.7 7.6 1.7 18.1 0 32M24 40c7.6-1.7 18.1-1.7 32 0M29.1 29.1c5 4 12.3 11.4 21.8 21.8M50.9 29.1c-4 5-11.4 12.3-21.8 21.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="6.3" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""}`}>
      <CircleMark className="wordmark__mark" />
      <span>
        Ipi Tombe
        <br className={compact ? "wordmark__break" : ""} /> Circle
      </span>
    </span>
  );
}
