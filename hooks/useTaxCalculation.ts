import { useState, useCallback } from 'react';
import { calculateTax, calculatePartYearTax } from '@/lib/taxCalculator';
import { validateTaxInput, validateField } from '@/models/taxCalculatorSchema';
import { DEFAULT_VALUES } from '@/constants';

interface UseTaxCalculationReturn {
  // State
  formData: TaxCalculationInput;
  result: TaxCalculationResult | null;
  errors: FieldError[];
  isCalculating: boolean;
  hasCalculated: boolean;
  
  // Actions
  updateField: <K extends keyof TaxCalculationInput>(
    field: K,
    value: TaxCalculationInput[K]
  ) => void;
  calculate: () => void;
  reset: () => void;
  clearErrors: () => void;
  
  // Validation
  validateSingleField: <K extends keyof TaxCalculationInput>(
    field: K,
    value: TaxCalculationInput[K]
  ) => string | null;
}

export function useTaxCalculation(): UseTaxCalculationReturn {
  // State management
  const [formData, setFormData] = useState<TaxCalculationInput>(DEFAULT_VALUES);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);


  //Validate a single field
  const validateSingleField = useCallback(
    <K extends keyof TaxCalculationInput>(
      field: K,
      value: TaxCalculationInput[K]
    ): string | null => {
      const validation = validateField(field, value);
      return validation.valid ? null : validation.error;
    },
    []
  );

  // Update a field in the form data
  const updateField = useCallback(
    <K extends keyof TaxCalculationInput>(
      field: K,
      value: TaxCalculationInput[K]
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Clear field error if it exists
      setErrors(prev => prev.filter(e => e.field !== field));

      // Clear result if income changed significantly
      if (field === 'income' && hasCalculated) {
        const incomeChanged = Math.abs((value as number) - formData.income) > 0.01;
        if (incomeChanged) {
          setResult(null);
          setHasCalculated(false);
        }
      }
    },
    [formData.income, hasCalculated]
  );

  // Calculate tax based on current form data
  const calculate = useCallback(() => {
    // Validate input
    const validation = validateTaxInput(formData);
    
    if (!validation.success) {
      setErrors((validation.errors || []) as FieldError[]);
      return;
    }

    setIsCalculating(true);
    setErrors([]);

    // Simulate async calculation (in production, this might be an API call)
    setTimeout(() => {
      try {
        let calculationResult: TaxCalculationResult;
        
        if (formData.residencyStatus === 'part-year') {
          // Calculate days based on months
          const daysInYear = 365;
          const monthsAsResident = formData.residentMonths || 6;
          const residentDays = Math.round((monthsAsResident / 12) * daysInYear);
          calculationResult = calculatePartYearTax(formData, residentDays);
        } else {
          calculationResult = calculateTax(formData);
        }
        
        setResult(calculationResult);
        setHasCalculated(true);
      } catch (error) {
        setErrors([{
          field: 'income',
          message: error instanceof Error ? error.message : 'Calculation failed'
        }]);
      } finally {
        setIsCalculating(false);
      }
    }, 300); // Small delay for better UX
  }, [formData]);

  // Handle resett 
  const reset = useCallback(() => {
    setFormData(DEFAULT_VALUES);
    setResult(null);
    setErrors([]);
    setIsCalculating(false);
    setHasCalculated(false);
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    // State
    formData,
    result,
    errors,
    isCalculating,
    hasCalculated,
    
    // Actions
    updateField,
    calculate,
    reset,
    clearErrors,
    
    // Validation
    validateSingleField
  };
}