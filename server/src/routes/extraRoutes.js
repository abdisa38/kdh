const express = require('express');
const {
  getClassAttendance,
  saveClassAttendance,
  getLessonPlans,
  createLessonPlan,
  updateLessonPlanStatus,
  getTimeTable,
  getAssets,
  createAsset,
} = require('../controllers/extraModulesController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Attendance routes
router.get('/attendance', protect, getClassAttendance);
router.post('/attendance', protect, authorize('teacher', 'admin'), saveClassAttendance);

// Lesson Plans
router.get('/lesson-plans', protect, getLessonPlans);
router.post('/lesson-plans', protect, authorize('teacher', 'admin'), createLessonPlan);
router.put('/lesson-plans/:id', protect, authorize('admin'), updateLessonPlanStatus);

// Timetable
router.get('/timetable/:classRoomId', protect, getTimeTable);

// Assets
router.get('/assets', protect, getAssets);
router.post('/assets', protect, authorize('admin'), createAsset);

module.exports = router;
