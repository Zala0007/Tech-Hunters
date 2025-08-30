const Policy = require('../models/Policy');

async function getPolicies() {
    return await Policy.find({});
}

async function analyzePolicy(id) {
    // Placeholder for analysis logic on a policy by ID
    return await Policy.findById(id);
}

module.exports = {
    getPolicies,
    analyzePolicy
};
