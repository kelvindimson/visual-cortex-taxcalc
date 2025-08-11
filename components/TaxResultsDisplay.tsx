// components/TaxResultsDisplay.tsx

'use client';

import { formatCurrency } from '@/lib/utils';
import type { TaxCalculationResult } from '@/models/taxCalculatorSchema';

interface TaxResultsDisplayProps {
  calculation: TaxCalculationResult;
  income: number;
}

export function TaxResultsDisplay({
  calculation,
  income
}: TaxResultsDisplayProps) {
  if (!income || income <= 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Result
      </h2>

      <p className="text-gray-800">
        The estimated tax on your taxable income is{' '}
        <span className="font-bold text-xl">
          {formatCurrency(calculation.total)}
        </span>
      </p>
    </div>
  );
}