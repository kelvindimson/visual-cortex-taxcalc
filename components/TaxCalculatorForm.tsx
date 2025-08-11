'use client';

import React from 'react';
import { ChevronDown, HelpCircle, AlertCircle } from 'lucide-react';
import { TAX_YEARS, RESIDENCY_OPTIONS } from '@/constants';
import { formatTaxYear, cn } from '@/lib/utils';

interface Props {
  formData: TaxCalculationInput;
  incomeInput: string;
  errors: FieldError[];
  onIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncomeBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFieldUpdate: <K extends keyof TaxCalculationInput>(
    field: K,
    value: TaxCalculationInput[K]
  ) => void;
  getFieldError: (field: keyof TaxCalculationInput) => string | undefined;
}

export function TaxCalculatorForm({ formData, incomeInput, onIncomeChange, onIncomeBlur, onKeyPress, onFieldUpdate, getFieldError} : Props) {
  return (
    <div className="p-6 space-y-6">
      <p className="text-sm text-gray-600">All fields marked with * are mandatory</p>

      {/* Tax Year Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select an income year *
        </label>
        <div className="relative">
          <select
            value={formData.taxYear}
            onChange={(e) => onFieldUpdate('taxYear', e.target.value as TaxYear)}
            className={cn(
              "w-full px-4 py-3 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring focus:ring-blue-500",
              getFieldError('taxYear') ? 'border-red-500' : 'border-gray-300'
            )}
          >
            {TAX_YEARS.map(year => (
              <option key={year} value={year}>
                {formatTaxYear(year)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {getFieldError('taxYear') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('taxYear')}</p>
        )}
      </div>

      {/* Income Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your total{' '}
          <span className="text-blue-500 cursor-help" title="Your total taxable income before deductions">
            taxable income
          </span>
          {' '}for the full income year *
        </label>
        <div className="flex items-stretch">
          <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={incomeInput}
            onChange={onIncomeChange}
            onBlur={onIncomeBlur}
            onKeyPress={onKeyPress}
            placeholder="0.00"
            className={cn(
              "flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring focus:ring-blue-500",
              getFieldError('income') ? 'border-red-500' : 'border-gray-300'
            )}
          />
        </div>
        {getFieldError('income') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {getFieldError('income')}
          </p>
        )}
      </div>

      {/* Residency Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select your residency status *
        </label>
        <div className="space-y-3">
          {RESIDENCY_OPTIONS.map(option => (
            <label
              key={option.value}
              className={cn(
                "flex items-start p-4 border rounded-lg cursor-pointer transition-colors",
                formData.residencyStatus === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              )}
            >
              <input
                type="radio"
                name="residency"
                value={option.value}
                checked={formData.residencyStatus === option.value}
                onChange={(e) => onFieldUpdate('residencyStatus', e.target.value as ResidencyStatus)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </div>
            </label>
          ))}
        </div>
        
        {/* Part-year resident months selector */}
        {formData.residencyStatus === 'part-year' && (
          <div className="mt-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many months were you an Australian resident? *
            </label>
            <div className="relative">
              <select
                value={formData.residentMonths || 6}
                onChange={(e) => onFieldUpdate('residentMonths', parseInt(e.target.value))}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-blue-500 bg-white"
              >
                {[...Array(11)].map((_, i) => {
                  const months = i + 1;
                  return (
                    <option key={months} value={months}>
                      {months} {months === 1 ? 'month' : 'months'}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
            </div>
            <p className="text-xs text-amber-700 my-4">
              The remaining {12 - (formData.residentMonths || 6)} month{12 - (formData.residentMonths || 6) !== 1 ? 's' : ''} will be calculated as non-resident
            </p>
          </div>
        )}
        
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-900 flex flex-col md:flex-row items-start gap-2">
            <div className='flex items-center'>
              <HelpCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              For more details on residency status refer to{' '}
            </div>
            <a 
              href="https://www.ato.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline font-medium hover:text-blue-900"
            >
              Work out your residency status for tax purposes
            </a>
          </div>
        </div>
      </div>

      {/* Medicare Levy Option (only for residents) */}
      {formData.residencyStatus === 'resident' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="medicareLevy"
            checked={formData.includesMedicareLevy ? formData.includesMedicareLevy : false}
            onChange={(e) => onFieldUpdate('includesMedicareLevy', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="medicareLevy" className="text-sm text-gray-700">
            Include Medicare Levy (2%)
          </label>
        </div>
      )}
    </div>
  );
}