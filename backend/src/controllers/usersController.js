const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const usersFile = path.join(__dirname, '../data/users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile));
}
function writeUsers(data) {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

exports.signup = (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username exists' });
  }
  const newUser = { id: uuidv4(), username, password, isAdmin: false };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'User created' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Store user info in session
  req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
  res.json({ message: 'Login successful' });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};

exports.profile = (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.session.user);
};

// Favorites (simple implementation using a favorites.json can be added if needed)
exports.getFavorites = (req, res) => {
  // For simplicity, treat likes as favorites
  const favFile = path.join(__dirname, '../data/likes.json');
  let likes = JSON.parse(fs.readFileSync(favFile));
  const userLikes = likes.filter(l => l.userId === req.session.user.id);
  res.json(userLikes.map(l => l.recipeId));
};
