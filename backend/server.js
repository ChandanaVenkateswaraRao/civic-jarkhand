import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// import { classifyImage } from "./controllers/aiController.js"; // <-- use classifyImage
import { classifyAndSaveImage } from "./controllers/aiController.js"; 
// import upload from "./upload.js";
import upload from "./upload.js";

dotenv.config();
connectDB();

const app = express();

// --- Middlewares ---
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow frontend (3000) to fetch images from backend (5000)
  })
);
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

// AI classification endpoint
// Note: classifyImage deletes the uploaded temp file after classification.
// If you want to KEEP the image for reports, handle saving in reportRoutes instead.
app.post("/api/classify", upload.single("image"), classifyAndSaveImage);

// --- Static Folder for Uploads ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Root Test Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  )
);
