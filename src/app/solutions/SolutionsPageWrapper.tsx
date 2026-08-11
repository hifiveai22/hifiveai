'use client';

import { useRouter } from 'next/navigation';
import SolutionsPage from '@/components/hifive/SolutionsPage';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

export default function SolutionsPageWrapper() {
  const router = useRouter();

  const handleNavigate = (page: PageId) => {
    const route = PAGE_ROUTES[page] || '/';
    router.push(route);
  };

  return <SolutionsPage onNavigate={handleNavigate} />;
}
