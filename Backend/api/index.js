import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRoutes from "../routes/user.js";
import listingRoutes from "../routes/listings.js";
import bookingRoutes from "../routes/booking.js";
import uploadRoutes from "../routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3001;

const mongoURI =`${process.env.MONGO_URI}`;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Database connected!!");
  })
  .catch((error) => {
    console.log("Error connecting to the database:");
    console.error(error);
  });

app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello Saumya!");
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.stack,
  });
});

export default app; 