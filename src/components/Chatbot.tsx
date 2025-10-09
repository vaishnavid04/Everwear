import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FAQ_RESPONSES = {
  sizing: "Our sizing runs true to size. We offer XS, S, M, L, and XL. For the best fit, we recommend checking our size guide. Most customers find their usual size works perfectly!",
  shipping: "We offer free shipping on all orders! Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $9.99.",
  returns: "We have a 30-day return policy. Items must be unworn with tags attached. Returns are free and easy - just use our prepaid return label.",
  materials: "All our essentials are made from premium cotton blends. T-shirts and crop tops are 100% organic cotton, while sweatshirts and sweatpants are 80% cotton, 20% recycled polyester for extra comfort.",
  colors: "Each item comes in 4 classic colors: Black, Grey, Cream, and Dark Brown. These timeless colors are designed to mix and match perfectly with your existing wardrobe.",
  care: "Machine wash cold with like colors. Tumble dry low or hang dry. Do not bleach. Iron on low heat if needed. Our pieces are designed to maintain their shape and softness wash after wash.",
  hello: "Hi there! 👋 I'm here to help you find the perfect essentials. I can answer questions about sizing, shipping, our products, or help you choose the right pieces for your style!",
  help: "I can help you with: sizing questions, shipping info, product details, care instructions, returns, and finding the perfect essentials for your wardrobe. What would you like to know?"
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your personal shopping assistant. How can I help you find the perfect essentials today?",
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

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return FAQ_RESPONSES.hello;
    }
    if (message.includes('size') || message.includes('sizing') || message.includes('fit')) {
      return FAQ_RESPONSES.sizing;
    }
    if (message.includes('ship') || message.includes('delivery') || message.includes('shipping')) {
      return FAQ_RESPONSES.shipping;
    }
    if (message.includes('return') || message.includes('exchange') || message.includes('refund')) {
      return FAQ_RESPONSES.returns;
    }
    if (message.includes('material') || message.includes('fabric') || message.includes('cotton')) {
      return FAQ_RESPONSES.materials;
    }
    if (message.includes('color') || message.includes('colours') || message.includes('black') || message.includes('grey') || message.includes('cream') || message.includes('brown')) {
      return FAQ_RESPONSES.colors;
    }
    if (message.includes('care') || message.includes('wash') || message.includes('clean')) {
      return FAQ_RESPONSES.care;
    }
    if (message.includes('help') || message.includes('what can you')) {
      return FAQ_RESPONSES.help;
    }
    if (message.includes('recommend') || message.includes('suggest') || message.includes('what should')) {
      return "I'd recommend starting with our Essential T-Shirt and Essential Sweatpants - they're customer favorites! The neutral colors make them perfect for mixing and matching. What's your style preference?";
    }
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
      return "Our essentials are priced affordably: T-shirts $28, Crop Tops $24, Sweatshirts $48, Sweatpants $42, and Sweat Sets $78. Quality basics that won't break the bank!";
    }
    
    return "I'd be happy to help! I can answer questions about sizing, shipping, our products, or help you choose the right essentials. You can also browse our collection or contact our support team for more detailed assistance.";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
                <h3 className="font-semibold">Shopping Assistant</h3>
                <p className="text-xs text-primary-200">Online now</p>
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
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
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
