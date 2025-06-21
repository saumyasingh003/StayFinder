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

// Database connection status
let isDbConnected = false;
let dbError = null;

// Basic routes that don't require database
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CozyCrib API is running!",
    database: isDbConnected ? "Connected" : "Connecting...",
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
        connected: isDbConnected,
        host: mongoose.connection.host || 'Not connected',
        name: mongoose.connection.name || 'Not connected',
        error: dbError
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

// Debug endpoint for connection troubleshooting
app.get("/debug", async (req, res) => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    res.json({
      success: true,
      debug: {
        mongoUriExists: !!mongoUri,
        mongoUriFormat: mongoUri ? (
          mongoUri.startsWith('mongodb+srv://') ? 'SRV Format' :
          mongoUri.startsWith('mongodb://') ? 'Standard Format' : 'Unknown Format'
        ) : 'Not Set',
        mongoUriLength: mongoUri ? mongoUri.length : 0,
        hasCredentials: mongoUri ? mongoUri.includes('@') : false,
        hasDatabase: mongoUri ? mongoUri.includes('/') && mongoUri.split('/').length > 3 : false,
        connectionState: mongoose.connection.readyState,
        isDbConnected: isDbConnected,
        dbError: dbError,
        nodeVersion: process.version,
        platform: process.platform
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Debug check failed",
      error: error.message
    });
  }
});

// Middleware to check database connection for protected routes
const requireDatabase = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable - database not connected",
      error: dbError || "Database connection in progress"
    });
  }
  next();
};

// Register routes with database requirement
app.use("/users", requireDatabase, userRoutes);
app.use("/listings", requireDatabase, listingRoutes);
app.use("/bookings", requireDatabase, bookingRoutes);
app.use("/upload", requireDatabase, uploadRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    });
    console.log("MongoDB connected");
    isDbConnected = true;
    dbError = null;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    isDbConnected = false;
    dbError = error.message;
  }
};



connectDB()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    isDbConnected = false;
    dbError = error.message;
  });


  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


export default app; 