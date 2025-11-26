import { products } from '../data/products';
import { saveChatMessage } from './api';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Create context about the website and products
const createWebsiteContext = () => {
  const productInfo = products.map(product => ({
    name: product.name,
    price: product.price,
    salePrice: product.salePrice,
    category: product.category,
    description: product.description,
    colors: product.colors,
    sizes: product.sizes
  }));

  return `
You are a helpful customer service assistant for Everwear, an online clothing store specializing in timeless essential basics.

COMPANY INFORMATION:
- Store Name: Everwear
- Tagline: "Timeless Essentials for Every Day"
- Focus: Carefully curated basics that last - simple, comfortable, and timeless pieces

HEADQUARTERS & CONTACT:
- Address: 123 Market Street, San Jose, CA 95113
- Email: support@everwear.co
- Phone: (408) 555-0126
- Business Hours: Monday–Friday 9:00 AM – 6:00 PM PT

STORE CATEGORIES:
- Menswear
- Womenswear
- Accessories
- Sale

PRODUCT CATALOG:
${JSON.stringify(productInfo, null, 2)}

WEBSITE FEATURES:
- Shopping cart functionality
- Product filtering by category
- Sale items with discounted pricing
- Responsive design for all devices
- Secure checkout process

INSTRUCTIONS:
- Answer questions about products, pricing, availability, website features, contact info, and business hours
- Be friendly and helpful
- If asked about products not in our catalog, politely explain we don't carry them
- For pricing questions, always mention both regular and sale prices when applicable
- For contact questions, provide our email, phone, address, and business hours
- Encourage customers to browse our collection or contact support if needed
- Keep responses concise but informative
`;
};

// Fallback responses for when API is unavailable
const getFallbackResponse = (message: string): string => {
  const msg = message.toLowerCase();

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('support')) {
    return "You can reach us at: Email: support@everwear.co | Phone: (408) 555-0126 | Address: 123 Market Street, San Jose, CA 95113 | Hours: Mon–Fri 9:00 AM – 6:00 PM PT";
  }
  if (msg.includes('hours') || msg.includes('open') || msg.includes('closed')) {
    return "Our business hours are Monday–Friday 9:00 AM – 6:00 PM PT. You can contact us at support@everwear.co or (408) 555-0126 during these hours.";
  }
  if (msg.includes('address') || msg.includes('location') || msg.includes('where')) {
    return "Everwear is located at 123 Market Street, San Jose, CA 95113. For questions, email us at support@everwear.co or call (408) 555-0126.";
  }
  if (msg.includes('price') || msg.includes('cost')) {
    return "Our current pricing: Essential T-Shirt $28, Sports Bra $32, Essential Crop Top $24, Essential Sweatshirt $48, Straight Leg Sweats $42, Cuffed Sweats $42, Baseball Hat $48 (on sale for $38), Beanie $28. All prices include free shipping!";
  }
  if (msg.includes('baseball hat') || msg.includes('hat')) {
    return "Our Baseball Hat is currently on sale! Regular price $48.00, now just $38.00. Available in black, grey, cream, and dark brown. You can find it in both our Sale and Accessories sections.";
  }
  if (msg.includes('sale') || msg.includes('discount')) {
    return "We currently have our Baseball Hat on sale for $38.00 (was $48.00). Check out our Sale section for this great deal!";
  }
  if (msg.includes('size') || msg.includes('sizing')) {
    return "Our items come in various sizes: XS, S, M, L, XL for most clothing items, and One Size for accessories like hats and beanies. All items run true to size.";
  }

  return "I'm here to help with questions about our Everwear products, pricing, contact info, and store information. You can ask me about specific items, prices, sizing, or browse our Menswear, Womenswear, Accessories, and Sale sections! Contact us at support@everwear.co for additional help.";
};

export const sendChatMessage = async (message: string): Promise<string> => {
  let botResponse: string;

  // If no API key, use fallback responses
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback responses');
    botResponse = getFallbackResponse(message);
  } else {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: createWebsiteContext()
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status}`);
        botResponse = getFallbackResponse(message);
      } else {
        const data = await response.json();
        botResponse = data.choices[0]?.message?.content || getFallbackResponse(message);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      botResponse = getFallbackResponse(message);
    }
  }

  // Save the conversation to backend
  try {
    await saveChatMessage(message, botResponse);
  } catch (error) {
    console.warn('Failed to save chat message to backend:', error);
  }

  return botResponse;
};
