'use client';

import { useRouter } from 'next/navigation';
import HomePage from '@/components/hifive/HomePage';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

export default function HomePageWrapper() {
  const router = useRouter();

  const handleNavigate = (page: PageId, sectionId?: string) => {
    const route = PAGE_ROUTES[page] || '/';
    if (sectionId) {
      router.push(`${route}#${sectionId}`);
    } else {
      router.push(route);
    }
  };

  return <HomePage onNavigate={handleNavigate} />;
}
