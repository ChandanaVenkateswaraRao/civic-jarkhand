import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import helmet from "helmet"; // Temporarily commented out to test CORS
import connectDB from "./config/db.js";
// import { OpenAI } from 'openai';
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Configure CORS for specific origins and methods
const corsOptions = {
  origin: ['http://localhost:3000', 'https://lambent-torrone-e48537.netlify.app'], // Allow both local and deployed frontend URLs
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

// Simple Root Route for API Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  )
);