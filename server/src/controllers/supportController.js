import { SupportTicket, Notification } from '../models/index.js';

export const createTicket = async (req, res) => {
  try {
    const { orderId, category = 'Order Issue', subject, description, priority = 'Medium' } = req.body;
    const user = req.user;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Please provide subject and description' });
    }

    const ticketId = `CRV-${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket = SupportTicket.create({
      ticketId,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      orderId: orderId || null,
      category,
      priority,
      subject,
      description,
      status: 'OPEN',
      messages: [
        {
          id: `msg_1`,
          sender: 'customer',
          senderName: user.name,
          text: description,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create support ticket' });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = SupportTicket.find({ userId: req.user._id }, { sort: { createdAt: -1 } });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load tickets' });
  }
};

export const getAllTicketsAdmin = async (req, res) => {
  try {
    const tickets = SupportTicket.find({}, { sort: { createdAt: -1 } });
    res.json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load all tickets' });
  }
};

export const replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;
    const user = req.user;

    const ticket = SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: user.role === 'admin' ? 'support' : 'customer',
      senderName: user.name,
      text: message,
      timestamp: new Date().toISOString(),
    };

    const updateData = {
      messages: [...(ticket.messages || []), newMessage],
    };

    if (status) {
      updateData.status = status;
    }

    const updated = SupportTicket.findByIdAndUpdate(id, updateData);

    // Notify user if admin replied
    if (user.role === 'admin') {
      Notification.create({
        userId: ticket.userId,
        role: 'customer',
        title: `Support update on #${ticket.ticketId}`,
        message: `Our care team responded: "${message.slice(0, 50)}..."`,
        type: 'system',
        link: '/support',
        read: false,
      });
    }

    res.json({ success: true, ticket: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reply to ticket' });
  }
};
