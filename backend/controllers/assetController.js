// controllers/assetController.js

exports.getAssets = (req, res) => {
    res.json({ message: 'List all assets' });
};

exports.createAsset = (req, res) => {
    res.json({ message: 'Create asset' });
};

exports.updateAsset = (req, res) => {
    res.json({ message: 'Update asset' });
};

exports.deleteAsset = (req, res) => {
    res.json({ message: 'Delete asset' });
};
