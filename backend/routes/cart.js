import express from 'express';
import mongoose from 'mongoose';
import ShoppingCart from '../models/ShoppingCart.js';
import Product from '../models/Product.js';

const router = express.Router();

// helper function to calculate shipping and total
const calculateCartTotal = (items) => {
  // calculate subtotal
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const price = item.productPrice || 0;
    subtotal = subtotal + (price * item.quantity);
  }
  
  // calculate shipping fee (if subtotal < 100, add $10)
  let shippingFee = 0;
  if (subtotal < 100) {
    shippingFee = 10;
  }
  
  // calculate total
  const totalPrice = subtotal + shippingFee;
  
  return { subtotal, shippingFee, totalPrice };
};

// get user's shopping cart
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // convert userId to ObjectId if it's a string (beginner friendly)
    let userIdObjectId;
    try {
      userIdObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    } catch (err) {
      userIdObjectId = userId; // if conversion fails, use as is
    }
    
    // try to find cart by ObjectId first, then by string
    let cart = await ShoppingCart.findOne({ userId: userIdObjectId });
    if (!cart) {
      cart = await ShoppingCart.findOne({ userId: userId });
    }
    
    // if no cart, return empty cart
    if (!cart) {
      return res.json({
        userId: userId,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        totalPrice: 0
      });
    }
    
    // recalculate totals (in case items changed)
    const totals = calculateCartTotal(cart.items);
    cart.subtotal = totals.subtotal;
    cart.shippingFee = totals.shippingFee;
    cart.totalPrice = totals.totalPrice;
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.log('Error getting cart:', err);
    res.status(500).json({ message: 'Could not get cart', error: err.message });
  }
});

// add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.body.productId || req.body.id || '';
    const productName = req.body.productName || req.body.name || '';
    const productPrice = req.body.productPrice || req.body.price || 0;
    const productImage = req.body.productImage || req.body.imageUrl || '';
    
    // parse quantity - make sure it's a number (beginner friendly)
    let quantity = req.body.quantity;
    if (quantity === undefined || quantity === null) {
      quantity = 1; // default to 1 if not provided
    } else {
      quantity = parseInt(quantity, 10); // convert to integer
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1; // if invalid, default to 1
      }
    }
    
    const selectedColor = req.body.selectedColor;
    const selectedSize = req.body.selectedSize;
    
    // log what we received (beginner friendly - see what's happening)
    console.log('Adding item to cart:', {
      userId: userId,
      productId: productId,
      productName: productName,
      productPrice: productPrice,
      quantity: quantity,
      quantityType: typeof quantity,
      rawQuantity: req.body.quantity
    });
    
    // convert userId to ObjectId if it's a string (beginner friendly)
    let userIdObjectId;
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userIdObjectId = new mongoose.Types.ObjectId(userId);
      } else {
        userIdObjectId = userId; // use as is if not valid ObjectId
      }
    } catch (err) {
      userIdObjectId = userId; // if conversion fails, use as is
    }
    
    // try to find cart by ObjectId first, then by string
    let cart = await ShoppingCart.findOne({ userId: userIdObjectId });
    if (!cart) {
      // try with string userId
      cart = await ShoppingCart.findOne({ userId: userId });
    }
    
    // if still no cart, create new one
    if (!cart) {
      console.log('Creating new cart for user:', userId);
      cart = new ShoppingCart({
        userId: userIdObjectId,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        totalPrice: 0
      });
    } else {
      console.log('Found existing cart with', cart.items.length, 'items');
    }
    
    // check if product already in cart (by productId or name)
    let foundIndex = -1;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      if (item.productId === productId.toString() || item.productName === productName) {
        foundIndex = i;
        break;
      }
    }
    
    if (foundIndex >= 0) {
      // already in cart, set quantity to the new quantity (not add)
      // this way if sync happens, it uses the exact quantity from frontend
      const oldQuantity = cart.items[foundIndex].quantity;
      
      // make sure quantity is set correctly (beginner friendly)
      cart.items[foundIndex].quantity = Number(quantity); // force to number
      // also update price in case it changed
      cart.items[foundIndex].productPrice = productPrice;
      console.log('Updated existing item quantity:', oldQuantity, '->', quantity);
      console.log('Updated item full data:', {
        productName: cart.items[foundIndex].productName,
        quantity: cart.items[foundIndex].quantity,
        quantityType: typeof cart.items[foundIndex].quantity
      });
    } else {
      // new item, add it
      // make sure quantity is a number (beginner friendly)
      const newQuantity = Number(quantity);
      cart.items.push({
        productId: productId.toString(),
        productName: productName,
        productPrice: productPrice,
        productImage: productImage,
        quantity: newQuantity, // use parsed quantity as number
        selectedColor: selectedColor,
        selectedSize: selectedSize
      });
      console.log('Added new item with quantity:', newQuantity);
      console.log('New item full data:', {
        productName: productName,
        quantity: newQuantity,
        quantityType: typeof newQuantity
      });
    }
    
    // log all items before save (beginner friendly - see what's in cart)
    console.log('Cart items before save:');
    for (let i = 0; i < cart.items.length; i++) {
      console.log('  Item', i + 1, ':', cart.items[i].productName, 'x', cart.items[i].quantity);
    }
    
    // calculate totals with shipping
    const totals = calculateCartTotal(cart.items);
    cart.subtotal = totals.subtotal;
    cart.shippingFee = totals.shippingFee;
    cart.totalPrice = totals.totalPrice;
    
    // save cart to database (beginner friendly - make sure it saves)
    try {
      await cart.save();
      console.log('✅ Cart SAVED to MongoDB successfully!');
      console.log('   User ID:', userId);
      console.log('   Items count:', cart.items.length);
      // log each item's quantity
      for (let i = 0; i < cart.items.length; i++) {
        console.log('   Item', i + 1, ':', cart.items[i].productName, 'x', cart.items[i].quantity);
      }
      console.log('   Subtotal:', cart.subtotal);
      console.log('   Shipping:', cart.shippingFee);
      console.log('   Total:', cart.totalPrice);
    } catch (saveError) {
      console.log('❌ ERROR saving cart to MongoDB:', saveError);
      console.log('   Error message:', saveError.message);
      console.log('   Error name:', saveError.name);
      throw saveError; // throw so we return error to frontend
    }
    
    res.json(cart);
  } catch (err) {
    console.log('❌ ERROR in add to cart route:', err);
    console.log('   Error message:', err.message);
    console.log('   Error stack:', err.stack);
    res.status(500).json({ message: 'Could not add to cart', error: err.message });
  }
});

