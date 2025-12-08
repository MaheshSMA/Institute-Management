// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT and attach user to req.user
const protect = (req, res, next) => {
  let token;

  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { loginId, role, refId, email }
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// Restrict route to specific roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  protect,
  requireRole,
};
