import mongoose from 'mongoose';

// chatbot inquiry schema for storing chatbot conversations
const chatbotInquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatbotInquiry = mongoose.model('ChatbotInquiry', chatbotInquirySchema);

export default ChatbotInquiry;


