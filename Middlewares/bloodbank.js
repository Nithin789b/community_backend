import jwt from "jsonwebtoken";

export const bloodBankAuth = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Remove "Bearer " prefix
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.bloodBank = decoded; 

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
