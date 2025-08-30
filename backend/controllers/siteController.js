// controllers/siteController.js

exports.getSites = (req, res) => {
    res.json({ message: 'List renewable sites' });
};

exports.addSite = (req, res) => {
    res.json({ message: 'Add renewable site' });
};

exports.recommendSites = (req, res) => {
    res.json({ message: 'Site recommendations' });
};
