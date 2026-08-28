const express = require('express');
const { getAdminMetrics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/metrics', protect, authorize('admin'), getAdminMetrics);

module.exports = router;
