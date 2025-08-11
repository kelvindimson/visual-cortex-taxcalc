'use client';

import React from 'react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface TaxBreakdownProps {
  result: TaxCalculationResult;
}

export function TaxBreakdown({ result }: TaxBreakdownProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Tax Breakdown</h3>
      <div className="space-y-2">
        {/* Income */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxable Income</span>
          <span className="font-medium">{formatCurrency(result.income)}</span>
        </div>
        

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Tax</span>
          <span className="font-medium">{formatCurrency(result.baseTax)}</span>
        </div>
        

        {result.medicareLevy > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Medicare Levy (2%)</span>
            <span className="font-medium">{formatCurrency(result.medicareLevy)}</span>
          </div>
        )}
        
        <div className="pt-2 mt-2 border-t border-gray-300">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900 break-after-all break-all">
              Total Tax Payable
            </span>
            <span className="font-bold text-lg text-red-700">
              {formatCurrency(result.totalTax)}
            </span>
          </div>
        </div>
        
        {/* Take Home Pay */}
        <div className="pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Take Home Pay</span>
            <span className="font-bold text-lg text-green-700 break-after-all break-all">
              {formatCurrency(result.netIncome)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600 text-center" >
        <p>
          Marginal Tax Rate:{' '}
          <span className="font-medium text-gray-900">
            {formatPercentage(result.marginalRate)}
          </span>
        </p>
        <p className="mt-2 text-xs">
          This is an estimate only. Please consult the ATO or a tax professional for accurate calculations.
        </p>
      </div>
    </div>
  );
}