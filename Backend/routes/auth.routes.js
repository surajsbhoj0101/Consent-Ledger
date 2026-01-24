import express from "express";
import { register } from "../controllers/auth.controller.js";
import { getAuthData } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { logout } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.get('/validate', requireAuth, getAuthData);
authRoutes.get('/logout',logout);

export default authRoutes;