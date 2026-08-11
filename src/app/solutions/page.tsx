import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import SolutionsPageWrapper from './SolutionsPageWrapper';

export const metadata: Metadata = {
  title: "Solutions | HiFiveAI - Enterprise HR & Workforce Intelligence",
  description:
    "Unified workforce solutions for C-suite leaders, CHROs, CFOs, COOs, Legal, and IT teams. Consolidate hiring, payroll, compliance, and ops into one platform.",
  alternates: {
    canonical: "https://www.hifiveai.co/solutions",
  },
  openGraph: {
    title: "Solutions | HiFiveAI - Enterprise HR & Workforce Intelligence",
    description:
      "Unified workforce solutions tailored for leadership roles across your organization.",
    url: "https://www.hifiveai.co/solutions",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="solutions">
      <SolutionsPageWrapper />
    </MainLayout>
  );
}
