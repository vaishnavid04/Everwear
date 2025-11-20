import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/openai';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Everwear AI assistant. I can help you with product information, pricing, sizing, and any questions about our store. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await sendChatMessage(messageToSend);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our products!",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-800 text-white rounded-full shadow-lg hover:bg-primary-900 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-neutral-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-primary-800 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Everwear AI Assistant</h3>
                <p className="text-xs text-primary-200">Powered by OpenAI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.isBot ? 'bg-primary-100' : 'bg-neutral-200'}`}>
                    {message.isBot ? <Bot size={14} className="text-primary-800" /> : <User size={14} className="text-neutral-600" />}
                  </div>
                  <div className={`p-3 rounded-lg ${message.isBot ? 'bg-neutral-100 text-neutral-900' : 'bg-primary-800 text-white'}`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <Bot size={14} className="text-primary-800" />
                  </div>
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, pricing, sizing..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-800 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="px-3 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
