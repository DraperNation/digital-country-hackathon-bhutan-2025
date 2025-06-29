import { CalculatorService } from '@/services/calculatorService.js';

describe('CalculatorService', () => {
  let calculatorService: CalculatorService;

  beforeEach(() => {
    calculatorService = new CalculatorService();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculatorService.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(calculatorService.add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(calculatorService.add(5, -3)).toBe(2);
    });

    it('should add zero', () => {
      expect(calculatorService.add(5, 0)).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(calculatorService.add(2.5, 3.7)).toBeCloseTo(6.2);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(calculatorService.subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers', () => {
      expect(calculatorService.subtract(-2, -3)).toBe(1);
    });

    it('should handle subtraction resulting in negative', () => {
      expect(calculatorService.subtract(3, 5)).toBe(-2);
    });

    it('should subtract zero', () => {
      expect(calculatorService.subtract(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(calculatorService.multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(calculatorService.multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(calculatorService.multiply(-3, -4)).toBe(12);
      expect(calculatorService.multiply(-3, 4)).toBe(-12);
    });

    it('should handle decimal multiplication', () => {
      expect(calculatorService.multiply(2.5, 4)).toBeCloseTo(10);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(calculatorService.divide(10, 2)).toBe(5);
    });

    it('should handle decimal division', () => {
      expect(calculatorService.divide(7, 2)).toBe(3.5);
    });

    it('should divide negative numbers', () => {
      expect(calculatorService.divide(-10, -2)).toBe(5);
      expect(calculatorService.divide(-10, 2)).toBe(-5);
    });

    it('should throw error for division by zero', () => {
      expect(() => calculatorService.divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });

  describe('power', () => {
    it('should calculate positive powers', () => {
      expect(calculatorService.power(2, 3)).toBe(8);
      expect(calculatorService.power(5, 2)).toBe(25);
    });

    it('should handle power of zero', () => {
      expect(calculatorService.power(5, 0)).toBe(1);
    });

    it('should handle power of one', () => {
      expect(calculatorService.power(5, 1)).toBe(5);
    });

    it('should handle negative exponents', () => {
      expect(calculatorService.power(2, -2)).toBe(0.25);
    });

    it('should handle base zero', () => {
      expect(calculatorService.power(0, 5)).toBe(0);
    });
  });

  describe('sqrt', () => {
    it('should calculate square root of positive numbers', () => {
      expect(calculatorService.sqrt(9)).toBe(3);
      expect(calculatorService.sqrt(16)).toBe(4);
      expect(calculatorService.sqrt(2)).toBeCloseTo(1.414);
    });

    it('should handle square root of zero', () => {
      expect(calculatorService.sqrt(0)).toBe(0);
    });

    it('should throw error for negative numbers', () => {
      expect(() => calculatorService.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });
  });

  describe('percentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatorService.percentage(20, 100)).toBe(20);
      expect(calculatorService.percentage(50, 200)).toBe(100);
      expect(calculatorService.percentage(25, 80)).toBe(20);
    });

    it('should handle zero percentage', () => {
      expect(calculatorService.percentage(0, 100)).toBe(0);
    });

    it('should handle percentage of zero', () => {
      expect(calculatorService.percentage(50, 0)).toBe(0);
    });

    it('should handle decimal percentages', () => {
      expect(calculatorService.percentage(12.5, 80)).toBe(10);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of positive integers', () => {
      expect(calculatorService.factorial(0)).toBe(1);
      expect(calculatorService.factorial(1)).toBe(1);
      expect(calculatorService.factorial(5)).toBe(120);
      expect(calculatorService.factorial(7)).toBe(5040);
    });

    it('should throw error for negative numbers', () => {
      expect(() => calculatorService.factorial(-1)).toThrow('Factorial is only defined for non-negative numbers');
    });

    it('should throw error for non-integers', () => {
      expect(() => calculatorService.factorial(3.5)).toThrow('Factorial is only defined for integers');
    });

    it('should throw error for very large numbers', () => {
      expect(() => calculatorService.factorial(200)).toThrow('Factorial too large - JavaScript number overflow (max: 170)');
    });
  });
}); 