// utils/metricsCalculator.js

/**
 * Calculate key performance metrics from input data
 * For example, calculates sum, average, max, and min values for a given numeric array
 */

function calculateMetrics(data) {
    if (!Array.isArray(data) || data.length === 0) return null;

    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);

    return {
        sum,
        average: avg,
        max,
        min,
        count: data.length,
    };
}

module.exports = {
    calculateMetrics
};
