import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import * as cartApi from '../services/cartApi';

interface CartState {
  items: CartItem[];
  loading: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  syncCartToBackend: () => Promise<void>;
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
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      // log the update (beginner friendly)
      console.log('CartReducer: UPDATE_QUANTITY', {
        itemId: action.payload.id,
        newQuantity: action.payload.quantity,
        currentItems: state.items.map(item => ({ id: item.id, quantity: item.quantity }))
      });
      
      const updatedState = {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            const newQuantity = Number(action.payload.quantity) || 1;
            console.log('Updating item quantity:', item.name, 'from', item.quantity, 'to', newQuantity);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      };
      
      // log updated state (beginner friendly)
      console.log('CartReducer: Updated state', {
        items: updatedState.items.map(item => ({ name: item.name, quantity: item.quantity }))
      });
      
      return updatedState;
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });
  const { state: authState } = useAuth();

  // function to save cart to backend
  const syncCartToBackend = async () => {
    if (!authState.user?.id || state.items.length === 0) {
      return; // not logged in or no items, skip backend sync
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // clear cart first, then add all items fresh (beginner friendly - simple approach)
      try {
        await cartApi.clearCart(authState.user.id);
      } catch (err) {
        // cart might not exist yet, that's ok
      }
      
      // add each item to backend with product data
      // wait a bit between each add to avoid race conditions (beginner friendly)
      console.log('=== Frontend syncing cart to backend ===');
      console.log('Items in state:', state.items.length);
      console.log('Full state items:', JSON.stringify(state.items, null, 2));
      
      for (let i = 0; i < state.items.length; i++) {
        const item = state.items[i];
        const productId = item._id || item.id?.toString() || '';
        
        // get quantity from item (beginner friendly - make sure it's correct)
        // IMPORTANT: Make sure we get the actual quantity from state
        let itemQuantity = item.quantity;
        if (itemQuantity === undefined || itemQuantity === null) {
          console.warn('Item quantity is undefined, defaulting to 1. Item:', item);
          itemQuantity = 1;
        }
        itemQuantity = Number(itemQuantity); // convert to number
        if (isNaN(itemQuantity) || itemQuantity < 1) {
          console.warn('Item quantity is invalid, defaulting to 1. Quantity was:', itemQuantity);
          itemQuantity = 1;
        }
        
        // log what we're sending (beginner friendly - see what's happening)
        console.log('Frontend sending item', i + 1, ':', {
          name: item.name,
          quantity: itemQuantity,
          quantityType: typeof itemQuantity,
          rawQuantity: item.quantity,
          fullItemData: item
        });
        
        try {
          // use salePrice if available, otherwise use price
          const itemPrice = item.salePrice || item.price || 0;
          
          // add item with correct price and quantity
          await cartApi.addToCart(
            authState.user.id,
            productId,
            itemQuantity, // send actual quantity from state as number
            item.selectedColor,
            item.selectedSize,
            item.name,
            itemPrice,
            item.imageUrl
          );
          
          // small delay between items (beginner friendly)
          if (i < state.items.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (err) {
          console.log('Error saving item to backend cart:', err);
        }
      }
      
      console.log('=== Finished syncing cart to backend ===');
      
    } catch (error) {
      console.log('Error syncing cart to backend:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // load cart from backend when user logs in
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (authState.user?.id && authState.isAuthenticated) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const cartData = await cartApi.getCart(authState.user.id);
          
          // convert backend cart items to frontend format
          if (cartData.items && cartData.items.length > 0) {
            console.log('Loading cart from backend. Backend items:', cartData.items);
            const items = cartData.items.map((item: any) => {
              // backend stores product data directly (beginner friendly)
              const frontendItem = {
                id: item.productId || item._id || '', // product ID as string
                _id: item.productId || item._id || '',
                name: item.productName || '',
                price: item.productPrice || 0,
                salePrice: item.productPrice || 0,
                imageUrl: item.productImage || '',
                quantity: item.quantity || 1, // use quantity from backend
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
              };
              console.log('Converted backend item to frontend:', frontendItem);
              return frontendItem;
            });
            console.log('Setting cart items in frontend state:', items);
            dispatch({ type: 'SET_CART', payload: items });
          } else {
            console.log('No items in backend cart, setting empty cart');
            dispatch({ type: 'SET_CART', payload: [] });
          }
        } catch (error) {
          console.log('Error loading cart from backend:', error);
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    loadCartFromBackend();
  }, [authState.user?.id, authState.isAuthenticated]);

  // save to backend when cart changes (if user is logged in)
  // use a ref to track if we're already syncing to avoid duplicate calls
  const isSyncingRef = useRef(false);
  const lastCartStateRef = useRef<string>('');
  
  useEffect(() => {
    if (!authState.user?.id || !authState.isAuthenticated || state.items.length === 0) {
      return;
    }
    
    // create a string to represent cart state (include all important fields)
    const cartStateString = JSON.stringify(
      state.items
        .map(item => ({
          id: item.id || item._id,
          productId: item._id || item.id,
          quantity: Number(item.quantity) || 1, // ensure it's a number
          price: item.salePrice || item.price,
          name: item.name
        }))
        .sort((a, b) => String(a.id).localeCompare(String(b.id))) // sort for consistent comparison
    );
    
    // log cart state for debugging (beginner friendly)
    console.log('Cart state changed. Current state:', {
      itemsCount: state.items.length,
      items: state.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        id: item.id
      })),
      cartStateString: cartStateString.substring(0, 100) + '...'
    });
    
    // only sync if cart actually changed and not already syncing
    if (cartStateString !== lastCartStateRef.current && !isSyncingRef.current) {
      console.log('Cart state changed, will sync to backend after delay');
      lastCartStateRef.current = cartStateString;
      
      // wait a bit before syncing (beginner friendly - simple delay)
      // increased delay to ensure state is fully updated
      const timer = setTimeout(() => {
        if (!isSyncingRef.current && authState.user?.id) {
          console.log('Starting sync to backend...');
          isSyncingRef.current = true;
          syncCartToBackend().finally(() => {
            isSyncingRef.current = false;
            // update lastCartStateRef with current state after sync
            const currentStateString = JSON.stringify(
              state.items.map(item => ({
                id: item.id || item._id,
                productId: item._id || item.id,
                quantity: Number(item.quantity) || 1,
                price: item.salePrice || item.price,
                name: item.name
              })).sort((a, b) => String(a.id).localeCompare(String(b.id)))
            );
            lastCartStateRef.current = currentStateString;
          });
        }
      }, 1500); // increased delay to 1.5 seconds
      return () => clearTimeout(timer);
    } else {
      console.log('Cart state unchanged or already syncing, skipping sync');
    }
  }, [state.items, authState.user?.id, authState.isAuthenticated]); // changed from state.items.length to state.items


  return (
    <CartContext.Provider value={{ state, dispatch, syncCartToBackend }}>
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