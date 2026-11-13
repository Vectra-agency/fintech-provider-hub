import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { TG_HANDLE, tgUrl } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { getDict } from '@/content';
import { LogoLockup } from '@/components/ui/Logo';
import { TelegramIcon } from '@/components/ui/icons';

/**
 * PRD §5 footer in the reference layout: logo + tagline + Telegram; Solutions; Company; Legal.
 * Bottom row: legal disclaimer (instead of the reference's "All systems operational") and ©.
 * The disclaimer is mandatory on every page (PRD §9.1).
 */
export function Footer({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  return (
    <footer className="relative bg-black">
      <div className="section-inner relative z-10">
        <div className="footer-grid pt-16 pb-12 lg:pt-20">
          <div className="flex flex-col gap-5">
            <Link href={pagePath(lang, 'home')} className="self-start" aria-label="Fintech Provider Hub">
              <LogoLockup gradientId="logo-g-footer" />
            </Link>
            <p className="max-w-[24rem] text-sm leading-relaxed text-white/60">{d.footer.tag}</p>
            <a
              href={tgUrl()}
              target="_blank"
              rel="noopener"
              className="footer-link inline-flex items-center gap-2 self-start"
              data-ev="contact_click"
              data-placement="footer"
            >
              <TelegramIcon size={16} />
              Telegram @{TG_HANDLE}
            </a>
          </div>
          <FooterCol title={d.nav.solutions} links={d.sol.map((s) => [pagePath(lang, s.id), s.name])} />
          <FooterCol
            title={d.footer.company}
            links={[
              [pagePath(lang, 'projects'), d.nav.projects],
              [pagePath(lang, 'about'), d.nav.about],
              [pagePath(lang, 'contact'), d.nav.contact],
            ]}
          />
          <FooterCol
            title={d.footer.legal}
            links={[
              [pagePath(lang, 'privacy'), d.meta.privacy],
              [pagePath(lang, 'terms'), d.meta.terms],
            ]}
          />
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-white/40 md:flex-row md:items-start md:justify-between md:gap-12">
          <p className="max-w-[70ch] text-xs leading-relaxed text-white/50">{d.footer.disc}</p>
          <p className="shrink-0">{d.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="mb-6 text-sm font-medium text-white">{title}</h2>
      <ul className="flex flex-col gap-4">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="footer-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
