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

const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");
const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]).map((origin) => normalizeOrigin(origin.trim()))
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients without Origin (curl/postman/server-to-server).
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(normalizeOrigin(origin))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
