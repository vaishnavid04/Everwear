// API service for cart operations

const API_URL = 'http://localhost:8080/api';

// get user's cart from database
export const getCart = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/cart/${userId}`);
    if (!response.ok) {
      throw new Error('Could not get cart');
    }
    return await response.json();
  } catch (error) {
    console.log('Error getting cart:', error);
    return { items: [], totalPrice: 0 };
  }
};

// add item to cart in database
export const addToCart = async (userId: string, productId: string, quantity: number, selectedColor?: string, selectedSize?: string, productName?: string, productPrice?: number, productImage?: string) => {
  try {
    // make sure quantity is a number (beginner friendly)
    let quantityNum = quantity;
    if (typeof quantity !== 'number') {
      quantityNum = parseInt(String(quantity), 10);
      if (isNaN(quantityNum) || quantityNum < 1) {
        quantityNum = 1;
      }
    }
    if (quantityNum < 1) {
      quantityNum = 1; // ensure minimum is 1
    }
    
    // log what we're sending (beginner friendly)
    console.log('Frontend cartApi.addToCart called with:', {
      userId: userId,
      productId: productId,
      productName: productName,
      quantity: quantityNum,
      originalQuantity: quantity,
      quantityType: typeof quantityNum
    });
    
    const response = await fetch(`${API_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        productName: productName,
        productPrice: productPrice,
        productImage: productImage,
        quantity: quantityNum, // send as number
        selectedColor: selectedColor,
        selectedSize: selectedSize,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Could not add to cart');
    }
    const result = await response.json();
    console.log('Backend response - saved cart with items:', result.items?.length || 0);
    return result;
  } catch (error) {
    console.log('Error adding to cart:', error);
    throw error;
  }
};

// update cart item quantity in database
export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  try {
    const response = await fetch(`${API_URL}/cart/${userId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      throw new Error('Could not update cart');
    }
    return await response.json();
  } catch (error) {
    console.log('Error updating cart:', error);
    throw error;
  }
};

// remove item from cart in database
export const removeFromCart = async (userId: string, productId: string) => {
  try {
    const response = await fetch(`${API_URL}/cart/${userId}/remove/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Could not remove from cart');
    }
    return await response.json();
  } catch (error) {
    console.log('Error removing from cart:', error);
    throw error;
  }
};

// clear cart in database
export const clearCart = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Could not clear cart');
    }
    return await response.json();
  } catch (error) {
    console.log('Error clearing cart:', error);
    throw error;
  }
};

