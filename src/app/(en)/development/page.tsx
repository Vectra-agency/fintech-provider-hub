import { pageMetadata } from '@/lib/seo';
import { DevelopmentPage } from '@/views/DevelopmentPage';

export const metadata = pageMetadata('en', 'development');

export default function Page() {
  return <DevelopmentPage lang="en" />;
}
