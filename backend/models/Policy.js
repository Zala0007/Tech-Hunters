const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    effectiveDate: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Policy', PolicySchema);
