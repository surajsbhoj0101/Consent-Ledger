import express from "express";
import {
  editCompanyDetails,
  getCompanyProfile,
  uploadCompanyProfileImage,
  checkRegister,
  addSingleUser,
  fetchUsers,
  removeUser,
  updateUser,
  addMultipleUsers,
  createConsentPurpose,
  fetchConsentPurposes,
  updateConsentPurpose,
  deleteConsentPurpose,
  sendOtp,
  verifyOtp
} from "../controllers/company.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const companyRoutes = express.Router();

companyRoutes.put("/edit-company-details", requireAuth, editCompanyDetails);
companyRoutes.get("/profile", requireAuth, getCompanyProfile);
companyRoutes.post(
  "/profile-image",
  requireAuth,
  upload.single("file"),
  uploadCompanyProfileImage,
);
companyRoutes.get("/check-registered", requireAuth, checkRegister);
companyRoutes.post("/add-single-user", requireAuth, addSingleUser);
companyRoutes.get("/fetch-users", requireAuth, fetchUsers);
companyRoutes.delete("/remove-user", requireAuth, removeUser);
companyRoutes.put("/update-user", requireAuth, updateUser);
companyRoutes.post(
  "/add-multiple-users",
  requireAuth,
  upload.single("file"),
  addMultipleUsers,
);
companyRoutes.post("/consent-purposes", requireAuth, createConsentPurpose);
companyRoutes.get("/consent-purposes", requireAuth, fetchConsentPurposes);
companyRoutes.put("/consent-purposes", requireAuth, updateConsentPurpose);
companyRoutes.delete("/consent-purposes", requireAuth, deleteConsentPurpose);
companyRoutes.get("/send-otp", requireAuth, sendOtp);
companyRoutes.put("/verify-otp", requireAuth, verifyOtp);

export default companyRoutes;
