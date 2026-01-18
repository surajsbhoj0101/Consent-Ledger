import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // DEV MODE: decode only (Web3Auth already authenticated)
    const decoded = jwt.decode(token);
    console.log(decoded)

    if (!decoded?.userId || !decoded?.email) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: "Role required" });
    }

    let user = await User.findById(decoded.userId);

    if (!user) {
      user = await User.create({
        _id: decoded.userId,
        role,
        email: decoded.email,
        name: decoded.name,
        profileImage: decoded.profileImage,
        walletAddress: null,
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        walletAddress: user.walletAddress,
      },
    });

  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
