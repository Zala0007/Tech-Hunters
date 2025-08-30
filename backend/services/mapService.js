const MapLayer = require('../models/MapLayer');

async function getAllMapLayers() {
    return await MapLayer.find({});
}

async function addMapLayer(data) {
    const newLayer = new MapLayer(data);
    return await newLayer.save();
}

async function updateMapLayer(id, data) {
    return await MapLayer.findByIdAndUpdate(id, data, { new: true });
}

async function deleteMapLayer(id) {
    return await MapLayer.findByIdAndDelete(id);
}

module.exports = {
    getAllMapLayers,
    addMapLayer,
    updateMapLayer,
    deleteMapLayer
};
