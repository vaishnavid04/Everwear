import express from 'express';
import Order from '../models/Order.js';
import ShoppingCart from '../models/ShoppingCart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// create new order
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId;
    const products = req.body.products;
    const total = req.body.total;
    
    // create order
    const newOrder = new Order({
      userId: userId,
      products: products,
      total: total,
      status: 'pending'
    });
    
    await newOrder.save();
    
    // add order to user's order history
    const user = await User.findById(userId);
    if (user) {
      user.orderHistory.push(newOrder._id);
      await user.save();
    }
    
    // clear cart after order
    const cart = await ShoppingCart.findOne({ userId: userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    
    res.status(201).json(newOrder);
  } catch (err) {
    console.log('Error creating order:', err);
    res.status(500).json({ message: 'Could not create order', error: err.message });
  }
});

// get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.log('Error getting orders:', err);
    res.status(500).json({ message: 'Could not get orders', error: err.message });
  }
});

// get order by id
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.log('Error getting order:', err);
    res.status(500).json({ message: 'Could not get order', error: err.message });
  }
});

// update order status
router.put('/:id/status', async (req, res) => {
  try {
    const status = req.body.status;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.log('Error updating order:', err);
    res.status(500).json({ message: 'Could not update order', error: err.message });
  }
});

export default router;


