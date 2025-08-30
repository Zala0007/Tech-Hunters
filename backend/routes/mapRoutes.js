// routes/mapRoutes.js
const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/', mapController.getMapLayers);
router.post('/', mapController.addMapLayer);
router.put('/:id', mapController.updateMapLayer);
router.delete('/:id', mapController.deleteMapLayer);

module.exports = router;
