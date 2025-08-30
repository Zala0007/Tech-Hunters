// routes/siteRoutes.js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.getSites);
router.post('/', siteController.addSite);
router.get('/recommendations', siteController.recommendSites);

module.exports = router;
