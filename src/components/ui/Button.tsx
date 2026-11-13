import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * Reference buttons (PRD §4.3.3): labels are uppercased by CSS — dictionary texts stay as they are.
 *  - outline: black pill, hairline border with a light travelling along it, "»" glyph
 *  - solid:   white pill, black text, thin top highlight
 */
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'outline' | 'solid';
  size?: 'sm' | 'md';
  external?: boolean;
  children: ReactNode;
};

export function Button({ variant = 'solid', size = 'md', external, className = '', children, ...rest }: Props) {
  const ext = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a {...ext} {...rest} className={`btn btn-${variant} btn-${size} ${className}`}>
      {variant === 'outline' && (
        <>
          <span className="btn-star-light" aria-hidden="true" />
          <span className="btn-star-fill" aria-hidden="true" />
        </>
      )}
      {variant === 'solid' && <span className="btn-solid-highlight" aria-hidden="true" />}
      <span className="btn-label">
        {children}
        {variant === 'outline' && <ChevronsRight />}
      </span>
    </a>
  );
}

function ChevronsRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12.5 18s6-4.42 6-6-6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 18s6-4.42 6-6-6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
