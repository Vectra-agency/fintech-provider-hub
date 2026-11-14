import { pageMetadata } from '@/lib/seo';
import { AboutPage } from '@/views/AboutPage';

export const metadata = pageMetadata('en', 'about');

export default function Page() {
  return <AboutPage lang="en" />;
}
