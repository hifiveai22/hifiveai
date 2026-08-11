'use client';

import { useRouter } from 'next/navigation';
import PlatformPage from '@/components/hifive/PlatformPage';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

export default function PlatformPageWrapper() {
  const router = useRouter();

  const handleNavigate = (page: PageId) => {
    const route = PAGE_ROUTES[page] || '/';
    router.push(route);
  };

  return <PlatformPage onNavigate={handleNavigate} />;
}
