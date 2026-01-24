import express from "express"
import { editCompanyDetails } from "../controllers/company.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { checkRegister } from "../controllers/company.controller.js";

const companyRoutes = express.Router();

companyRoutes.put('/edit-company-details', requireAuth, editCompanyDetails);
companyRoutes.get('/check-registered', requireAuth, checkRegister);

export default companyRoutes;