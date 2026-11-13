/** Icons from the prototype (IC/TGSVG/ARR/CHK/INFO/SOL_ICO), as server components. All decorative. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, sw: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const TelegramIcon = ({ size = 18, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      d="M21.6 4.2 18.4 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 13.1 1.1 11.6c-1-.3-1-1 .2-1.5L20.3 2.8c.9-.3 1.6.2 1.3 1.4Z"
    />
  </svg>
);
export const ArrowIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, 2)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ChevronsRightIcon = ({ size = 14, ...p }: P) => (
  <svg {...base(size, 1.8)} {...p}>
    <path d="M12.5 18s6-4.42 6-6-6-6-6-6" />
    <path d="M5.5 18s6-4.42 6-6-6-6-6-6" />
  </svg>
);
export const ChevronDownIcon = ({ size = 14, ...p }: P) => (
  <svg {...base(size, 2.2)} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const CheckIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 2.4)} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const InfoIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, 2)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.5" />
  </svg>
);
export const MenuIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, 1.8)} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, 1.8)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SOL_PATHS = {
  wallet: (
    <>
      <path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M4 7l11-3v3" />
      <circle cx="16" cy="13.5" r="1.2" />
    </>
  ),
  cards: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  payments: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" />
    </>
  ),
  development: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
} as const;
export const SolutionIcon = ({ id, size = 22, ...p }: P & { id: keyof typeof SOL_PATHS }) => (
  <svg {...base(size, 1.9)} {...p}>
    {SOL_PATHS[id]}
  </svg>
);
