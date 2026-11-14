import { pageMetadata } from '@/lib/seo';
import { WalletPage } from '@/views/WalletPage';

export const metadata = pageMetadata('en', 'wallet');

export default function Page() {
  return <WalletPage lang="en" />;
}
