const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const pool = require('./config/db'); // postgres pool

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// Hardcoded CORS for live frontend
app.use(cors({
  origin: [
    'https://flavornestx.onrender.com', // live frontend
    'http://localhost:5173'              // local dev
  ],
  credentials: true
}));

app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Hardcoded PORT fallback
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
