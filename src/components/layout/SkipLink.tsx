/** PRD §7.8 — first focusable element, jumps to <main id="main">. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a href="#main" className="skip-link">
      {label}
    </a>
  );
}
