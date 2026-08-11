'use client';

import { useRouter } from 'next/navigation';
import ResourcesPage from '@/components/hifive/ResourcesPage';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

export default function ResourcesPageWrapper() {
  const router = useRouter();

  const handleNavigate = (page: PageId) => {
    const route = PAGE_ROUTES[page] || '/';
    router.push(route);
  };

  return <ResourcesPage onNavigate={handleNavigate} />;
}
