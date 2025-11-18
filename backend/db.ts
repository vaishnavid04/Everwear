import mongoose from 'mongoose';

export default async function mongooseConnect() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in environment');
  await mongoose.connect(uri, {
    // options if needed
  });
  console.log('Connected to MongoDB');
  return mongoose.connection;
}
