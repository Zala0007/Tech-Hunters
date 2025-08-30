// routes/demandRoutes.js
const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');

router.get('/', demandController.getDemandData);
router.post('/analyze', demandController.analyzeDemand);

module.exports = router;
