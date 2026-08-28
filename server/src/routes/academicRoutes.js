const express = require('express');
const {
  getAcademicYears,
  createAcademicYear,
  getClassRooms,
  createClassRoom,
  getSubjects,
  createSubject,
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/years')
  .get(getAcademicYears)
  .post(protect, authorize('admin'), createAcademicYear);

router.route('/classes')
  .get(getClassRooms)
  .post(protect, authorize('admin'), createClassRoom);

router.route('/subjects')
  .get(getSubjects)
  .post(protect, authorize('admin'), createSubject);

module.exports = router;
