const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const commentsFile = path.join(__dirname, '../data/comments.json');

function readComments() {
  return JSON.parse(fs.readFileSync(commentsFile));
}
function writeComments(data) {
  fs.writeFileSync(commentsFile, JSON.stringify(data, null, 2));
}

exports.getByRecipe = (req, res) => {
  const comments = readComments();
  const recipeComments = comments.filter(c => c.recipeId === req.query.recipeId);
  res.json(recipeComments);
};

exports.create = (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Login required' });
  const { recipeId, text, rating } = req.body;
  const comments = readComments();
  const newComment = {
    id: uuidv4(),
    recipeId,
    userId: req.session.user.id,
    username: req.session.user.username,
    text,
    rating: parseInt(rating),
    date: new Date().toISOString()
  };
  comments.push(newComment);
  writeComments(comments);
  res.status(201).json(newComment);
};

exports.delete = (req, res) => {
  let comments = readComments();
  comments = comments.filter(c => c.id !== req.params.id);
  writeComments(comments);
  res.json({ message: 'Comment deleted' });
};
