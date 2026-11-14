import { pageMetadata } from '@/lib/seo';
import { HomePage } from '@/views/HomePage';

export const metadata = pageMetadata('ru', 'home');

export default function Page() {
  return <HomePage lang="ru" />;
}
