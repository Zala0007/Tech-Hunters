const Scenario = require('../models/Scenario');

async function runScenario(inputData) {
    // Placeholder: process inputData and save scenario
    const scenario = new Scenario({ name: inputData.name, inputs: inputData });
    return await scenario.save();
}

async function getScenarioResults(id) {
    return await Scenario.findById(id);
}

module.exports = {
    runScenario,
    getScenarioResults
};
