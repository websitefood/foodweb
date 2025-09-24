const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const recipesFile = path.join(__dirname, '../data/recipes.json');

// Helpers to read/write JSON
function readRecipes() {
  return JSON.parse(fs.readFileSync(recipesFile));
}
function writeRecipes(data) {
  fs.writeFileSync(recipesFile, JSON.stringify(data, null, 2));
}

exports.getAll = (req, res) => {
  const recipes = readRecipes();
  if (req.query.featured) {
    return res.json(recipes.filter(r => r.featured));
  }
  res.json(recipes);
};

exports.getOne = (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  // Increment view count for analytics
  recipe.views = (recipe.views || 0) + 1;
  writeRecipes(recipes);
  res.json(recipe);
};

exports.create = (req, res) => {
  const { title, description, difficulty, time, servings, ingredients, steps } = req.body;
  const recipes = readRecipes();
  let imageUrl = '';
  if (req.file) {
    imageUrl = `/images/${req.file.filename}`;
  }
  const newRecipe = {
    id: uuidv4(), title, description, difficulty,
    time: parseInt(time), servings: parseInt(servings),
    ingredients: ingredients.split('\n'),
    steps: steps.split('\n'),
    imageUrl, views: 0, featured: false, ratings: []
  };
  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json(newRecipe);
};

exports.update = (req, res) => {
  const recipes = readRecipes();
  const idx = recipes.findIndex(r => r.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Recipe not found' });
  const recipe = recipes[idx];
  Object.assign(recipe, req.body);
  writeRecipes(recipes);
  res.json(recipe);
};

exports.delete = (req, res) => {
  let recipes = readRecipes();
  recipes = recipes.filter(r => r.id !== req.params.id);
  writeRecipes(recipes);
  res.json({ message: 'Recipe deleted' });
};

exports.like = (req, res) => {
  // Toggle like for current user
  const likesFile = path.join(__dirname, '../data/likes.json');
  let likes = JSON.parse(fs.readFileSync(likesFile));
  const userId = req.session.user.id;
  const recipeId = req.params.id;
  const index = likes.findIndex(l => l.userId === userId && l.recipeId === recipeId);
  let userHasLiked;
  if (index >= 0) {
    likes.splice(index, 1);
    userHasLiked = false;
  } else {
    likes.push({ id: uuidv4(), userId, recipeId });
    userHasLiked = true;
  }
  fs.writeFileSync(likesFile, JSON.stringify(likes, null, 2));
  const count = likes.filter(l => l.recipeId === recipeId).length;
  res.json({ count, userHasLiked });
};

exports.getLikes = (req, res) => {
  const likesFile = path.join(__dirname, '../data/likes.json');
  let likes = JSON.parse(fs.readFileSync(likesFile));
  const recipeId = req.params.id;
  const count = likes.filter(l => l.recipeId === recipeId).length;
  const userHasLiked = likes.some(l => l.recipeId === recipeId && l.userId === req.session.user.id);
  res.json({ count, userHasLiked });
};
