import Booking from "../models/booking.js";
import Listing from "../models/listings.js";

// POST /bookings - Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { listingId, from, to } = req.body;
    if (!listingId || !from || !to) {
      return res.status(400).json({ success: false, message: "listingId, from, and to are required" });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      from,
      to,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ success: false, message: "Failed to create booking", error: err.message });
  }
};

// GET /bookings/user - Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings", error: err.message });
  }
};

// GET /bookings/host - Get bookings for listings owned by host
export const getHostBookings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    const bookings = await Booking.find({ listing: { $in: listings.map(l => l._id) } }).populate("listing user");
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch host bookings", error: err.message });
  }
};

// PUT /bookings/:id/status - Update booking status (confirm/cancel)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status. Use 'confirmed' or 'cancelled'" });
    }

    const booking = await Booking.findById(id).populate("listing");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the current user is the host of the listing
    if (booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking, message: `Booking ${status} successfully` });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ success: false, message: "Failed to update booking status", error: err.message });
  }
}; 