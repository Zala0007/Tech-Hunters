const Metrics = require('../models/Metrics');

async function getDashboardMetrics() {
    // Aggregate metrics or pull recent metrics from DB
    const metrics = await Metrics.find({}).sort({ timestamp: -1 }).limit(10);
    return metrics;
}

module.exports = {
    getDashboardMetrics
};
