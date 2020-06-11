import {
    calculateAge, calculateImprovementValue,
    calculateMaterialExpense, calculateNumberOfHours, calculateTotalExpense
} from '../utilities/HelperFunctions';

describe('Calculation functions', () => {
    test('calculateNumberOfHours()', () => {
        const result = calculateNumberOfHours(10, 10);
        expect(result).toBe(100)
    })
    test('calculateAge()', () => {
        const result = calculateAge(10, 10);
        expect(result).toBe(2009)
    })
    test('calculateMaterialExpense()', () => {
        const result = calculateMaterialExpense(10, 10);
        expect(result).toBe(100)
    })
    test('calculateTotalExpense()', () => {
        const result = calculateTotalExpense(10, 10, 10);
        expect(result).toBe(110)
    })
    test('calculateImprovementValue()', () => {
        const result = calculateImprovementValue(150, 10);
        expect(result).toBe(15)
    })
})

