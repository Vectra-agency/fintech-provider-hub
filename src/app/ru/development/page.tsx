import { pageMetadata } from '@/lib/seo';
import { DevelopmentPage } from '@/views/DevelopmentPage';

export const metadata = pageMetadata('ru', 'development');

export default function Page() {
  return <DevelopmentPage lang="ru" />;
}
