import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import HomePageWrapper from './HomePageWrapper';

export const metadata: Metadata = {
  title: "HiFiveAI: AI-Native People Operating System",
  description:
    "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
  alternates: {
    canonical: "https://www.hifiveai.co/",
  },
  openGraph: {
    title: "HiFiveAI: AI-Native People Operating System",
    description:
      "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
    url: "https://www.hifiveai.co/",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="home">
      <HomePageWrapper />
    </MainLayout>
  );
}
