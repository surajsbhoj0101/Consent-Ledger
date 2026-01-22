import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { editConsumerDetails } from "../controllers/consumer.controller.js";

const consumerRoutes = express.Router();

consumerRoutes.put('/edit-consumer-details',requireAuth, editConsumerDetails);
export default consumerRoutes;