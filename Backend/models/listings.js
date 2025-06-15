import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  images: [String],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  availableDates: [
    {
      from: Date,
      to: Date,
    },
  ],
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
