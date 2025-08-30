const mongoose = require('mongoose');

const DemandSchema = new mongoose.Schema({
    region: { type: String, required: true },
    demandValue: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Demand', DemandSchema);
