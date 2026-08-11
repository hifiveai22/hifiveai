'use client';

import { useRouter } from 'next/navigation';
import WhyPage from '@/components/hifive/WhyPage';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

export default function AdvantagePageWrapper() {
  const router = useRouter();

  const handleNavigate = (page: PageId) => {
    const route = PAGE_ROUTES[page] || '/';
    router.push(route);
  };

  return <WhyPage onNavigate={handleNavigate} />;
}
