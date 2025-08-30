// routes/policyRoutes.js
const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

console.log('policyController:', policyController);


router.get('/', policyController.getPolicies);
router.post('/analyze', policyController.analyzePolicy);

module.exports = router;
