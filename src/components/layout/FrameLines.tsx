/** Fixed decorative frame of the reference: two hairlines on each side of a 1400px column. */
export function FrameLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-1/2 z-[51] w-full max-w-[var(--frame-max)] -translate-x-1/2">
      <span className="absolute inset-y-0 left-0 w-px bg-white/15 mix-blend-difference lg:left-5" />
      <span className="absolute inset-y-0 right-0 w-px bg-white/15 mix-blend-difference lg:right-5" />
      <span className="absolute inset-y-0 left-px w-px bg-white/15 mix-blend-difference lg:left-7" />
      <span className="absolute inset-y-0 right-px w-px bg-white/15 mix-blend-difference lg:right-7" />
    </div>
  );
}

/** 40px band between sections (reference `main > div.h-10`), hairlines top and bottom. */
export function SectionDivider() {
  return <div aria-hidden="true" className="frame-container relative h-10 border-y border-white/[0.09]" />;
}
