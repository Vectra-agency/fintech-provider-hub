import { pageMetadata } from '@/lib/seo';
import { PaymentsPage } from '@/views/PaymentsPage';

export const metadata = pageMetadata('en', 'payments');

export default function Page() {
  return <PaymentsPage lang="en" />;
}
