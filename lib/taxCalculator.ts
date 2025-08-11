import { NUMBER_OF_MONTHS, TAX_CONFIGS, VALIDATION_LIMITS } from '@/constants';
import { roundToDecimals } from '@/lib/utils';
import { DAYS_IN_YEAR } from '@/constants';
/**
 * Calculate base tax based on income and brackets
 * @param income - Taxable income
 * @param brackets - Tax brackets for the year and residency status
 */
function calculateBaseTax(income: number, brackets: TaxBracket[]): { tax: number; marginalRate: number; breakdown: TaxBreakdownItem[] } {
  let tax = 0;
  let marginalRate = 0;
  const breakdown: TaxBreakdownItem[] = [];

  for (const bracket of brackets) {
    if (income <= bracket.min) {
      continue;
    }

    const taxableInBracket = bracket.max 
      ? Math.min(income, bracket.max) - bracket.min + 1
      : income - bracket.min + 1;

    if (taxableInBracket > 0) {
      if (bracket.rate > 0) {
        // Use the base tax amount for this bracket
        if (income > (bracket.max || income)) {
          // If income exceeds this bracket, use the base tax
          tax = bracket.base + (bracket.max! - bracket.min + 1) * bracket.rate;
        } else {
          // Calculate tax for income within this bracket
          tax = bracket.base + (income - bracket.min + 1) * bracket.rate;
          marginalRate = bracket.rate;
        }
      }
    }

    // Set marginal rate if income falls in this bracket
    if (!bracket.max || income <= bracket.max) {
      marginalRate = bracket.rate;
      
      // Add breakdown for this bracket
      if (bracket.rate > 0) {
        const rangeDescription = bracket.max 
          ? `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`
          : `Over $${bracket.min.toLocaleString()}`;
        
        breakdown.push({
          description: `Tax on income ${rangeDescription}`,
          amount: tax - bracket.base,
          rate: bracket.rate,
          bracketRange: rangeDescription
        });
      }
      
      break;
    }
  }

  return { tax: roundToDecimals(tax), marginalRate, breakdown };
}

/**
 * Calculate Medicare Levy based on income and thresholds
 * @param income - Taxable income
 * @param config - Medicare Levy configuration
 */
function calculateMedicareLevy( income: number, config: TaxYearConfig['medicareLevy'] ): number {
  // Below threshold - no levy
  if (income <= config.threshold.single) {
    return 0;
  }

  // In reduction zone - reduced levy
  if (income <= config.reduction.single.upper) {
    const reductionRate = 0.1; // 10 cents per dollar over threshold
    const levy = (income - config.threshold.single) * reductionRate;
    return roundToDecimals(Math.min(levy, income * config.rate));
  }

  // Above reduction zone - full levy
  return roundToDecimals(income * config.rate);
}

