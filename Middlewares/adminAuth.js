import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; 

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1] // take second part
      : authHeader; // if user directly sends token

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }

    req.admin = decoded; // save admin info in req
    next();

  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

