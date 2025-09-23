// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const pool = require('./config/db'); // postgres pool

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// Ensure uploads folder exists (prevents write errors)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS setup with your frontend
app.use(cors({
  origin: [
    'https://flavornestx.onrender.com', // live frontend
    'http://localhost:5173'              // local dev
  ],
  credentials: true
}));

app.use(express.json());

// === Temporary root route for healthcheck / debugging ===
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Static uploads
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Basic error handler (so server doesn't crash silently)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
