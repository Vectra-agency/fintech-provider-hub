/**
 * Fixed decorative frame of the reference around the 1400px column. One hairline per side: the
 * reference's paired lines read as a double frame, so they were reduced to one.
 */
export function FrameLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-1/2 z-[51] w-full max-w-[var(--frame-max)] -translate-x-1/2">
      <span className="absolute inset-y-0 left-0 w-px bg-white/15 mix-blend-difference lg:left-6" />
      <span className="absolute inset-y-0 right-0 w-px bg-white/15 mix-blend-difference lg:right-6" />
    </div>
  );
}

/** 40px gap between sections (reference `main > div.h-10`) with a single hairline on top. */
export function SectionDivider() {
  return <div aria-hidden="true" className="frame-container relative h-10 border-t border-white/[0.09]" />;
}
