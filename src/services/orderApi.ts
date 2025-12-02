// API service for orders

const API_URL = 'http://localhost:8080/api';

// create new order in database
export const createOrder = async (userId: string, products: any[], total: number) => {
  try {
    // format products for order
    const orderProducts = products.map(item => ({
      productId: item.productId || item.id,
      productName: item.productName || item.name,
      quantity: item.quantity,
      price: item.price,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    }));

    console.log('🔧 OrderAPI - Formatted products:', JSON.stringify(orderProducts, null, 2));

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        products: orderProducts,
        total: total,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Could not create order');
    }
    
    return await response.json();
  } catch (error) {
    console.log('Error creating order:', error);
    throw error;
  }
};

// get user's orders from database
export const getUserOrders = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/user/${userId}`);
    if (!response.ok) {
      throw new Error('Could not get orders');
    }
    return await response.json();
  } catch (error) {
    console.log('Error getting orders:', error);
    return [];
  }
};

