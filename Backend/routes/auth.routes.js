import express from "express";
import { register } from "../controllers/auth.controller.js";
import { getAuthData } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.get('/validate', requireAuth, getAuthData)

export default authRoutes;