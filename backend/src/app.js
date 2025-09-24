const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

const app = express();

// CORS: allow frontend origin and enable credentials
app.use(cors({
  origin: 'https://flavornestx.onrender.com',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (in-memory store)
app.use(session({
  secret: 'flavor-nest-secret',  // Hardcoded secret for simplicity
  resave: false,
  saveUninitialized: false
}));

// Serve uploaded images statically
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
