const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    priority: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
