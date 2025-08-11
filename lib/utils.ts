import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY_FORMAT, PERCENTAGE_FORMAT } from '@/constants';

/**
 * Tailwind CSS class merger
 * Combines class names and resolves conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency fucntin
 * @param value The numeric value to format
 * @param options Optional Intl.NumberFormat options to override defaults
 */
export function formatCurrency( value: number,
  options?: Partial<Intl.NumberFormatOptions>
): string {
  return new Intl.NumberFormat('en-AU', {
    ...CURRENCY_FORMAT,
    ...options
  }).format(value);
}

/**
 * Format percentage function
 * @param value - The decimal value to format (0.1 = 10%)
 * @param options - Optional Intl.NumberFormat options to override defaults
 */
export function formatPercentage(
  value: number,
  options?: Partial<Intl.NumberFormatOptions>
): string {
  return new Intl.NumberFormat('en-AU', {
    ...PERCENTAGE_FORMAT,
    ...options
  }).format(value);
}

/**
 * Format number with thousand separators
 * @param value - The numeric value to format
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value);
}

/**
 * Parse currency string to number
 * Handles various formats: $1,234.56, 1234.56, 1,234.56
 * @param value - The string value to parse
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols, spaces, and thousand separators
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Round to specified decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentage of a value
 * @param value - The base value
 * @param percentage - The percentage as a decimal (0.1 = 10%)
 */
export function calculatePercentage(value: number, percentage: number): number {
  return roundToDecimals(value * percentage);
}

/**
 * Clamp a number between min and max values
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: never[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format tax year for display (2024-25 → 2024–25)
 * @param taxYear - The tax year string
 */
export function formatTaxYear(taxYear: string): string {
  return taxYear.replace('-', '–');
}

/**
 * Get financial year dates
 * @param taxYear - The tax year (e.g., '2024-25')
 */
export function getTaxYearDates(taxYear: string): {
  start: Date;
  end: Date;
} {
  const [startYear] = taxYear.split('-');
  const start = new Date(`${startYear}-07-01`);
  const endYear = parseInt(startYear) + 1;
  const end = new Date(`${endYear}-06-30`);
  
  return { start, end };
}

/**
 * Check if a tax year is in the future
 * @param taxYear - The tax year to check
 */
export function isFutureTaxYear(taxYear: string): boolean {
  const { end } = getTaxYearDates(taxYear);
  return end > new Date();
}

/**
 * Get current tax year based on today's date
 */
export function getCurrentTaxYear(): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 0-indexed
  
  // Tax year starts July 1st
  if (currentMonth >= 7) {
    return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  } else {
    return `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
  }
}