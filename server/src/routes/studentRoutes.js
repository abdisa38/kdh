const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  getMyResults,
  publicResultSearch,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public result search
router.post('/public/search-result', publicResultSearch);

// Student self results
router.get('/me/results', protect, authorize('student'), getMyResults);

// Admin / Teacher endpoints
router.route('/')
  .get(protect, authorize('admin', 'teacher', 'registrar'), getAllStudents)
  .post(protect, authorize('admin', 'registrar'), createStudent);

router.route('/:id')
  .get(protect, authorize('admin', 'teacher', 'registrar', 'student'), getStudentById);

module.exports = router;
