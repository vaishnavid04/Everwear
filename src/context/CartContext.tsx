import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { addToCart as addToCartAPI, getCart as getCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../services/cartApi';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  syncToBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.selectedColor === action.payload.selectedColor &&
        item.selectedSize === action.payload.selectedSize
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.selectedColor === action.payload.selectedColor &&
            item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        ...action.payload,
        quantity: 1,
        selectedColor: action.payload.selectedColor || '',
        selectedSize: action.payload.selectedSize || '',
      };

      return {
        ...state,
        items: [...state.items, newItem],
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
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

// Helper functions for localStorage
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

// Helper functions for backend sync
const syncCartToBackend = async (userId: string, items: CartItem[]) => {
  if (!userId) return;

  try {
    // Clear backend cart first
    await clearCartAPI(userId);

    // Add each item to backend cart
    for (const item of items) {
      await addToCartAPI(
        userId,
        item.id?.toString() || '',
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.name,
        item.salePrice || item.price,
        item.imageUrl
      );
    }
    console.log('✅ Cart synced to backend successfully');
  } catch (error) {
    console.error('❌ Failed to sync cart to backend:', error);
  }
};

const loadCartFromBackend = async (userId: string): Promise<CartItem[]> => {
  if (!userId) return [];

  try {
    const backendCart = await getCartAPI(userId);
    const items: CartItem[] = backendCart.items?.map((item: any) => ({
      id: parseInt(item.productId) || 0,
      name: item.productName || '',
      price: item.productPrice || 0,
      imageUrl: item.productImage || '',
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor || '',
      selectedSize: item.selectedSize || '',
    })) || [];

    console.log('✅ Cart loaded from backend:', items.length, 'items');
    return items;
  } catch (error) {
    console.error('❌ Failed to load cart from backend:', error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode; userId?: string }> = ({ children, userId }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (userId) {
      console.log('🔄 Loading cart from backend for user:', userId);
      loadCartFromBackend(userId).then(backendItems => {
        if (backendItems.length > 0) {
          console.log('📥 Loaded', backendItems.length, 'items from backend');
          // Merge with localStorage cart (backend takes priority)
          dispatch({ type: 'LOAD_CART', payload: backendItems });
          saveCartToStorage(backendItems);
        } else {
          console.log('📭 No items found in backend cart');
        }
      });
    }
  }, [userId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  // Sync cart to backend (debounced)
  useEffect(() => {
    if (userId && state.items.length > 0) {
      console.log('🔄 Syncing', state.items.length, 'items to backend for user:', userId);
      const timeoutId = setTimeout(() => {
        syncCartToBackend(userId, state.items);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [userId, state.items]);

  const syncToBackend = async () => {
    if (userId) {
      await syncCartToBackend(userId, state.items);
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch, syncToBackend }}>
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
