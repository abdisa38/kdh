const express = require('express');
const {
  getAllTeachers,
  createTeacher,
  getMyAssignedClasses,
  assignTeacherClasses,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me/assigned-classes', protect, authorize('teacher'), getMyAssignedClasses);

router.route('/')
  .get(protect, authorize('admin', 'registrar'), getAllTeachers)
  .post(protect, authorize('admin'), createTeacher);

router.put('/:id/assign', protect, authorize('admin'), assignTeacherClasses);

module.exports = router;
