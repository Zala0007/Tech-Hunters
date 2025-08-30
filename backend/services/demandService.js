const Demand = require('../models/Demand');

async function getDemandByRegion(region) {
    return await Demand.find({ region });
}

async function addDemand(demandData) {
    const demand = new Demand(demandData);
    return await demand.save();
}

async function analyzeDemand(region) {
    // Sample: compute average demand for region
    const data = await Demand.find({ region });
    const avg = data.reduce((sum, d) => sum + d.demandValue, 0) / data.length;
    return { averageDemand: avg };
}

module.exports = {
    getDemandByRegion,
    addDemand,
    analyzeDemand
};
