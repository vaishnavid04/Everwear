import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// route for user registration
router.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // check if email already used
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (foundUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // make full name
    const fullName = firstName + ' ' + lastName;
    
    // create user object
    const user = new User({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: password
    });

    // save to database
    await user.save();

    // make token for login
    const secret = process.env.JWT_SECRET || 'secret-key';
    const token = jwt.sign(
      { userId: user._id },
      secret,
      { expiresIn: '7d' }
    );

    // send back user info
    res.status(201).json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      firstName: user.firstName || firstName,
      lastName: user.lastName || lastName,
      createdAt: user.createdAt,
      token: token
    });
  } catch (err) {
    console.log('Error in register:', err);
    res.status(500).json({ message: 'Could not register user', error: err.message });
  }
});

// route for user login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    // check if password matches
    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    // make token
    const secret = process.env.JWT_SECRET || 'secret-key';
    const token = jwt.sign(
      { userId: user._id },
      secret,
      { expiresIn: '7d' }
    );

    // get first and last name
    let first = user.firstName || '';
    let last = user.lastName || '';
    if (!first && user.name) {
      const nameArray = user.name.split(' ');
      first = nameArray[0] || '';
      last = nameArray.slice(1).join(' ') || '';
    }

    // send back user info
    res.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      firstName: first,
      lastName: last,
      createdAt: user.createdAt,
      token: token
    });
  } catch (err) {
    console.log('Error in login:', err);
    res.status(500).json({ message: 'Could not login', error: err.message });
  }
});

// route for logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;

