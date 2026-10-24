export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export const attachUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
  }
  next();
};
