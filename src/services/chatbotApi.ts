// API service for chatbot inquiries

const API_URL = 'http://localhost:8080/api';

// save chatbot inquiry to database
export const saveChatbotInquiry = async (
  userId: string | null,
  userMessage: string,
  botResponse: string
): Promise<void> => {
  try {
    await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userMessage: userMessage,
        botResponse: botResponse,
      }),
    });
  } catch (error) {
    // silently fail - don't interrupt chatbot flow if save fails
    console.error('Error saving chatbot inquiry:', error);
  }
};


