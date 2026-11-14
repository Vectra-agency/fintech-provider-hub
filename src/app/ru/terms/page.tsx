import { pageMetadata } from '@/lib/seo';
import { TermsPage } from '@/views/TermsPage';

export const metadata = pageMetadata('ru', 'terms');

export default function Page() {
  return <TermsPage lang="ru" />;
}
