import { pageMetadata } from '@/lib/seo';
import { CardsPage } from '@/views/CardsPage';

export const metadata = pageMetadata('ru', 'cards');

export default function Page() {
  return <CardsPage lang="ru" />;
}
