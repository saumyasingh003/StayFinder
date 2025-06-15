import express from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/all", getAllListings);

router.get("/view/:id", getListingById);

router.post("/add", protect, createListing);

router.put("/update/:id", protect, updateListing);

router.delete("/delete/:id", protect, deleteListing);

export default router;
