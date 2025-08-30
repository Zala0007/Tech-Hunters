const Transport = require('../models/Transport');

async function getTransportData() {
    return await Transport.find({});
}

async function addTransportNode(data) {
    const node = new Transport(data);
    return await node.save();
}

module.exports = {
    getTransportData,
    addTransportNode
};
