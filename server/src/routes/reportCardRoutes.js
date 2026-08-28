const express = require('express');
const {
  computeClassRanking,
  getMasterSheet,
  getStudentReportCard,
  updateReportCardDetails,
} = require('../controllers/reportCardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/calculate-ranking', protect, authorize('admin', 'teacher'), computeClassRanking);
router.get('/master-sheet', protect, authorize('admin', 'teacher', 'registrar'), getMasterSheet);
router.get('/student/:studentId', protect, getStudentReportCard);
router.put('/:id', protect, authorize('admin', 'teacher'), updateReportCardDetails);

module.exports = router;
