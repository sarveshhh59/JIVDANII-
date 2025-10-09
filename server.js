const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection (Use Atlas or Render env variable)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jivdanii';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ✅ User Model
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
}));

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// ✅ Registration Route
app.post('/register', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      email: req.body.email?.trim().toLowerCase()
    };
    await new User(userData).save();
    console.log('✅ New user registered:', userData.email);
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

// ✅ Start Server (Render-compatible)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
