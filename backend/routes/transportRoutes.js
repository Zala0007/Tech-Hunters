// routes/transportRoutes.js
const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');

router.get('/', transportController.getTransportData);
router.post('/', transportController.addTransportNode);

module.exports = router;
