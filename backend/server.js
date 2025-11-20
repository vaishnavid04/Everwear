import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// import all the route files
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import chatbotRoutes from './routes/chatbot.js';

// load .env file
dotenv.config();

// make express app
const app = express();

// connect to mongodb
connectDB();

// allow frontend to talk to backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// so we can read json from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// api info route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Everwear Backend API',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      chatbot: '/api/chatbot'
    }
  });
});

// use the routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chatbot', chatbotRoutes);

// if something goes wrong
app.use((err, req, res, next) => {
  console.log('Error happened:', err);
  res.status(500).json({ 
    message: 'Something broke!', 
    error: err.message 
  });
});

// start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server started on port ' + port);
  console.log('API is at http://localhost:' + port + '/api');
});

