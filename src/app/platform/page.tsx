import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import PlatformPageWrapper from './PlatformPageWrapper';

export const metadata: Metadata = {
  title: "Platform | HiFiveAI - The AI-Native People Operating System",
  description:
    "Explore HiFiveAI's interconnected modules: HiAI, HiTalent, HiPeople, HiPay, HiGlobal, and HiOps. One continuously learning workforce intelligence system.",
  alternates: {
    canonical: "https://www.hifiveai.co/platform",
  },
  openGraph: {
    title: "Platform | HiFiveAI - The AI-Native People Operating System",
    description:
      "Explore HiFiveAI's interconnected modules: HiAI, HiTalent, HiPeople, HiPay, HiGlobal, and HiOps.",
    url: "https://www.hifiveai.co/platform",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="platform">
      <PlatformPageWrapper />
    </MainLayout>
  );
}
