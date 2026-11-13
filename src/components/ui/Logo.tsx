/** Our logo (prototype `LOGO`) + wordmark. Never the Qronos logo (PRD §4.3.3). */
export function LogoMark({ size = 28, gradientId }: { size?: number; gradientId: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" className="flex-none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5B8CFF" />
          <stop offset="1" stopColor="#A07EFF" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill={`url(#${gradientId})`} />
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M17 17L9.5 10.5M17 17l7.5-6.5M17 17v8" />
      </g>
      <g fill="#fff">
        <circle cx="17" cy="17" r="3.4" />
        <circle cx="9" cy="10" r="2.3" />
        <circle cx="25" cy="10" r="2.3" />
        <circle cx="17" cy="26" r="2.3" />
      </g>
    </svg>
  );
}

export function LogoLockup({ gradientId, size = 28 }: { gradientId: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} gradientId={gradientId} />
      <span className="flex flex-col font-display text-[15px] leading-none tracking-tight text-white">
        Fintech Provider Hub
        <small className="mt-1 font-sans text-[10px] uppercase tracking-[0.08em] text-white/50">Hong Kong</small>
      </span>
    </span>
  );
}