/**
 * Main tax calculation function
 * @param input - Tax calculation parameters
 */
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const config = TAX_CONFIGS[input.taxYear];
  
  if (!config) {
    throw new Error(`Tax configuration not found for year ${input.taxYear}`);
  }

  // Select appropriate tax brackets based on residency
  const brackets = input.residencyStatus === 'non-resident' 
    ? config.brackets.nonResident 
    : config.brackets.resident;

  // Calculate base tax
  const { tax: baseTax, marginalRate, breakdown: baseTaxBreakdown } = 
    calculateBaseTax(input.income, brackets);

  // Calculate Medicare Levy (only for residents)
  let medicareLevy = 0;
  const medicareLevyBreakdown: TaxBreakdownItem[] = [];

  if (input.residencyStatus === 'resident' && input.includesMedicareLevy !== false) {
    medicareLevy = calculateMedicareLevy(input.income, config.medicareLevy);
    
    if (medicareLevy > 0) {
      medicareLevyBreakdown.push({
        description: 'Medicare Levy',
        amount: medicareLevy,
        rate: config.medicareLevy.rate
      });
    }
  }

  // Calculate totals
  const totalTax = roundToDecimals(baseTax + medicareLevy);
  const netIncome = roundToDecimals(input.income - totalTax);
  const effectiveRate = input.income > 0 ? totalTax / input.income : 0;

  // Compile breakdown
  const breakdown: TaxBreakdownItem[] = [
    ...baseTaxBreakdown,
    ...medicareLevyBreakdown
  ];

  // Add summary items
  if (input.income <= config.taxFreeThreshold && input.residencyStatus === 'resident') {
    breakdown.unshift({
      description: `Tax-free threshold (first $${config.taxFreeThreshold.toLocaleString()})`,
      amount: 0,
      rate: 0
    });
  }

  return {
    income: input.income,
    taxableIncome: input.income,
    baseTax: roundToDecimals(baseTax),
    medicareLevy: roundToDecimals(medicareLevy),
    totalTax,
    netIncome,
    effectiveRate: roundToDecimals(effectiveRate, 4),
    marginalRate: roundToDecimals(marginalRate, 4),
    breakdown
  };
}

/**
 * Calculate tax for part-year residents
 * This is a simplified calculation - actual part-year calculations are complex
 * @param input - Tax calculation parameters
 * @param residentDays - Number of days as resident
 */
export function calculatePartYearTax(input: TaxCalculationInput, residentDays: number): TaxCalculationResult {
  
  const residentPortion = residentDays / DAYS_IN_YEAR;
  const nonResidentPortion = 1 - residentPortion;

  // Calculate as resident
  const residentCalc = calculateTax({
    ...input,
    residencyStatus: 'resident',
    income: input.income * residentPortion
  });

  // Calculate as non-resident
  const nonResidentCalc = calculateTax({
    ...input,
    residencyStatus: 'non-resident',
    income: input.income * nonResidentPortion
  });

  // Combine results (simplified approach)
  const totalTax = residentCalc.totalTax + nonResidentCalc.totalTax;
  const netIncome = input.income - totalTax;
  const effectiveRate = input.income > 0 ? totalTax / input.income : 0;

  // Calculate months from days
  const residentMonths = Math.round((residentDays / DAYS_IN_YEAR) * NUMBER_OF_MONTHS);
  const nonResidentMonths = NUMBER_OF_MONTHS - residentMonths;

  return {
    income: input.income,
    taxableIncome: input.income,
    baseTax: roundToDecimals(residentCalc.baseTax + nonResidentCalc.baseTax),
    medicareLevy: residentCalc.medicareLevy,
    totalTax: roundToDecimals(totalTax),
    netIncome: roundToDecimals(netIncome),
    effectiveRate: roundToDecimals(effectiveRate, 4),
    marginalRate: Math.max(residentCalc.marginalRate, nonResidentCalc.marginalRate),
    breakdown: [
      {
        description: `Resident period (${residentMonths} month${residentMonths !== 1 ? 's' : ''})`,
        amount: residentCalc.totalTax
      },
      {
        description: `Non-resident period (${nonResidentMonths} month${nonResidentMonths !== 1 ? 's' : ''})`,
        amount: nonResidentCalc.totalTax
      }
    ]
  };
}

/**
 * Validate if income is within acceptable range
 * @param income - Income to validate
 */
export function isValidIncome(income: number): boolean {
  return income >= VALIDATION_LIMITS.MIN_INCOME && income <= VALIDATION_LIMITS.MAX_INCOME && Number.isFinite(income);
}

/**
 * Get tax bracket for a given income
 * @param income - Taxable income
 * @param brackets - Tax brackets
 */
export function getCurrentBracket(income: number, brackets: TaxBracket[]): TaxBracket | null {
  for (const bracket of brackets) {
    if (income >= bracket.min && (!bracket.max || income <= bracket.max)) {
      return bracket;
    }
  }
  return null;
}