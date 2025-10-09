import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

const API_URL = 'http://localhost:8080/api';

// Mock authentication for development (replace with real API when backend is ready)
// To enable real authentication:
// 1. Set up MongoDB database
// 2. Create Node.js/Express backend with authentication endpoints
// 3. Set MOCK_MODE to false
const MOCK_MODE = true;

export const login = async (credentials: LoginCredentials): Promise<User> => {
  if (MOCK_MODE) {
    // Mock login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo
    if (credentials.email && credentials.password) {
      return {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
    } else {
      throw new Error('Please enter valid email and password');
    }
  }

  try {
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
  } catch (error) {
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  if (MOCK_MODE) {
    // Mock registration - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo
    if (credentials.email && credentials.password && credentials.name) {
      return {
        id: '1',
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
      };
    } else {
      throw new Error('Please fill in all required fields');
    }
  }

  try {
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
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  if (MOCK_MODE) {
    // Mock logout - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    throw error;
  }
};