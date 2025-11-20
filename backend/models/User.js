import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// this is the user model for the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hash the password before we save it to database
userSchema.pre('save', async function(next) {
  // if password is not changed, just continue
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // make salt for hashing
    const salt = await bcrypt.genSalt(10);
    // hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// function to check if password is correct
userSchema.methods.checkPassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

