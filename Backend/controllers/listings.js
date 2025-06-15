import Listing from "../models/listings.js";

// GET /listings/all - Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate("host", "name email");
    res.status(200).json({ success: true, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /listings/view/:id - Get a single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("host", "name email");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// POST /listings/add - Create a new listing
export const createListing = async (req, res) => {
  try {
    const { title, location, description, pricePerNight, images, availableDates } = req.body;

    // Validate required fields
    if (!title || !location || !pricePerNight) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: title, location, and pricePerNight are required" 
      });
    }

    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required to create listing" 
      });
    }

    const listing = await Listing.create({
      title,
      location,
      description,
      pricePerNight,
      images,
      availableDates,
      host: req.user._id,
    });

    const populated = await listing.populate("host", "name email");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("Error creating listing:", err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ success: false, message: "Failed to create listing", error: err.message });
  }
};

// PUT /listings/update/:id - Update listing
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update listing" });
  }
};

// DELETE /listings/delete/:id - Delete listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await listing.deleteOne();
    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete listing" });
  }
};
