import express from "express";
import { editCompanyDetails } from "../controllers/company.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { checkRegister } from "../controllers/company.controller.js";
import { addSingleUser } from "../controllers/company.controller.js";
import { fetchUsers } from "../controllers/company.controller.js";
import { removeUser } from "../controllers/company.controller.js";
import { updateUser } from "../controllers/company.controller.js";
import { addMultipleUsers } from "../controllers/company.controller.js";
import multer from "multer";
import path from "path"

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

export default companyRoutes;
