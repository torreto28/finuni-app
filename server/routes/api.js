const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulatorController');

router.post('/simulator/calculate', simulatorController.calculateGrowth);

module.exports = router;
