import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }                                                                                 

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};
