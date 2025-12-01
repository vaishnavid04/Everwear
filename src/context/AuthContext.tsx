import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_AUTH'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'RESTORE_AUTH':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Helper functions for localStorage
const saveAuthToStorage = (user: User) => {
  try {
    localStorage.setItem('everwear_user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error);
  }
};

const loadAuthFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem('everwear_user');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error);
    return null;
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('everwear_user');
  } catch (error) {
    console.error('Failed to clear auth from localStorage:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedUser = loadAuthFromStorage();
    if (savedUser) {
      dispatch({ type: 'RESTORE_AUTH', payload: savedUser });
    }
  }, []);

  // Enhanced dispatch that handles localStorage
  const enhancedDispatch = (action: AuthAction) => {
    dispatch(action);

    // Handle localStorage based on action type
    if (action.type === 'AUTH_SUCCESS') {
      saveAuthToStorage(action.payload);
    } else if (action.type === 'LOGOUT') {
      clearAuthFromStorage();
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};