const Announcement = require('../models/Announcement');

// @desc    Get public announcements
// @route   GET /api/announcements/public
// @access  Public
exports.getPublicAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isPublic: true })
      .populate('publishedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate('publishedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, titleAmharic, content, contentAmharic, category, targetAudience, priority, isPublic } = req.body;

    const announcement = await Announcement.create({
      title,
      titleAmharic,
      content,
      contentAmharic,
      category,
      targetAudience,
      priority,
      isPublic: isPublic !== undefined ? isPublic : true,
      publishedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};
