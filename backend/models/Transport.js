const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
    name: String,
    type: String, // e.g., road, rail
    path: { type: Object, required: true }, // GeoJSON LineString or similar
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transport', TransportSchema);
