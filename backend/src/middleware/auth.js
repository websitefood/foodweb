exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) next();
  else res.status(401).json({ message: 'Not authenticated' });
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) next();
  else res.status(403).json({ message: 'Not authorized' });
};
