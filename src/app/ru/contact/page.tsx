import { pageMetadata } from '@/lib/seo';
import { ContactPage } from '@/views/ContactPage';

export const metadata = pageMetadata('ru', 'contact');

export default function Page() {
  return <ContactPage lang="ru" />;
}
