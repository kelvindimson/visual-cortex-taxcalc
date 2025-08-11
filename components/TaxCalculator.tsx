'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Calculator } from 'lucide-react';
import { useTaxCalculation } from '@/hooks/useTaxCalculation';
import { VALIDATION_LIMITS } from '@/constants';
import { parseCurrency, cn } from '@/lib/utils';
import { TaxCalculatorForm } from './TaxCalculatorForm';
import { TaxResultsSection } from './TaxResultsSection';
import toast from 'react-hot-toast';


export function TaxCalculator() {

  const { formData, result, errors, isCalculating, hasCalculated, updateField, calculate, reset, validateSingleField } = useTaxCalculation();

  // Local state for input formatting
  const [incomeInput, setIncomeInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Initialize income input
  useEffect(() => {
    if (formData.income === 0 && incomeInput === '') {
      setIncomeInput('');
    } else if (incomeInput === '' && formData.income > 0) {
      setIncomeInput(formData.income.toString());
    }
  }, [formData.income, incomeInput]);


  // Handle income input change with validation and formatting
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string for deletion
    if (value === '') {
      setIncomeInput('');
      updateField('income', 0);
      return;
    }
    
    // Allow only numbers, decimal point, and handle edge cases
    const sanitized = value
      .replace(/[^0-9.]/g, '') // Remove non-numeric characters except decimal
      .replace(/^\./, '0.') // Add leading zero if starts with decimal
      .replace(/\.{2,}/g, '.') // Replace multiple decimals with single
      .replace(/(\.\d{2})\d+/g, '$1'); // Limit to 2 decimal places
    
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const formatted = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}` 
      : sanitized;
    
    setIncomeInput(formatted);
    
    // Parse and validate the numeric value
    const numericValue = parseCurrency(formatted);
    
    // Check bounds and show toast if needed
    if (formatted && numericValue < VALIDATION_LIMITS.MIN_INCOME) {

      toast.error(`Minimum income is $${VALIDATION_LIMITS.MIN_INCOME}`, {
        id: 'validation-min-error',
      });

    } else if (numericValue > VALIDATION_LIMITS.MAX_INCOME) {

      toast.error(`Maximum income is $${(VALIDATION_LIMITS.MAX_INCOME / 1000000000).toFixed(0)} billion`, {
        id: 'validation-max-error',
      });

      // Cap the value at max
      const maxFormatted = VALIDATION_LIMITS.MAX_INCOME.toString();
      setIncomeInput(maxFormatted);
      updateField('income', VALIDATION_LIMITS.MAX_INCOME);
      return;
    }
    
    const error = validateSingleField('income', numericValue);
    
    if (!error) {
      updateField('income', numericValue);
    }
  };


  // Handle income input, validate and format
  const handleIncomeBlur = () => {
    const numericValue = parseCurrency(incomeInput);

      // Allow empty field on blur
    if (incomeInput === '') {
      updateField('income', 0);
      return;
    }
    
    if (incomeInput && numericValue < VALIDATION_LIMITS.MIN_INCOME) {
      setIncomeInput('');
      updateField('income', 0);
      toast.error(`Income must be at least $${VALIDATION_LIMITS.MIN_INCOME}`, {
        id : 'income-error',
      });
    } else if (numericValue > 0) {
      setIncomeInput(numericValue.toFixed(2));
    }
  };

  // Handle key press to restrict input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    const currentValue = incomeInput;
    
    // Allow numbers and one decimal point
    if (!/[0-9.]/.test(char)) {
      e.preventDefault();
      return;
    }
    
    // Prevent multiple decimal points
    if (char === '.' && currentValue.includes('.')) {
      e.preventDefault();
      return;
    }
    
    // Prevent more than 2 decimal places
    if (currentValue.includes('.')) {
      const decimalPart = currentValue.split('.')[1];
      if (decimalPart && decimalPart.length >= 2 && e.currentTarget.selectionStart! > currentValue.indexOf('.')) {
        e.preventDefault();
        return;
      }
    }
  };

  // Reset form and clear input
  const handleReset = () => {
    setIncomeInput(''); // Clear the input field
    reset(); // Reset the form data
  };

  // Get error message for a specific field
  const getFieldError = (field: keyof typeof formData): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  return (
    <div className="bg-white/80 rounded-xl backdrop-blur-sm animate-fade-up animate-duration-500 animate-ease-in-out ">
      {/* Header */}
      <div className=" px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visual Cortex Tax Calculator

        </h1>
          <button onClick={() => setShowHelp(!showHelp)} className="inline-flex items-center text-blue-500 hover:text-blue-900 text-sm">
            <HelpCircle className="w-4 h-4 mr-1" /> Help
        </button>
      </div>
      <hr className="border-gray-200 w-1/2 mx-auto" />

      {/* Help Section */}
      {showHelp && (
        <div className="bg-blue-50 p-4 mx-6 mt-4 rounded-md animate-fade-up animate-duration-500 animate-ease-in-out">
          <p className="text-sm text-blue-900">
            This calculator provides an estimate of your Australian income tax based on current ATO rates. 
            It includes the tax-free threshold, marginal tax rates, and Medicare Levy for residents.
          </p>
        </div>
      )}

      {/* Form Section - Using the new component */}
      <TaxCalculatorForm
        formData={formData}
        incomeInput={incomeInput}
        errors={errors}
        onIncomeChange={handleIncomeChange}
        onIncomeBlur={handleIncomeBlur}
        onKeyDown={handleKeyPress}
        onFieldUpdate={updateField}
        getFieldError={getFieldError}
      />

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-4">
          <button
            onClick={calculate}
            disabled={isCalculating || formData.income < VALIDATION_LIMITS.MIN_INCOME}
            className={cn(
              "flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center",
              isCalculating || formData.income < VALIDATION_LIMITS.MIN_INCOME
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax
              </>
            )}
          </button>
          {hasCalculated && (
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Section - Using the new component */}
      <TaxResultsSection result={result} />
    </div>
  );
}