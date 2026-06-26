const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

/**
 * verifyToken — reads JWT from the httpOnly cookie "authToken".
 * Attaches decoded payload to req.user: { id, email, role }
 */
const verifyToken = (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return error(res, "Unauthorized — no auth cookie found.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return error(res, "Unauthorized — invalid or expired token.", 401);
  }
};

module.exports = { verifyToken };
