const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: String, // renewable source type like solar, wind
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    status: String,
    capacity: Number,
    createdAt: { type: Date, default: Date.now }
});

SiteSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Site', SiteSchema);
