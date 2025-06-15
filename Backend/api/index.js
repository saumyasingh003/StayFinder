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

const mongoURI = process.env.MONGO_URI;

// Improved MongoDB connection for serverless
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB");
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Initialize database connection
connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    
    // Register routes after successful connection
    app.use("/users", userRoutes);
    app.use("/listings", listingRoutes);
    app.use("/bookings", bookingRoutes);
    app.use("/upload", uploadRoutes);

    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "CozyCrib API is running!",
        database: "Connected",
        timestamp: new Date().toISOString()
      });
    });

    // Health check endpoint
    app.get("/health", async (req, res) => {
      try {
        const dbState = mongoose.connection.readyState;
        const states = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        };

        res.json({
          success: true,
          database: {
            status: states[dbState],
            host: mongoose.connection.host,
            name: mongoose.connection.name
          },
          environment: {
            nodeEnv: process.env.NODE_ENV,
            mongoUri: process.env.MONGO_URI ? 'Set' : 'Not Set',
            jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Health check failed",
          error: error.message
        });
      }
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    
    // Fallback error handler for all routes when DB is down
    app.use("*", (req, res) => {
      res.status(503).json({
        success: false,
        message: "Service temporarily unavailable - database connection failed",
        error: "Please try again in a few moments"
      });
    });
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

export default app; 