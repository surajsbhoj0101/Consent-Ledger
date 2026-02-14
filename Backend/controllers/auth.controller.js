import jwt from "jsonwebtoken";
import User from "../models/auth/user.model.js";
import dotenv from "dotenv";
import Company from "../models/company/company.model.js";
import Consumer from "../models/consumer/consumer.model.js";

dotenv.config();

//register + login
export const register = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    console.log(decoded);
    const { role, walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address missing (frontend must send it)",
      });
    }

    const authEmail = (decoded?.email || "").trim().toLowerCase();

    let user = await User.findOne({
      "wallets.address": walletAddress.toLowerCase(),
    });

    if (!user) {
      user = await User.create({
        role: role,
        wallets: [
          {
            address: walletAddress.toLowerCase(),
            provider: getAuthProvider(decoded),
            isPrimary: true,
          },
        ],
      });

      if (role === "company") {
        await Company.create({
          userId: user._id.toString(),
          basicInformation: {
            email: authEmail,
          },
        });
      } else {
        await Consumer.create({
          userId: user._id.toString(),
          basicInformation: {
            email: authEmail,
          },
        });
      }
    }
    console.log("came for th");

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remainingSeconds = decoded.exp - nowInSeconds;

    if (remainingSeconds <= 0) {
      return res.status(401).json({ error: "Web3Auth session expired" });
    }
    const primaryWallet = user.wallets.find((w) => w.isPrimary);

    if (!primaryWallet) {
      throw new Error("Primary wallet not found");
    }

    const payload = {
      id: user._id, 
      address: primaryWallet.address.toLowerCase(),
      role: user.role,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: remainingSeconds,
    });

    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: remainingSeconds * 1000,
      path: "/",
    });
    console.log("Cookie set successfully for:", walletAddress);
    console.log("Set success");

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

function getAuthProvider(userInfo) {
  if (userInfo?.aggregateVerifier) {
    if (userInfo?.aggregateVerifier.includes("google")) {
      return "web3auth_google";
    }
    if (userInfo?.aggregateVerifier.includes("discord")) {
      return "web3auth_discord";
    }
    if (userInfo?.aggregateVerifier.includes("email")) {
      return "web3auth_email";
    }
    if(userInfo?.aggregateVerifier.includes("sms")){
      return "web3auth_mobile"
    }
  }

  return "web3auth_wallet";
}

export const getAuthData = async (req, res) => {
  try {
    const { id, role, address } = req;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    console.log("Got here for taking");
    return res.status(200).json({
      success: true,
      data: {
        userId: id,
        role,
        address,
      },
    });
  } catch (error) {
    console.error("getAuthData error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async(req, res) =>{
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success:true,
    })
  } catch (error) {
    console.error("Clear Cookie error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
