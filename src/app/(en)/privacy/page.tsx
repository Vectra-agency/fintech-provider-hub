import { pageMetadata } from '@/lib/seo';
import { PrivacyPage } from '@/views/PrivacyPage';

export const metadata = pageMetadata('en', 'privacy');

export default function Page() {
  return <PrivacyPage lang="en" />;
}
