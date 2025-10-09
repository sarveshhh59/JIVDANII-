const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection (Atlas via Render)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ✅ User Schema & Model
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
}));

// ✅ Order Schema & Model
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  details: String
}));

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// ✅ Registration Route with Duplicate Check
app.post('/register', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please login instead.' });
    }

    // Save new user
    const userData = { ...req.body, email };
    await new User(userData).save();
    console.log('✅ New user registered:', email);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    console.log('🔐 Login attempt:', email);

    const user = await User.findOne({ email, password });
    console.log('🔍 User found:', !!user);

    if (user) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Order Route
app.post('/order', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      email: req.body.email?.trim().toLowerCase()
    };
    await new Order(orderData).save();
    console.log('📦 New order received from:', orderData.email);
    res.json({ message: 'Order received' });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ message: 'Order failed' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
