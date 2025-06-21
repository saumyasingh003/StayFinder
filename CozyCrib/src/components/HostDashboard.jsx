import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaListUl, FaBook, FaCheck, FaTimes, FaUser, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { del, get } from '../helpers/api_helper';

const HostDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostListings();
  }, []);

  const fetchHostListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await get('/listings/all');
      if (response.success) {
        // Only show listings where user is host
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        setListings(response.data.filter(l => l.host && l.host._id === userId));
      } else {
        toast.error('Failed to fetch listings');
      }
    } catch (error) {
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchHostBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await get('/bookings/host');
      if (response.success) {
        setBookings(response.data);
        setShowBookings(true);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      toast.error('Error fetching bookings');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await del(`/listings/delete/${id}`);
      toast.success('Listing deleted');
      fetchHostListings();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await put(
        `/bookings/${bookingId}/status`,
        { status }
      );
      toast.success(`Booking ${status} successfully!`);
      fetchHostBookings(); // Refresh bookings
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} booking`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <FaListUl className="mr-2 text-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Host Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/add-listing')}
            className="flex items-center justify-center bg-rose-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium w-full sm:w-auto"
          >
            <FaPlus className="mr-2" /> Add Listing
          </button>
        </div>

        {/* Bookings Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={fetchHostBookings}
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium w-full sm:w-auto"
          >
            <FaBook className="mr-2" /> View Bookings
          </button>
        </div>

        {/* Bookings Section */}
        {showBookings && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Bookings for Your Listings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      {/* Booking Info */}
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                          <img
                            src={b.listing.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                            alt={b.listing.title}
                            className="w-16 h-16 object-cover rounded-lg mb-3 sm:mb-0 sm:mr-4"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-lg flex items-center mb-1">
                              <FaUser className="mr-2 text-gray-500 flex-shrink-0" />
                              <span className="line-clamp-1">{b.user.fullName}</span>
                            </div>
                            <div className="text-gray-600 text-sm mb-1 line-clamp-1">booked {b.listing.title}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaCalendarAlt className="mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {new Date(b.from).toLocaleDateString()} - {new Date(b.to).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                          b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </div>
                        {b.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBookingStatus(b._id, 'confirmed')}
                              className="flex-1 sm:flex-none bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
                            >
                              <FaCheck className="mr-1" />
                              <span className="sm:inline">Confirm</span>
                            </button>
                            <button
                              onClick={() => handleBookingStatus(b._id, 'cancelled')}
                              className="flex-1 sm:flex-none bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                              <FaTimes className="mr-1" />
                              <span className="sm:inline">Cancel</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowBookings(false)}
              className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors w-full sm:w-auto"
            >
              Hide Bookings
            </button>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {listings.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 py-12 bg-white rounded-xl shadow-lg">
              <div className="text-4xl sm:text-6xl mb-4">🏠</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-sm sm:text-base mb-4">Click "Add Listing" to create your first property listing</p>
            </div>
          ) : (
            listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={listing.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                  alt={listing.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">{listing.title}</h3>
                  <div className="text-gray-600 mb-2 text-sm line-clamp-1 flex items-center">
                    <FaMapMarkerAlt className="mr-1 flex-shrink-0 text-xs" />
                    {listing.location}
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{listing.description}</p>
                  <div className="text-lg font-bold text-rose-600 mb-4">
                    ₹{listing.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/edit-listing/${listing._id}`)}
                      className="flex items-center justify-center bg-yellow-400 text-white px-3 py-2 rounded hover:bg-yellow-500 text-sm font-medium transition-colors"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium transition-colors"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard; 