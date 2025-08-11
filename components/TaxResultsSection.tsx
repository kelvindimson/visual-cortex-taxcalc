'use client';

import React from 'react';
import { TaxResultCards } from './TaxResultCards';
import { TaxBreakdown } from './TaxBreakdown';

interface TaxResultsSectionProps {
  result: TaxCalculationResult | null;
}

export function TaxResultsSection({ result }: TaxResultsSectionProps) {
  if (!result) return null;

  return (
    <div className="border-t border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Tax Calculation Results</h2>
        
        {/* Summary Cards */}
        <TaxResultCards 
          netIncome={result.netIncome}
          totalTax={result.totalTax}
          effectiveRate={result.effectiveRate}
        />

        {/* Detailed Breakdown */}
        <TaxBreakdown result={result} />
      </div>
    </div>
  );
}