const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const app = express();

app.use(cors({ origin: 'https://flavornestx.onrender.com' }));  // Allow frontend origin:contentReference[oaicite:5]{index=5}
app.use(express.json());
app.use('/uploads', express.static('uploads'));  // Serve uploaded images statically:contentReference[oaicite:6]{index=6}

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
