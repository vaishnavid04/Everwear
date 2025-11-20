import mongoose from 'mongoose';

// shopping cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: false
  },
  // store product info directly (beginner friendly - works with frontend)
  productName: {
    type: String,
    required: false
  },
  productPrice: {
    type: Number,
    required: false
  },
  productImage: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    // beginner friendly - make sure quantity is saved as number
    set: function(value) {
      // convert to number when setting (beginner friendly)
      const numValue = Number(value);
      return isNaN(numValue) || numValue < 1 ? 1 : Math.floor(numValue);
    }
  },
  selectedColor: {
    type: String
  },
  selectedSize: {
    type: String
  }
});

// shopping cart schema
const shoppingCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // beginner friendly - don't throw errors on unknown fields
  strict: false,
  // save even if no changes (beginner friendly)
  timestamps: false
});

// before saving, update the timestamp (beginner friendly)
shoppingCartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // log what we're saving (beginner friendly - see what's happening)
  console.log('About to save cart:', {
    userId: this.userId,
    itemsCount: this.items.length,
    totalPrice: this.totalPrice
  });
  
  next();
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

export default ShoppingCart;


