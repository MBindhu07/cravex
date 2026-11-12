import { Notification } from '../models/index.js';

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = Notification.find(
      { $or: [{ userId }, { role: req.user.role }] },
      { sort: { createdAt: -1 }, limit: 30 }
    );
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const list = Notification.find({ userId });
    list.forEach((n) => {
      Notification.findByIdAndUpdate(n._id, { read: true });
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
};
