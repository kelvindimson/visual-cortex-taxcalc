import { z } from 'zod';
import { TAX_YEARS, VALIDATION_LIMITS } from '@/constants';


// Tax year validation
const taxYearSchema = z.enum(
  TAX_YEARS as [TaxYear, ...TaxYear[]],
  {
    message: 'Please select a valid tax year'
  }
);

//Residency status validation
const residencyStatusSchema = z.enum(
  ['resident', 'non-resident', 'part-year'] as [ResidencyStatus, ...ResidencyStatus[]],
  {
    message: 'Please select a valid residency status'
  }
);

// Income validation with business rules
const incomeSchema = z
  .number({
    message: 'Income must be a valid number'
  })
  .min(VALIDATION_LIMITS.MIN_INCOME, {
    message: 'Income cannot be negative'
  })
  .max(VALIDATION_LIMITS.MAX_INCOME, {
    message: `Income cannot exceed $${VALIDATION_LIMITS.MAX_INCOME.toLocaleString()}`
  })
  .refine(
    (val) => {
      // Check if the number has at most 2 decimal places
      const decimalPart = val.toString().split('.')[1];
      return !decimalPart || decimalPart.length <= VALIDATION_LIMITS.DECIMAL_PLACES;
    }, {
      message: `Income can have at most ${VALIDATION_LIMITS.DECIMAL_PLACES} decimal places`
    }
  );


// Main tax calculation input schema
export const taxCalculatorSchema = z.object({
  income: incomeSchema,
  taxYear: taxYearSchema,
  residencyStatus: residencyStatusSchema,
  includesMedicareLevy: z.boolean().optional().default(true),
  residentMonths: z.number()
    .min(1, { message: 'Minimum 1 month required' })
    .max(11, { message: 'Maximum 11 months allowed' })
    .optional()
});

// Type inference from schema
export type TaxCalculatorInput = z.infer<typeof taxCalculatorSchema>;


// Validation helper function
export const validateTaxInput = (data: unknown) => {
  try {
    const validated = taxCalculatorSchema.parse(data);
    return { success: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        data: null, 
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { 
      success: false, 
      data: null, 
      errors: [{ field: 'unknown', message: 'Validation failed' }] 
    };
  }
};


// Partial validation for individual fields
export const validateField = (field: keyof TaxCalculatorInput, value: unknown) => {
  try {
    const fieldSchema = taxCalculatorSchema.shape[field];
    fieldSchema.parse(value);
    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0].message };
    }
    return { valid: false, error: 'Invalid value' };
  }
};