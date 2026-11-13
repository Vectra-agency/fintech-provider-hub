'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { Lang } from '@/lib/i18n';
import { otherLang, tgUrl } from '@/lib/i18n';
import { type HomeAnchor, pagePath, parsePath } from '@/lib/routes';
import type { SolutionId } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { LogoLockup } from '@/components/ui/Logo';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/ui/icons';

export type HeaderLabels = {
  solutions: string;
  features: string;
  projects: string;
  about: string;
  contact: string;
  demo: string;
  menu: string;
  close: string;
  langName: string;
  otherName: string;
  landmarks: { main: string; mobile: string; language: string };
  sol: readonly { id: SolutionId; name: string; short: string }[];
};

const ANCHORS: readonly HomeAnchor[] = ['solutions', 'features'];

// current home anchor, for the language switch to keep it (PRD §5)
function subscribeHash(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
const getHash = (): HomeAnchor | null => {
  const h = window.location.hash.slice(1) as HomeAnchor;
  return ANCHORS.includes(h) ? h : null;
};
const getServerHash = () => null;

/** PRD §5, §7.8 — sticky header in the reference style. Client island. */
export function Header({ lang, labels }: { lang: Lang; labels: HeaderLabels }) {
  const pathname = usePathname();
  const { page } = parsePath(pathname);
  const current = page ?? 'home';
  const other = otherLang(lang);
  const anchor = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const switchHref = pagePath(other, current, current === 'home' ? (anchor ?? undefined) : undefined);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => burgerRef.current?.focus());
  }, []);

  // close the mobile menu on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const cur = (p: string) => (current === p ? ({ 'aria-current': 'page' } as const) : {});
  const featuresCurrent = current === 'home' && anchor === 'features' ? ({ 'aria-current': 'page' } as const) : {};

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="frame-container site-header-bar">
          <div className="flex h-12 items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5">
            <Link href={pagePath(lang, 'home')} className="shrink-0">
              <LogoLockup gradientId="logo-g-header" size={26} />
            </Link>

            <nav aria-label={labels.landmarks.main} className="hidden items-center gap-7 lg:flex">
              <SolutionsMenu lang={lang} labels={labels} />
              <Link href={pagePath(lang, 'home', 'features')} className="nav-link" {...featuresCurrent}>
                {labels.features}
              </Link>
              <Link href={pagePath(lang, 'projects')} className="nav-link" {...cur('projects')}>
                {labels.projects}
              </Link>
              <Link href={pagePath(lang, 'about')} className="nav-link" {...cur('about')}>
                {labels.about}
              </Link>
              <Link href={pagePath(lang, 'contact')} className="nav-link" {...cur('contact')}>
                {labels.contact}
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {/* below 390px the switch lives in the mobile menu only */}
              <div className="hidden xs:block">
                <LangSwitch lang={lang} labels={labels} href={switchHref} page={current} />
              </div>
              <Button
                href={tgUrl()}
                variant="outline"
                size="sm"
                className="hidden lg:inline-flex"
                data-ev="request_demo"
                data-placement="header"
              >
                {labels.demo}
              </Button>
              <button
                ref={burgerRef}
                type="button"
                className="icon-btn lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? labels.close : labels.menu}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>
      {menuOpen && (
        <MobileMenu lang={lang} labels={labels} switchHref={switchHref} page={current} onClose={closeMenu} />
      )}
    </>
  );
}

function LangSwitch({ lang, labels, href, page }: { lang: Lang; labels: HeaderLabels; href: string; page: string }) {
  const other = otherLang(lang);
  return (
    <div role="group" aria-label={labels.landmarks.language} className="lang-switch">
      <span aria-current="true">{labels.langName}</span>
      <a href={href} lang={other} hrefLang={other} data-ev="lang_switch" data-page={page} data-from={lang} data-to={other}>
        {labels.otherName}
      </a>
    </div>
  );
}

/** Opens on hover, click and Enter; closes on Esc, outside click and focus leaving (PRD §7.8). */
function SolutionsMenu({ lang, labels }: { lang: Lang; labels: HeaderLabels }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="nav-link inline-flex items-center gap-1"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {labels.solutions}
        <ChevronDownIcon size={12} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id={panelId} className="dropdown-panel" data-open={open || undefined} hidden={!open}>
        {labels.sol.map((s) => (
          <Link key={s.id} href={pagePath(lang, s.id)} className="dropdown-item" onClick={() => setOpen(false)}>
            <b>{s.name}</b>
            <span>{s.short}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Full-screen menu: focus trapped, Esc closes, page scroll locked, closes on navigation (PRD §7.8). */
function MobileMenu({
  lang,
  labels,
  switchHref,
  page,
  onClose,
}: {
  lang: Lang;
  labels: HeaderLabels;
  switchHref: string;
  page: string;
  onClose: (restoreFocus?: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={labels.menu}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) onClose(false);
      }}
    >
      <div className="frame-container flex h-12 items-center justify-between px-5">
        <Link href={pagePath(lang, 'home')}>
          <LogoLockup gradientId="logo-g-menu" size={26} />
        </Link>
        <button type="button" className="icon-btn" aria-label={labels.close} onClick={() => onClose()}>
          <CloseIcon />
        </button>
      </div>
      <nav aria-label={labels.landmarks.mobile} className="frame-container flex flex-col px-5 pb-10 pt-6">
        <Link href={pagePath(lang, 'home', 'solutions')} className="mobile-link">
          {labels.solutions}
        </Link>
        {labels.sol.map((s) => (
          <Link key={s.id} href={pagePath(lang, s.id)} className="mobile-link mobile-sub">
            {s.name}
          </Link>
        ))}
        <Link href={pagePath(lang, 'home', 'features')} className="mobile-link">
          {labels.features}
        </Link>
        <Link href={pagePath(lang, 'projects')} className="mobile-link">
          {labels.projects}
        </Link>
        <Link href={pagePath(lang, 'about')} className="mobile-link">
          {labels.about}
        </Link>
        <Link href={pagePath(lang, 'contact')} className="mobile-link">
          {labels.contact}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LangSwitch lang={lang} labels={labels} href={switchHref} page={page} />
          <Button href={tgUrl()} variant="solid" data-ev="request_demo" data-placement="mobile_menu">
            {labels.demo}
          </Button>
        </div>
      </nav>
    </div>
  );
}
