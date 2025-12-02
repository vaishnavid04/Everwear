import express from 'express';
import ChatbotInquiry from '../models/ChatbotInquiry.js';

const router = express.Router();

// save chatbot inquiry
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || null;
    const userMessage = req.body.userMessage;
    const botResponse = req.body.botResponse;
    
    const newInquiry = new ChatbotInquiry({
      userId: userId,
      userMessage: userMessage,
      botResponse: botResponse,
      timestamp: new Date()
    });
    
    await newInquiry.save();
    
    res.status(201).json({ message: 'Inquiry saved successfully', inquiry: newInquiry });
  } catch (err) {
    console.log('Error saving chatbot inquiry:', err);
    res.status(500).json({ message: 'Could not save inquiry', error: err.message });
  }
});

// get all inquiries (for admin use)
router.get('/', async (req, res) => {
  try {
    const inquiries = await ChatbotInquiry.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
    
    res.json(inquiries);
  } catch (err) {
    console.log('Error getting inquiries:', err);
    res.status(500).json({ message: 'Could not get inquiries', error: err.message });
  }
});

// get user inquiries
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const inquiries = await ChatbotInquiry.find({ userId: userId })
      .sort({ timestamp: -1 });
    
    res.json(inquiries);
  } catch (err) {
    console.log('Error getting user inquiries:', err);
    res.status(500).json({ message: 'Could not get user inquiries', error: err.message });
  }
});

export default router;


