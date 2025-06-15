import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import banner from '../assets/banner.webp';
import { FaSearch, FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, priceFilter]);

  const fetchListings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/listings/all');
      if (response.data.success) {
        setListings(response.data.data);
      } else {
        toast.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter) {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(listing => listing.pricePerNight < 2000);
          break;
        case 'medium':
          filtered = filtered.filter(listing => listing.pricePerNight >= 2000 && listing.pricePerNight <= 3000);
          break;
        case 'high':
          filtered = filtered.filter(listing => listing.pricePerNight > 3000);
          break;
        default:
          break;
      }
    }

    setFilteredListings(filtered);
  };

  const PropertyCard = ({ listing }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="relative">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <FaHeart className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{listing.title}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 text-sm mr-1" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-sm mr-1" />
          <span className="text-sm">{listing.location}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-800">₹{listing.pricePerNight}</span>
            <span className="text-sm text-gray-500 ml-1">/ night</span>
          </div>
          <Link
            to={`/listing/${listing._id}`}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Original Banner and Images Section */}
      <div className="mt-24 px-4 mb-12">
        {/* Full width banner image */}
        <img
          src={banner}
          alt="Banner"
          className="w-full h-72 object-cover rounded-lg shadow-lg mb-8 hover:opacity-90 transition-opacity"
        />

        {/* Grid of 2 images (2x1 layout) */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <img
            src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1470&auto=format&fit=crop"
            alt="Cozy Interior"
            className="w-full h-60 object-cover rounded-lg shadow-md hover:opacity-90 transition-opacity"
          />
          <img
            src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1470&auto=format&fit=crop"
            alt="Modern Living"
            className="w-full h-60 object-cover rounded-lg shadow-md bg-center hover:opacity-90 transition-opacity"
          />
        </div> */}
      </div>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl mb-8">Discover unique homes and experiences around the world</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-full shadow-lg p-2 flex items-center">
            <div className="flex-1 flex items-center px-4">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search destinations, properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 text-gray-700 outline-none"
              />
            </div>
            <div className="border-l border-gray-300 px-4">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="p-3 text-gray-700 outline-none bg-transparent"
              >
                <option value="">All Prices</option>
                <option value="low">Under ₹2,000</option>
                <option value="medium">₹2,000 - ₹3,000</option>
                <option value="high">Above ₹3,000</option>
              </select>
            </div>
            <button className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {searchTerm || priceFilter ? 'Search Results' : 'Featured Properties'}
          </h2>
          <span className="text-gray-600">
            {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
          </span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <PropertyCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
