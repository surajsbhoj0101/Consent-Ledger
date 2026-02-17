import jwt from "jsonwebtoken";
import User from "../models/auth/user.model.js";
import dotenv from "dotenv";
import Company from "../models/company/company.model.js";
import Consumer from "../models/consumer/consumer.model.js";

dotenv.config();

const USER_ROLES = new Set(["consumer", "company"]);

const normalizeEmail = (value) => (value || "").trim().toLowerCase();
const normalizeLower = (value) => (value || "").trim().toLowerCase();
const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");

const extractAuthIdentity = (decodedToken) => {
  const emailFromToken = normalizeEmail(decodedToken?.email);
  const verifierId = normalizeLower(decodedToken?.verifierId);
  const fallbackEmail = looksLikeEmail(verifierId) ? verifierId : "";

  return {
    email: emailFromToken || fallbackEmail,
    verifier: normalizeLower(decodedToken?.verifier),
    verifierId,
    authConnectionId: decodedToken?.authConnectionId || "",
    aggregateVerifier: decodedToken?.aggregateVerifier || "",
    groupedAuthConnectionId: decodedToken?.groupedAuthConnectionId || "",
    web3AuthUserId: decodedToken?.userId || "",
  };
};

const ensureRoleDocument = async (user, email) => {
  const normalizedEmail = normalizeEmail(email);
  const basicInformation = hasValue(normalizedEmail)
    ? { email: normalizedEmail }
    : {};

  if (user.role === "company") {
    const existingCompany = await Company.findOne({ userId: user._id.toString() });
    if (!existingCompany) {
      await Company.create({
        userId: user._id.toString(),
        basicInformation,
      });
    }
    return;
  }

  const existingConsumer = await Consumer.findOne({ userId: user._id.toString() });
  if (!existingConsumer) {
    await Consumer.create({
      userId: user._id.toString(),
      basicInformation,
    });
  }
};

//register + login
export const register = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const { role, walletAddress } = req.body;

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    if (!USER_ROLES.has(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address missing (frontend must send it)",
      });
    }

    const normalizedWalletAddress = walletAddress.toLowerCase();
    const provider = getAuthProvider(decoded);
    const identity = extractAuthIdentity(decoded);

    let user = await User.findOne({
      "wallets.address": normalizedWalletAddress,
    });

    if (!user && hasValue(identity.email)) {
      user = await User.findOne({ email: identity.email });
    }

    if (!user && hasValue(identity.verifier) && hasValue(identity.verifierId)) {
      user = await User.findOne({
        verifier: identity.verifier,
        verifierId: identity.verifierId,
      });
    }

    if (!user) {
      user = await User.create({
        role: role,
        email: identity.email || undefined,
        verifier: identity.verifier || undefined,
        verifierId: identity.verifierId || undefined,
        authConnectionId: identity.authConnectionId || undefined,
        aggregateVerifier: identity.aggregateVerifier || undefined,
        groupedAuthConnectionId: identity.groupedAuthConnectionId || undefined,
        web3AuthUserId: identity.web3AuthUserId || undefined,
        wallets: [
          {
            address: normalizedWalletAddress,
            provider,
            isPrimary: true,
          },
        ],
      });
    } else {
      if (user.role !== role) {
        return res.status(409).json({
          success: false,
          message: `This account is already registered as ${user.role}`,
        });
      }

      const hasWalletLinked = user.wallets.some(
        (wallet) => wallet.address === normalizedWalletAddress,
      );

      if (!hasWalletLinked) {
        user.wallets.push({
          address: normalizedWalletAddress,
          provider,
          isPrimary: user.wallets.length === 0,
        });
      }

      if (!user.email && hasValue(identity.email)) {
        user.email = identity.email;
      }

      if (!user.verifier && hasValue(identity.verifier)) {
        user.verifier = identity.verifier;
      }

      if (!user.verifierId && hasValue(identity.verifierId)) {
        user.verifierId = identity.verifierId;
      }

      if (!user.authConnectionId && hasValue(identity.authConnectionId)) {
        user.authConnectionId = identity.authConnectionId;
      }

      if (!user.aggregateVerifier && hasValue(identity.aggregateVerifier)) {
        user.aggregateVerifier = identity.aggregateVerifier;
      }

      if (
        !user.groupedAuthConnectionId &&
        hasValue(identity.groupedAuthConnectionId)
      ) {
        user.groupedAuthConnectionId = identity.groupedAuthConnectionId;
      }

      if (!user.web3AuthUserId && hasValue(identity.web3AuthUserId)) {
        user.web3AuthUserId = identity.web3AuthUserId;
      }

      await user.save();
    }

    await ensureRoleDocument(user, identity.email);

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
