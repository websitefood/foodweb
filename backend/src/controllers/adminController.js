const recipesController = require('./recipesController');
const commentsController = require('./commentsController');
const fs = require('fs');
const path = require('path');
const recipesFile = path.join(__dirname, '../data/recipes.json');
const commentsFile = path.join(__dirname, '../data/comments.json');

exports.getRecipes = (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(recipesFile));
  res.json(recipes);
};

exports.getComments = (req, res) => {
  const comments = JSON.parse(fs.readFileSync(commentsFile));
  res.json(comments);
};

exports.deleteRecipe = recipesController.delete;
exports.deleteComment = commentsController.delete;
