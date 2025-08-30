const Site = require('../models/Site');
const Recommendation = require('../models/Recommendation');

async function getSites() {
    return await Site.find({});
}

async function addSite(data) {
    const site = new Site(data);
    return await site.save();
}

async function getRecommendations() {
    return await Recommendation.find({}).populate('site');
}

module.exports = {
    getSites,
    addSite,
    getRecommendations
};
