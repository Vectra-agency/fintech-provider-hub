import { pageMetadata } from '@/lib/seo';
import { PaymentsPage } from '@/views/PaymentsPage';

export const metadata = pageMetadata('ru', 'payments');

export default function Page() {
  return <PaymentsPage lang="ru" />;
}
