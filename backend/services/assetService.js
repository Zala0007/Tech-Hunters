const Asset = require('../models/Asset');

async function getAllAssets() {
    return await Asset.find({});
}

async function createAsset(data) {
    const asset = new Asset(data);
    return await asset.save();
}

async function updateAsset(id, data) {
    return await Asset.findByIdAndUpdate(id, data, { new: true });
}

async function deleteAsset(id) {
    return await Asset.findByIdAndDelete(id);
}

module.exports = {
    getAllAssets,
    createAsset,
    updateAsset,
    deleteAsset
};
