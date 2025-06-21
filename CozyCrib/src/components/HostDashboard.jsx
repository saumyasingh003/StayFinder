import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaListUl, FaBook, FaCheck, FaTimes, FaUser, FaCalendarAlt } from 'react-icons/fa';
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
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="text-3xl font-bold text-gray-800 flex items-center"><FaListUl className="mr-2" /> Host Dashboard</div>
          <button
            onClick={() => navigate('/add-listing')}
            className="flex items-center bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
          >
            <FaPlus className="mr-2" /> Add Listing
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={fetchHostBookings}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <FaBook className="mr-2" /> View Bookings
          </button>
        </div>

        {showBookings ? (
          <div className="bg-white rounded-xl p-6 shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">Bookings for Your Listings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <img
                          src={b.listing.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                          alt={b.listing.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="font-semibold text-lg flex items-center">
                            <FaUser className="mr-2 text-gray-500" />
                            {b.user.fullName}
                          </div>
                          <div className="text-gray-600">booked {b.listing.title}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            {new Date(b.from).toLocaleDateString()} - {new Date(b.to).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center"
                          >
                            <FaCheck className="mr-1" />
                            Confirm
                          </button>
                          <button
                            onClick={() => handleBookingStatus(b._id, 'cancelled')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center"
                          >
                            <FaTimes className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowBookings(false)}
              className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Hide Bookings
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">No listings found. Click "Add Listing" to create one.</div>
          ) : (
            listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
                <img
                  src={listing.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{listing.title}</h3>
                <div className="text-gray-600 mb-2">{listing.location}</div>
                <div className="flex-1 text-gray-500 text-sm mb-4">{listing.description}</div>
                <div className="flex items-center justify-between mt-auto">
                  <button
                    onClick={() => navigate(`/edit-listing/${listing._id}`)}
                    className="flex items-center bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
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