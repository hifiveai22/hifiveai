import type { Metadata } from 'next';
import MainLayout from '@/components/hifive/MainLayout';
import ContactPageWrapper from './ContactPageWrapper';

export const metadata: Metadata = {
  title: "Contact Us | HiFiveAI - Book a Free HR Audit",
  description:
    "Get in touch with HiFiveAI experts or book a free HR audit to transform your global workforce operations and simplify your HR tech stack.",
  alternates: {
    canonical: "https://www.hifiveai.co/contact",
  },
  openGraph: {
    title: "Contact Us | HiFiveAI - Book a Free HR Audit",
    description:
      "Talk to our team or request a personalized demo and free HR audit.",
    url: "https://www.hifiveai.co/contact",
    siteName: "HiFiveAI",
  },
};

export default function Page() {
  return (
    <MainLayout activePage="contact">
      <ContactPageWrapper />
    </MainLayout>
  );
}
