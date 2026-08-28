const express = require('express');
const {
  getPublicAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicAnnouncements);

router.route('/')
  .get(protect, getAllAnnouncements)
  .post(protect, authorize('admin'), createAnnouncement);

router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

module.exports = router;
