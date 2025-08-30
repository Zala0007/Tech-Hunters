// utils/analyticsHelpers.js

/**
 * Calculate average of an array of numbers
 * @param {Array<Number>} numbers 
 * @returns {Number|null}
 */
function average(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) return null;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
}

/**
 * Calculate growth rate between two numbers
 * @param {Number} oldValue 
 * @param {Number} newValue 
 * @returns {Number} growth rate as percentage
 */
function growthRate(oldValue, newValue) {
    if (oldValue === 0) return null;
    return ((newValue - oldValue) / oldValue) * 100;
}

module.exports = {
    average,
    growthRate
};
