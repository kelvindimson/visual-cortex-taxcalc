export declare global {
/**
 * Type definitions for Australian Tax Calculator
 * Ensures type safety across the application
 */

/**
 * Supported tax years in the calculator
 */
export type TaxYear = '2022-23' | '2023-24' | '2024-25' | '2025-26';

/**
 * Residency status options for tax calculation
 */
export type ResidencyStatus = 
  | 'resident' 
  | 'non-resident' 
  | 'part-year';

/**
 * Tax bracket structure
 */
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  base: number;
}

/**
 * Medicare Levy rates and thresholds
 */
export interface MedicareLevyConfig {
  rate: number;
  threshold: {
    single: number;
    family: number;
  };
  reduction: {
    single: {
      lower: number;
      upper: number;
    };
    family: {
      lower: number;
      upper: number;
    };
  };
}

/**
 * Complete tax configuration for a specific year
 */
export interface TaxYearConfig {
  year: TaxYear;
  taxFreeThreshold: number;
  brackets: {
    resident: TaxBracket[];
    nonResident: TaxBracket[];
  };
  medicareLevy: MedicareLevyConfig;
}

/**
 * Tax calculation input parameters
 */
export interface TaxCalculationInput {
  income: number;
  taxYear: TaxYear;
  residencyStatus: ResidencyStatus;
  includesMedicareLevy?: boolean;
  residentMonths?: number; // For part-year residents (1-11 months)
}

/**
 * Detailed tax calculation result
 */
export interface TaxCalculationResult {
  income: number;
  taxableIncome: number;
  baseTax: number;
  medicareLevy: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: TaxBreakdownItem[];
}

/**
 * Individual tax breakdown item for transparency
 */
export interface TaxBreakdownItem {
  description: string;
  amount: number;
  rate?: number;
  bracketRange?: string;
}

/**
 * Form field error state
 */
export interface FieldError {
  field: keyof TaxCalculationInput;
  message: string;
}

/**
 * Calculator form state
 */
export interface CalculatorFormState {
  values: TaxCalculationInput;
  errors: FieldError[];
  isCalculating: boolean;
  result: TaxCalculationResult | null;
}
}