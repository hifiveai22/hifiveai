import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import ResourcesPageWrapper from './ResourcesPageWrapper';

export const metadata: Metadata = {
  title: "Resources | HiFiveAI - HR Insights, Guides & Articles",
  description:
    "Explore expert insights, global HR guides, industry benchmarks, and strategic articles on global payroll, AI hiring, compliance, and people operations.",
  alternates: {
    canonical: "https://www.hifiveai.co/resources",
  },
  openGraph: {
    title: "Resources | HiFiveAI - HR Insights, Guides & Articles",
    description:
      "Expert guides, industry research, and actionable insights for HR and talent leaders.",
    url: "https://www.hifiveai.co/resources",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="resources">
      <ResourcesPageWrapper />
    </MainLayout>
  );
}
