// routes/scenarioRoutes.js
const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');

router.post('/run', scenarioController.runScenario);
router.get('/results', scenarioController.getScenarioResults);

module.exports = router;
