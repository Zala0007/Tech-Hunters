const mongoose = require('mongoose');

const MapLayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    data: { type: Object, required: true }, // GeoJSON or custom format
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MapLayer', MapLayerSchema);
