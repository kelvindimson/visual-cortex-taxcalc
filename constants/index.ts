/**
 * Australian Tax Rates and Configurations
 * Source: Australian Taxation Office (ATO)
 * Last Updated: 2025
 */

/**
 * Tax configurations for each financial year
 */
export const TAX_CONFIGS: Record<TaxYear, TaxYearConfig> = {
  '2022-23': {
    year: '2022-23',
    taxFreeThreshold: 18200,
    brackets: {
      resident: [
        { min: 0, max: 18200, rate: 0, base: 0 },
        { min: 18201, max: 45000, rate: 0.19, base: 0 },
        { min: 45001, max: 120000, rate: 0.325, base: 5092 },
        { min: 120001, max: 180000, rate: 0.37, base: 29467 },
        { min: 180001, max: null, rate: 0.45, base: 51667 }
      ],
      nonResident: [
        { min: 0, max: 120000, rate: 0.325, base: 0 },
        { min: 120001, max: 180000, rate: 0.37, base: 39000 },
        { min: 180001, max: null, rate: 0.45, base: 61200 }
      ]
    },
    medicareLevy: {
      rate: 0.02,
      threshold: {
        single: 23365,
        family: 39402
      },
      reduction: {
        single: {
          lower: 23365,
          upper: 29207
        },
        family: {
          lower: 39402,
          upper: 49252
        }
      }
    }
  },
  '2023-24': {
    year: '2023-24',
    taxFreeThreshold: 18200,
    brackets: {
      resident: [
        { min: 0, max: 18200, rate: 0, base: 0 },
        { min: 18201, max: 45000, rate: 0.19, base: 0 },
        { min: 45001, max: 120000, rate: 0.325, base: 5092 },
        { min: 120001, max: 180000, rate: 0.37, base: 29467 },
        { min: 180001, max: null, rate: 0.45, base: 51667 }
      ],
      nonResident: [
        { min: 0, max: 120000, rate: 0.325, base: 0 },
        { min: 120001, max: 180000, rate: 0.37, base: 39000 },
        { min: 180001, max: null, rate: 0.45, base: 61200 }
      ]
    },
    medicareLevy: {
      rate: 0.02,
      threshold: {
        single: 24276,
        family: 40939
      },
      reduction: {
        single: {
          lower: 24276,
          upper: 30345
        },
        family: {
          lower: 40939,
          upper: 51174
        }
      }
    }
  },
  '2024-25': {
    year: '2024-25',
    taxFreeThreshold: 18200,
    brackets: {
      resident: [
        { min: 0, max: 18200, rate: 0, base: 0 },
        { min: 18201, max: 45000, rate: 0.16, base: 0 },
        { min: 45001, max: 135000, rate: 0.30, base: 4288 },
        { min: 135001, max: 190000, rate: 0.37, base: 31288 },
        { min: 190001, max: null, rate: 0.45, base: 51638 }
      ],
      nonResident: [
        { min: 0, max: 135000, rate: 0.30, base: 0 },
        { min: 135001, max: 190000, rate: 0.37, base: 40500 },
        { min: 190001, max: null, rate: 0.45, base: 60850 }
      ]
    },
    medicareLevy: {
      rate: 0.02,
      threshold: {
        single: 26000,
        family: 43846
      },
      reduction: {
        single: {
          lower: 26000,
          upper: 32500
        },
        family: {
          lower: 43846,
          upper: 54807
        }
      }
    }
  },
  '2025-26': {
    year: '2025-26',
    taxFreeThreshold: 18200,
    brackets: {
      resident: [
        { min: 0, max: 18200, rate: 0, base: 0 },
        { min: 18201, max: 45000, rate: 0.16, base: 0 },
        { min: 45001, max: 135000, rate: 0.30, base: 4288 },
        { min: 135001, max: 190000, rate: 0.37, base: 31288 },
        { min: 190001, max: null, rate: 0.45, base: 51638 }
      ],
      nonResident: [
        { min: 0, max: 135000, rate: 0.30, base: 0 },
        { min: 135001, max: 190000, rate: 0.37, base: 40500 },
        { min: 190001, max: null, rate: 0.45, base: 60850 }
      ]
    },
    medicareLevy: {
      rate: 0.02,
      threshold: {
        single: 26000,
        family: 43846
      },
      reduction: {
        single: {
          lower: 26000,
          upper: 32500
        },
        family: {
          lower: 43846,
          upper: 54807
        }
      }
    }
  }
};

/**
 * Available tax years for selection
 */
export const TAX_YEARS: TaxYear[] = ['2022-23', '2023-24', '2024-25', '2025-26'];

/**
 * Residency status options
 */
export const RESIDENCY_OPTIONS: Array<{
  value: ResidencyStatus;
  label: string;
  description: string;
}> = [
  {
    value: 'resident',
    label: 'Resident for full year',
    description: 'Australian resident for tax purposes for the entire financial year'
  },
  {
    value: 'non-resident',
    label: 'Non-resident for full year',
    description: 'Foreign resident for tax purposes for the entire financial year'
  },
  {
    value: 'part-year',
    label: 'Part-year resident',
    description: 'Changed residency status during the financial year'
  }
];

/**
 * Currency formatting options
 */
export const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

/**
 * Percentage formatting options
 */
export const PERCENTAGE_FORMAT: Intl.NumberFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

/**
 * Input validation limits
 */
export const VALIDATION_LIMITS = {
  MIN_INCOME: 0.01,
  MAX_INCOME: 9999999999,
  DECIMAL_PLACES: 2
};

/**
 * Default form values
 */
export const DEFAULT_VALUES = {
  income: 0,
  taxYear: '2024-25' as TaxYear,
  residencyStatus: 'resident' as ResidencyStatus,
  includesMedicareLevy: true,
  residentMonths: 6
};

export const DAYS_IN_YEAR = 365;
export const NUMBER_OF_MONTHS = 12;