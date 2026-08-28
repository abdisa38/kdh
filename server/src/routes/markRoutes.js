const express = require('express');
const { getClassMarksheet, saveBulkMarks } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/roster', protect, authorize('teacher', 'admin', 'registrar'), getClassMarksheet);
router.post('/bulk-save', protect, authorize('teacher', 'admin'), saveBulkMarks);

module.exports = router;
