'use client';

import React from 'react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface TaxResultCardsProps {
  netIncome: number;
  totalTax: number;
  effectiveRate: number;
}

export function TaxResultCards({ netIncome, totalTax, effectiveRate }: TaxResultCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Net Income Card */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-900/50 animate-fade-up animate-duration-500 animate-ease-in-out">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Net Income</p>
            <p className="text-2xl font-bold text-green-900 break-after-all break-all">
              {formatCurrency(netIncome)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Total Tax Card */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-900/50 animate-fade-up animate-duration-500 animate-delay-200 animate-ease-in-out">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium">Total Tax</p>
            <p className="text-2xl font-bold text-red-900 break-after-all break-all">
              {formatCurrency(totalTax)}
            </p>
          </div>

        </div>
      </div>
      
      {/* Effective Rate Card */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-900/50 animate-fade-up animate-duration-500 animate-delay-[400ms] animate-ease-in-out">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-500  font-medium">Effective Rate</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatPercentage(effectiveRate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}