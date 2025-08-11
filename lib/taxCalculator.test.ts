// this disablling is here because we are passing type any in a test so we are disabling eslint for this file
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from '@jest/globals';
import {
  calculateTax,
  calculatePartYearTax,
  isValidIncome,
  getCurrentBracket
} from './taxCalculator';
import { TAX_CONFIGS } from '@/constants';

describe('taxCalculator', () => {
  describe('calculateTax', () => {
    describe('2024-25 Tax Year - Resident', () => {
      it('should calculate zero tax for income below tax-free threshold', () => {
        const result = calculateTax({
          income: 18200,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        expect(result.baseTax).toBe(0);
        expect(result.totalTax).toBe(0);
        expect(result.netIncome).toBe(18200);
        expect(result.effectiveRate).toBe(0);
      });

      it('should calculate tax correctly for $50,000 income', () => {
        const result = calculateTax({
          income: 50000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        // Tax calculation: 
        // $0 on first $18,200
        // 16% on $18,201 to $45,000 = 26,800 * 0.16 = 4,288
        // 30% on $45,001 to $50,000 = 5,000 * 0.30 = 1,500
        // Total = 4,288 + 1,500 = 5,788
        expect(result.baseTax).toBe(5788);
        expect(result.totalTax).toBe(5788);
        expect(result.netIncome).toBe(44212);
      });

      it('should calculate tax correctly for $100,000 income', () => {
        const result = calculateTax({
          income: 100000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        // Using the bracket system with base amounts
        // Income falls in $45,001 - $135,000 bracket
        // Base: 4,288 + (100,000 - 45,000) * 0.30 = 4,288 + 16,500 = 20,788
        expect(result.baseTax).toBe(20788);
        expect(result.totalTax).toBe(20788);
        expect(result.marginalRate).toBe(0.30);
      });

      it('should include Medicare Levy when specified', () => {
        const result = calculateTax({
          income: 50000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: true
        });

        expect(result.medicareLevy).toBe(1000);
        expect(result.totalTax).toBe(5788 + 1000);
        expect(result.netIncome).toBe(50000 - 6788);
      });

      it('should not apply Medicare Levy below threshold', () => {
        const result = calculateTax({
          income: 25000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: true
        });

        // Income below Medicare Levy threshold ($26,000 for 2024-25)
        expect(result.medicareLevy).toBe(0);
      });

      it('should apply reduced Medicare Levy in reduction zone', () => {
        const result = calculateTax({
          income: 28000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: true
        });

        // In reduction zone: $26,000 - $32,500
        // Reduced levy = (28,000 - 26,000) * 0.1 = 200
        expect(result.medicareLevy).toBe(200);
      });

      it('should calculate tax for high income earner', () => {
        const result = calculateTax({
          income: 200000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: true
        });

        // Income in highest bracket (over $190,000)
        // Base: 51,638 + (200,000 - 190,000) * 0.45 = 51,638 + 4,500 = 56,138
        expect(result.baseTax).toBe(56138);
        expect(result.medicareLevy).toBe(4000); // 2% of 200,000
        expect(result.totalTax).toBe(60138);
        expect(result.marginalRate).toBe(0.45);
      });
    });

    describe('2024-25 Tax Year - Non-Resident', () => {
      it('should calculate tax from first dollar for non-residents', () => {
        const result = calculateTax({
          income: 10000,
          taxYear: '2024-25',
          residencyStatus: 'non-resident'
        });

        // Non-residents: 30% from first dollar
        expect(Math.round(result.baseTax)).toBe(3000);
        expect(result.totalTax).toBeCloseTo(3000, 0);
        expect(result.medicareLevy).toBe(0); // No Medicare Levy for non-residents
      });

      it('should calculate tax correctly for non-resident with $150,000 income', () => {
        const result = calculateTax({
          income: 150000,
          taxYear: '2024-25',
          residencyStatus: 'non-resident'
        });

        // $135,001 - $190,000: 37% with base of 40,500
        // Base: 40,500 + (150,000 - 135,000) * 0.37 = 40,500 + 5,550 = 46,050
        expect(result.baseTax).toBe(46050);
        expect(result.totalTax).toBe(46050);
        expect(result.marginalRate).toBe(0.37);
      });
    });

    describe('2023-24 Tax Year (pre-Stage 3)', () => {
      it('should calculate tax correctly for $50,000 income in 2023-24', () => {
        const result = calculateTax({
          income: 50000,
          taxYear: '2023-24',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        // 2023-24 rates (before Stage 3 cuts)
        // $0 on first $18,200
        // 19% on $18,201 to $45,000 = 26,800 * 0.19 = 5,092
        // 32.5% on $45,001 to $50,000 = 5,000 * 0.325 = 1,625
        // Total = 5,092 + 1,625 = 6,717
        expect(result.baseTax).toBe(6717);
        expect(result.totalTax).toBe(6717);
      });

      it('should show Stage 3 tax cuts difference', () => {
        const income = 100000;
        
        const result2023 = calculateTax({
          income,
          taxYear: '2023-24',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        const result2024 = calculateTax({
          income,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: false
        });

        // Stage 3 cuts should reduce tax
        expect(result2024.totalTax).toBeLessThan(result2023.totalTax);
        
        // 2023-24: Base 5,092 + (100,000 - 45,000) * 0.325 = 5,092 + 17,875 = 22,967
        expect(result2023.baseTax).toBe(22967);
        
        // 2024-25: Base 4,288 + (100,000 - 45,000) * 0.30 = 4,288 + 16,500 = 20,788
        expect(result2024.baseTax).toBe(20788);
        
        // Tax savings from Stage 3
        expect(result2023.baseTax - result2024.baseTax).toBe(2179);
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero income', () => {
        const result = calculateTax({
          income: 0,
          taxYear: '2024-25',
          residencyStatus: 'resident'
        });

        expect(result.totalTax).toBe(0);
        expect(result.netIncome).toBe(0);
        expect(result.effectiveRate).toBe(0);
      });

      it('should handle very high income', () => {
        const result = calculateTax({
          income: 1000000,
          taxYear: '2024-25',
          residencyStatus: 'resident',
          includesMedicareLevy: true
        });

        // Should be in highest bracket
        expect(result.marginalRate).toBe(0.45);
        expect(result.medicareLevy).toBe(20000); // 2% of 1M
        
        // Base: 51,638 + (1,000,000 - 190,000) * 0.45 = 51,638 + 364,500 = 416,138
        expect(result.baseTax).toBe(416138);
        expect(result.totalTax).toBe(436138); // Including Medicare Levy
      });

      it('should throw error for invalid tax year', () => {
        expect(() => {
          calculateTax({
            income: 50000,
            taxYear: '2020-21' as any,
            residencyStatus: 'resident'
          });
        }).toThrow('Tax configuration not found for year 2020-21');
      });
    });
  });

  describe('calculatePartYearTax', () => {
    it('should calculate tax for 6 months resident, 6 months non-resident', () => {
      const result = calculatePartYearTax(
        {
          income: 100000,
          taxYear: '2024-25',
          residencyStatus: 'part-year'
        },
        183 // Half year
      );

      expect(result.income).toBe(100000);
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0].description).toContain('6 month');
      expect(result.breakdown[1].description).toContain('6 month');
      
      // Should be less than full non-resident but more than full resident
      const fullResident = calculateTax({
        income: 100000,
        taxYear: '2024-25',
        residencyStatus: 'resident'
      });
      
      const fullNonResident = calculateTax({
        income: 100000,
        taxYear: '2024-25',
        residencyStatus: 'non-resident'
      });

      expect(result.totalTax).toBeGreaterThan(fullResident.totalTax);
      expect(result.totalTax).toBeLessThan(fullNonResident.totalTax);
    });

    it('should calculate tax for 3 months resident, 9 months non-resident', () => {
      const residentDays = Math.round((3 / 12) * 365); // ~91 days
      
      const result = calculatePartYearTax(
        {
          income: 60000,
          taxYear: '2024-25',
          residencyStatus: 'part-year'
        },
        residentDays
      );

      expect(result.breakdown[0].description).toContain('3 month');
      expect(result.breakdown[1].description).toContain('9 month');
    });

    it('should handle 11 months resident', () => {
      const residentDays = Math.round((11 / 12) * 365); // ~335 days
      
      const result = calculatePartYearTax(
        {
          income: 80000,
          taxYear: '2024-25',
          residencyStatus: 'part-year'
        },
        residentDays
      );

      expect(result.breakdown[0].description).toContain('11 month');
      expect(result.breakdown[1].description).toContain('1 month');
      
      // Should be very close to full resident tax
      const fullResident = calculateTax({
        income: 80000,
        taxYear: '2024-25',
        residencyStatus: 'resident'
      });

      const difference = Math.abs(result.totalTax - fullResident.totalTax);
      expect(difference).toBeLessThan(fullResident.totalTax * 0.1); // Within 10%
    });
  });

  describe('isValidIncome', () => {
    it('should return true for valid incomes', () => {
      expect(isValidIncome(0)).toBe(true);
      expect(isValidIncome(50000)).toBe(true);
      expect(isValidIncome(100000.50)).toBe(true);
      expect(isValidIncome(999999999)).toBe(true);
    });

    it('should return false for invalid incomes', () => {
      expect(isValidIncome(-1)).toBe(false);
      expect(isValidIncome(1000000000)).toBe(false);
      expect(isValidIncome(NaN)).toBe(false);
      expect(isValidIncome(Infinity)).toBe(false);
    });
  });

  describe('getCurrentBracket', () => {
    const brackets = TAX_CONFIGS['2024-25'].brackets.resident;

    it('should return correct bracket for various incomes', () => {
      const bracket1 = getCurrentBracket(10000, brackets);
      expect(bracket1?.min).toBe(0);
      expect(bracket1?.max).toBe(18200);

      const bracket2 = getCurrentBracket(30000, brackets);
      expect(bracket2?.min).toBe(18201);
      expect(bracket2?.max).toBe(45000);

      const bracket3 = getCurrentBracket(100000, brackets);
      expect(bracket3?.min).toBe(45001);
      expect(bracket3?.max).toBe(135000);

      const bracket4 = getCurrentBracket(200000, brackets);
      expect(bracket4?.min).toBe(190001);
      expect(bracket4?.max).toBe(null);
    });

    it('should return null for negative income', () => {
      const bracket = getCurrentBracket(-1000, brackets);
      expect(bracket).toBe(null);
    });
  });
});