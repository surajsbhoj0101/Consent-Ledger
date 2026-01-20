import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
   console.log("Raw cookies header:", req.headers.cookie);
console.log("Parsed cookies:", req.cookies);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.id = decoded.id;
    req.address = decoded.address;
    req.role = decoded.role;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
