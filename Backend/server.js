import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import companyRoutes from "./routes/company.routes.js";
import consumerRoutes from "./routes/consumer.routes.js";
const app = express();

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use('/uploads', express.static('uploads'));


connectDB();
// routes
app.use("/api/auth", authRoutes);

app.use("/api/company",companyRoutes);

app.use('/api/consumer',consumerRoutes)

const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
