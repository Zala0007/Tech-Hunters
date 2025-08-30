const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    value: Number,
    createdAt: { type: Date, default: Date.now }
});

AssetSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Asset', AssetSchema);
