import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { saveCart, getCart } from '../services/api';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

// Helper functions for localStorage (fallback)
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('everwear_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('everwear_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

// Helper functions for backend
const saveCartToBackend = async (items: CartItem[]) => {
  try {
    await saveCart(items);
  } catch (error) {
    console.error('Failed to save cart to backend:', error);
    // Fallback to localStorage
    saveCartToStorage(items);
  }
};

const loadCartFromBackend = async (): Promise<CartItem[]> => {
  try {
    return await getCart();
  } catch (error) {
    console.error('Failed to load cart from backend:', error);
    // Fallback to localStorage
    return loadCartFromStorage();
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart on mount (try backend first, fallback to localStorage)
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Try to load from backend first
        const backendCart = await loadCartFromBackend();
        if (backendCart.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: backendCart });
          return;
        }
      } catch (error) {
        console.log('Backend not available, using localStorage');
      }

      // Fallback to localStorage
      const savedCart = loadCartFromStorage();
      if (savedCart.length > 0) {
        dispatch({ type: 'LOAD_CART', payload: savedCart });
      }
    };

    loadCart();
  }, []);

  // Save cart whenever it changes (try backend first, fallback to localStorage)
  useEffect(() => {
    const saveCart = async () => {
      try {
        await saveCartToBackend(state.items);
      } catch (error) {
        // Fallback to localStorage if backend fails
        saveCartToStorage(state.items);
      }
    };

    if (state.items.length > 0) {
      saveCart();
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};