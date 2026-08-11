import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import AdvantagePageWrapper from './AdvantagePageWrapper';

export const metadata: Metadata = {
  title: "Advantage | Why HiFiveAI - Unified vs Fragmented HR Stack",
  description:
    "Discover why forward-thinking organizations choose HiFiveAI. Calculate your TCO savings, eliminate vendor fragmentation, and upgrade your HR stack.",
  alternates: {
    canonical: "https://www.hifiveai.co/advantage",
  },
  openGraph: {
    title: "Advantage | Why HiFiveAI - Unified vs Fragmented HR Stack",
    description:
      "Calculate your TCO savings and discover the power of a single connected People OS.",
    url: "https://www.hifiveai.co/advantage",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="advantage">
      <AdvantagePageWrapper />
    </MainLayout>
  );
}
