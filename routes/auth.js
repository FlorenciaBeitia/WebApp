const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load JWT secret from env
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Register endpoint (convenience for testing). Hashes password with bcrypt.
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, phone, dob } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    // Check if user exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'username already taken' });

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, password: hashed, email, phone, dob });
  await user.save();

  // Return the created user's id (ObjectId). Password is not returned.
  res.status(201).json({ message: 'User registered', id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint. Returns JWT on success.
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // Build token payload and sign
    const payload = { sub: user._id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
