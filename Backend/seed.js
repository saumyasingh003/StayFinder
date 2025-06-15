import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Listing from "./models/listings.js";
import Booking from "./models/booking.js";
import bcrypt from "bcrypt";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const usersData = [
  {
    fullName: "Alice Host",
    email: "alice@host.com",
    password: "password123",
    role: "host",
  },
  {
    fullName: "Bob Guest",
    email: "bob@guest.com",
    password: "password123",
    role: "user",
  },
];

const listingsData = [
  {
    title: "Cozy Apartment in Mumbai",
    location: "Bandra, Mumbai",
    description: "A cozy 1BHK apartment in the heart of Mumbai.",
    pricePerNight: 1800,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
    ],
    availableDates: [
      { from: new Date("2025-07-01"), to: new Date("2025-07-10") },
      { from: new Date("2025-08-01"), to: new Date("2025-08-15") }
    ]
  },
  {
    title: "Modern Flat in Bangalore",
    location: "Indiranagar, Bangalore",
    description: "A modern 2BHK flat with all amenities.",
    pricePerNight: 2500,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
    ],
    availableDates: [
      { from: new Date("2025-06-20"), to: new Date("2025-06-30") }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Booking.deleteMany();
    await Listing.deleteMany();
    await User.deleteMany();

    // Create users
    const hashedUsers = await Promise.all(usersData.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    })));
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Users seeded");

    // Assign host to listings
    listingsData[0].host = createdUsers[0]._id;
    listingsData[1].host = createdUsers[0]._id;
    const createdListings = await Listing.insertMany(listingsData);
    console.log("Listings seeded");

    // Create a booking
    await Booking.create({
      user: createdUsers[1]._id,
      listing: createdListings[0]._id,
      from: new Date("2025-07-02"),
      to: new Date("2025-07-05"),
      status: "confirmed"
    });
    console.log("Bookings seeded");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed(); 