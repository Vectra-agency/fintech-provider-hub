import type { AnchorHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { ChevronsRightIcon, TelegramIcon, ArrowIcon } from './icons';

/**
 * Reference buttons (PRD §4.3.3): labels are uppercased by CSS — dictionary texts stay as they are.
 *  - outline: black pill, hairline border with a light travelling along it
 *  - solid:   white pill, black text, thin top highlight
 *  - ghost:   translucent pill with a light border (non-featured pricing buttons of the reference)
 * Telegram links get the Telegram glyph (as in the prototype) and open in a new tab.
 */
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  variant?: 'outline' | 'solid' | 'ghost';
  size?: 'sm' | 'md';
  icon?: 'telegram' | 'chevrons' | 'arrow' | 'none';
  children: ReactNode;
};

export function Button({ href, variant = 'solid', size = 'md', icon, className = '', children, ...rest }: Props) {
  const external = /^https?:\/\//.test(href);
  const glyph = icon ?? (href.startsWith('https://t.me/') ? 'telegram' : variant === 'outline' ? 'chevrons' : 'none');
  const inner = (
    <>
      {variant === 'outline' && (
        <>
          <span className="btn-star-light" aria-hidden="true" />
          <span className="btn-star-fill" aria-hidden="true" />
        </>
      )}
      {variant === 'solid' && <span className="btn-solid-highlight" aria-hidden="true" />}
      <span className="btn-label">
        {glyph === 'telegram' && <TelegramIcon size={size === 'sm' ? 14 : 16} />}
        {children}
        {glyph === 'chevrons' && <ChevronsRightIcon />}
        {glyph === 'arrow' && <ArrowIcon size={14} />}
      </span>
    </>
  );
  const cls = `btn btn-${variant} btn-${size} ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls} {...rest}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
