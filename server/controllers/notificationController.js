const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    return res.json({
      success: true,
      notification,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/notifications/read-all
// @desc    Mark all user notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    return res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (err) {
    next(err);
  }
};
