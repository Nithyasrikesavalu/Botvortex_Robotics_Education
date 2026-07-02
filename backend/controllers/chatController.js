import Message from '../models/Message.js';
import User from '../models/User.js';
import EnrolledCourse from '../models/EnrolledCourse.js';

// @desc    Get contacts (conversations) for the current user
// @route   GET /api/chat/contacts
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming userType is mapped to role in auth middleware

    let contacts = [];

    if (userRole === 'student') {
      // Students can chat with all instructors to initiate conversations
      contacts = await User.find({ userType: 'instructor' }).select('-password');
    } else if (userRole === 'instructor') {
      // Instructors should ONLY see students who have messaged them
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
      });

      const studentIds = new Set();
      messages.forEach(msg => {
        if (msg.senderId.toString() !== userId.toString()) studentIds.add(msg.senderId.toString());
        if (msg.receiverId.toString() !== userId.toString()) studentIds.add(msg.receiverId.toString());
      });

      contacts = await User.find({ _id: { $in: Array.from(studentIds) }, userType: 'student' }).select('-password');
    }

    // Map to include latest message (optional enhancement)
    const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: userId, receiverId: contact._id },
          { senderId: contact._id, receiverId: userId }
        ]
      }).sort({ createdAt: -1 });

      return {
        id: contact._id,
        name: contact.fullName,
        avatar: contact.fullName.substring(0, 2).toUpperCase(),
        color: 'from-blue-500 to-cyan-400', // Default color
        lastMessage: lastMessage ? lastMessage.text : '',
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
      };
    }));

    // Sort by last message time
    contactsWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.json(contactsWithLastMessage);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver ID and text are required' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};
