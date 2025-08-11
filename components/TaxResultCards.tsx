'use client';

import React from 'react';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';
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
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Net Income</p>
            <p className="text-2xl font-bold text-green-700 break-after-all break-all">
              {formatCurrency(netIncome)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
        </div>
      </div>
      
      {/* Total Tax Card */}
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium">Total Tax</p>
            <p className="text-2xl font-bold text-red-700 break-after-all break-all">
              {formatCurrency(totalTax)}
            </p>
          </div>
          <Calculator className="w-8 h-8 text-red-600 opacity-50" />
        </div>
      </div>
      
      {/* Effective Rate Card */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Effective Rate</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatPercentage(effectiveRate)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
        </div>
      </div>
    </div>
  );
}