// update cart item quantity
router.put('/:userId/update', async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const userId = req.params.userId;

    // convert userId to ObjectId if it's a string (beginner friendly)
    let userIdObjectId;
    try {
      userIdObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    } catch (err) {
      userIdObjectId = userId; // if conversion fails, use as is
    }

    // try to find cart by ObjectId first, then by string
    let cart = await ShoppingCart.findOne({ userId: userIdObjectId });
    if (!cart) {
      cart = await ShoppingCart.findOne({ userId: userId });
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    let itemIndex = -1;
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].productId.toString() === productId.toString()) {
        itemIndex = i;
        break;
      }
    }
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      // remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    // calculate totals with shipping
    const totals = calculateCartTotal(cart.items);
    cart.subtotal = totals.subtotal;
    cart.shippingFee = totals.shippingFee;
    cart.totalPrice = totals.totalPrice;
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.log('Error updating cart:', err);
    res.status(500).json({ message: 'Could not update cart', error: err.message });
  }
});

// remove item from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // convert userId to ObjectId if it's a string (beginner friendly)
    let userIdObjectId;
    try {
      userIdObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    } catch (err) {
      userIdObjectId = userId; // if conversion fails, use as is
    }

    // try to find cart by ObjectId first, then by string
    let cart = await ShoppingCart.findOne({ userId: userIdObjectId });
    if (!cart) {
      cart = await ShoppingCart.findOne({ userId: userId });
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // remove the item
    const newItems = [];
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].productId.toString() !== productId) {
        newItems.push(cart.items[i]);
      }
    }
    cart.items = newItems;
    
    // calculate totals with shipping
    const totals = calculateCartTotal(cart.items);
    cart.subtotal = totals.subtotal;
    cart.shippingFee = totals.shippingFee;
    cart.totalPrice = totals.totalPrice;
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    console.log('Error removing from cart:', err);
    res.status(500).json({ message: 'Could not remove from cart', error: err.message });
  }
});

// clear whole cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Clearing cart for user:', userId);
    
    // convert userId to ObjectId if it's a string (beginner friendly)
    let userIdObjectId;
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userIdObjectId = new mongoose.Types.ObjectId(userId);
      } else {
        userIdObjectId = userId;
      }
    } catch (err) {
      userIdObjectId = userId; // if conversion fails, use as is
    }
    
    // try to find cart by ObjectId first, then by string
    let cart = await ShoppingCart.findOne({ userId: userIdObjectId });
    if (!cart) {
      cart = await ShoppingCart.findOne({ userId: userId });
    }
    
    if (!cart) {
      // cart doesn't exist, return empty cart (beginner friendly)
      console.log('Cart not found, returning empty cart');
      return res.json({
        userId: userId,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        totalPrice: 0
      });
    }
    
    // clear items but keep cart (beginner friendly)
    cart.items = [];
    cart.subtotal = 0;
    cart.shippingFee = 0;
    cart.totalPrice = 0;
    
    try {
      await cart.save();
      console.log('✅ Cart cleared and saved to MongoDB');
    } catch (saveError) {
      console.log('❌ ERROR saving cleared cart:', saveError.message);
      throw saveError;
    }
    
    res.json(cart);
  } catch (err) {
    console.log('❌ ERROR clearing cart:', err);
    res.status(500).json({ message: 'Could not clear cart', error: err.message });
  }
});

export default router;

