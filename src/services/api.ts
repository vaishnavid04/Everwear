import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// Toggle mock mode via env (Vite): VITE_MOCK_MODE=true to keep using mocks
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' || false;

const getToken = () => localStorage.getItem('everwear_token');
const setToken = (token: string) => localStorage.setItem('everwear_token', token);
const clearToken = () => localStorage.removeItem('everwear_token');

const defaultHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (credentials.email && credentials.password) {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      return mockUser;
    } else {
      throw new Error('Please enter valid email and password');
    }
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || 'Login failed');
  }

  const data = await res.json();
  if (data.token) setToken(data.token);
  return data.user as User;
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (credentials.email && credentials.password) {
      return {
        id: '2',
        email: credentials.email,
        name: credentials.name || credentials.email.split('@')[0],
        createdAt: new Date().toISOString()
      };
    } else {
      throw new Error('Please enter valid registration data');
    }
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(err.message || 'Registration failed');
  }

  const data = await res.json();
  if (data.token) setToken(data.token);
  return data.user as User;
};

export const logout = async () => {
  clearToken();
};

export const getProfile = async (): Promise<User> => {
  if (MOCK_MODE) {
    return {
      id: '1',
      email: 'demo@everwear.co',
      name: 'demo',
      createdAt: new Date().toISOString()
    };
  }
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  const data = await res.json();
  return data.user as User;
};
