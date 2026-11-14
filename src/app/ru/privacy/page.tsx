import { pageMetadata } from '@/lib/seo';
import { PrivacyPage } from '@/views/PrivacyPage';

export const metadata = pageMetadata('ru', 'privacy');

export default function Page() {
  return <PrivacyPage lang="ru" />;
}
