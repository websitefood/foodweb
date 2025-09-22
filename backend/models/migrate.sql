-- models/migrate.sql
-- Run this SQL once to create the tables

-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- recipes
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  short TEXT,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  photos TEXT[],           -- array of URLs / paths
  prep INTEGER,
  cook INTEGER,
  tags TEXT,
  rating NUMERIC DEFAULT 0,
  difficulty TEXT,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- likes
CREATE TABLE IF NOT EXISTS likes (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, user_id)
);

-- saved_recipes (optional)
CREATE TABLE IF NOT EXISTS saved_recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);
