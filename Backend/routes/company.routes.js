import express from "express"
import { editCompanyDetails } from "../controllers/company.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const companyRoutes = express.Router();

companyRoutes.put('/edit-company-details', requireAuth, editCompanyDetails);

export default companyRoutes;