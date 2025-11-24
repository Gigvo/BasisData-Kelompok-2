const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
module.exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user has specific role
module.exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send({ message: "Access forbidden. Insufficient permissions." });
    }

    next();
  };
};
