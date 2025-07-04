/**
 * Calculator Service
 * Provides mathematical operations for the calculator agent
 */
export class CalculatorService {
  /**
   * Add two numbers
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Subtract second number from first number
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiply two numbers
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Divide first number by second number
   * @throws Error if attempting to divide by zero
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  /**
   * Calculate power (base^exponent)
   */
  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  /**
   * Calculate square root
   * @throws Error if number is negative
   */
  sqrt(number: number): number {
    if (number < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(number);
  }

  /**
   * Calculate percentage of a number
   */
  percentage(percentage: number, of: number): number {
    return (percentage / 100) * of;
  }

  /**
   * Calculate factorial
   * @throws Error if number is negative or not an integer
   */
  factorial(number: number): number {
    if (number < 0) {
      throw new Error('Factorial is only defined for non-negative numbers');
    }
    
    if (!Number.isInteger(number)) {
      throw new Error('Factorial is only defined for integers');
    }

    if (number > 170) {
      throw new Error('Factorial too large - JavaScript number overflow (max: 170)');
    }

    if (number === 0 || number === 1) {
      return 1;
    }

    let result = 1;
    for (let i = 2; i <= number; i++) {
      result *= i;
    }
    return result;
  }

  /**
   * Count occurrences of a character in text
   * @throws Error if character is not a single character
   */
  countCharacter(character: string, text: string): number {
    if (character.length !== 1) {
      throw new Error('Character parameter must be exactly one character');
    }

    let count = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === character) {
        count++;
      }
    }
    return count;
  }
} 