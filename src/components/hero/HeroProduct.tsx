import type { Lang } from '@/lib/i18n';
import { ADDED } from '@/content/added-strings';
import { AdminView } from '@/components/mockups/AdminShell';
import { ParusPhone } from './ParusPhone';

/**
 * Home hero visual: the product first. Parus (our wallet, paruspay.com) home screen in front,
 * its admin panel further back in greyscale. Pure HTML/CSS, server-rendered, no JS and no video.
 * Sizes per breakpoint live in components.css (.hero-stage); one accessible label for the whole scene.
 */
export function HeroProduct({ lang }: { lang: Lang }) {
  const T = ADDED[lang].parus;
  return (
    <div className="hero-stage" role="img" aria-label={T.label}>
      <div className="hero-admin" aria-hidden="true">
        <div className="hero-admin-in">
          <AdminView
            lang={lang}
            decorative
            url={null}
            brand={`PARUS · ${T.admin}`}
            logo={
              // eslint-disable-next-line @next/next/no-img-element -- static export, tiny decorative asset
              <img src="/media/parus/sail.png" alt="" width={19} height={24} />
            }
          />
        </div>
      </div>
      <div className="hero-phone">
        <ParusPhone lang={lang} />
      </div>
    </div>
  );
}
