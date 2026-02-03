import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  editConsumerDetails,
  getConsumerProfile,
  uploadConsumerProfileImage,
} from "../controllers/consumer.controller.js";
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

const consumerRoutes = express.Router();

consumerRoutes.put('/edit-consumer-details',requireAuth, editConsumerDetails);
consumerRoutes.get('/profile', requireAuth, getConsumerProfile);
consumerRoutes.post(
  '/profile-image',
  requireAuth,
  upload.single("file"),
  uploadConsumerProfileImage,
);
export default consumerRoutes;
