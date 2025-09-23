const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// CORS
app.use(cors({
  origin: [
    'https://flavornestx.onrender.com',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Default 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
