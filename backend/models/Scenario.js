const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    inputs: { type: Object, required: true },
    results: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
