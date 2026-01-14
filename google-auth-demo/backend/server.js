require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'default_secret', process.env.COOKIE_KEY_2 || 'default_secret_2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Routes
app.get('/', (req, res) => {
  res.send(`Local Auth Server Running on Port ${PORT}`);
});

// Auth Routes

// REGISTER
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.run(sql, [email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                     return res.status(400).json({ success: false, message: 'Email already exists' });
                }
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.status(201).json({ success: true, message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// LOGIN
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
         return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Set session
                req.session.user = { id: user.id, email: user.email };
                res.status(200).json({ success: true, message: 'Login successful', user: { email: user.email } });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
             res.status(500).json({ success: false, message: 'Server error' });
        }
    });
});

// CHECK SESSION
app.get('/auth/login/success', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.session.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
});

// LOGOUT
app.post('/auth/logout', (req, res) => {
  req.session = null;
  res.status(200).json({ success: true, message: 'Logged out' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
