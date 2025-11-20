import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// get all products from database (need to be logged in)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    console.log('Error getting products:', err);
    res.status(500).json({ message: 'Could not get products', error: err.message });
  }
});

// get one product by id (need to be logged in)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.log('Error getting product:', err);
    res.status(500).json({ message: 'Could not get product', error: err.message });
  }
});

// add new product to database (need to be logged in)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const salePrice = req.body.salePrice;
    const category = req.body.category;
    const imageUrl = req.body.imageUrl;
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const stockCount = req.body.stockCount || 0;

    const product = new Product({
      name: name,
      description: description,
      price: price,
      salePrice: salePrice,
      category: category,
      imageUrl: imageUrl,
      colors: colors,
      sizes: sizes,
      stockCount: stockCount
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log('Error creating product:', err);
    res.status(500).json({ message: 'Could not create product', error: err.message });
  }
});

export default router;

