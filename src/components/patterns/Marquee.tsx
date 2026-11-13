/**
 * P2 / PRD §7.2 — infinite text strip, CSS only (no JS): the second copy is aria-hidden, the animation
 * pauses on hover and on focus inside, and with reduced motion the strip is static and wraps.
 */
export function Marquee({ items, label }: { items: readonly string[]; label?: string }) {
  const list = (hidden: boolean) => (
    <ul className={`marquee-list${hidden ? ' marquee-dup' : ''}`} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={`${t}-${i}`}>{t}</li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" aria-label={label} role={label ? 'region' : undefined}>
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
