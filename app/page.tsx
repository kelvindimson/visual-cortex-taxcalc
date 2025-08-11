import { TaxCalculator } from '@/components/TaxCalculator';

// Metadata for SEO
export const metadata = {
  title: 'Australian Tax Calculator 2025-26 | Calculate Your Income Tax',
  description: 'Calculate your Australian income tax for 2022-23 to 2025-26. Includes Medicare Levy, tax brackets, and Stage 3 tax cuts. Free, accurate, and easy to use.',
  keywords: 'australian tax calculator, income tax calculator, tax brackets australia, medicare levy, stage 3 tax cuts',
  openGraph: {
    title: 'Australian Tax Calculator',
    description: 'Calculate your estimated Australian income tax instantly',
    type: 'website',
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-00">
      
      <div className="container mx-auto px-4 py-12 ">
        <div className="max-w-3xl mx-auto ">
          <TaxCalculator />
        </div>
      </div>
    </main>
  );
}

