import { pageMetadata } from '@/lib/seo';
import { ContactPage } from '@/views/ContactPage';

export const metadata = pageMetadata('en', 'contact');

export default function Page() {
  return <ContactPage lang="en" />;
}
