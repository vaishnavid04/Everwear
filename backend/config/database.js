import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// function to connect to mongodb
const connectDB = async () => {
  try {
    // get connection string from .env file
    const connectionString = process.env.MONGODB_URI;
    
    // check if we have connection string
    if (!connectionString) {
      console.log('ERROR: Need MongoDB connection string!');
      console.log('Put MONGODB_URI in your .env file');
      process.exit(1);
    }

    // try to connect
    console.log('Trying to connect to MongoDB...');
    console.log('Connection string (hidden password):', connectionString.replace(/:[^:@]+@/, ':****@'));
    
    // try connecting with options
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log('Could not connect to MongoDB:', err.message);
    console.log('Full error:', err.name);
    // show more details if auth error
    if (err.message.includes('auth') || err.message.includes('Authentication')) {
      console.log('\n=== AUTH ERROR TROUBLESHOOTING ===');
      console.log('1. Verify password in MongoDB Atlas -> Database Access -> Edit user');
      console.log('2. Try resetting password to: Kc3tV134LV');
      console.log('3. Make sure IP is whitelisted (you have 0.0.0.0/0, so this is OK)');
      console.log('4. Wait 1-2 minutes after password change');
      console.log('5. Check if password has special characters that need encoding');
    }
    process.exit(1);
  }
};

export default connectDB;

