import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

const API_URL = 'http://localhost:8080/api';

// Mock authentication for development (replace with real API when backend is ready)
// To enable real authentication:
// 1. Set up MongoDB database
// 2. Create Node.js/Express backend with authentication endpoints
// 3. Set MOCK_MODE to false
const MOCK_MODE = false;

export const login = async (credentials: LoginCredentials): Promise<User> => {
  if (MOCK_MODE) {
    // Mock login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo
    if (credentials.email && credentials.password) {
      const emailName = credentials.email.split('@')[0];
      const nameParts = emailName.split('.');
      return {
        id: '1',
        email: credentials.email,
        firstName: nameParts[0] || 'User',
        lastName: nameParts[1] || 'Account',
      };
    } else {
      throw new Error('Please enter valid email and password');
    }
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  if (MOCK_MODE) {
    // Mock registration - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo
    if (credentials.email && credentials.password && credentials.firstName && credentials.lastName) {
      return {
        id: '1',
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      };
    } else {
      throw new Error('Please fill in all required fields');
    }
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  if (MOCK_MODE) {
    // Mock logout - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

// Cart API functions
export const saveCart = async (cartItems: any[]): Promise<void> => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: cartItems }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Save cart error:', errorText);
    throw new Error('Failed to save cart');
  }
};

export const getCart = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get cart error:', errorText);
    throw new Error('Failed to get cart');
  }

  const data = await response.json();
  return data.items || [];
};

// Order API functions
export const createOrder = async (orderData: any): Promise<any> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create order error:', errorText);
    throw new Error('Failed to create order');
  }

  return response.json();
};

// Chatbot API functions
export const saveChatMessage = async (message: string, response: string): Promise<void> => {
  const chatResponse = await fetch(`${API_URL}/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userMessage: message,
      botResponse: response
    }),
    credentials: 'include',
  });

  if (!chatResponse.ok) {
    console.warn('Failed to save chat message to backend');
  }
};