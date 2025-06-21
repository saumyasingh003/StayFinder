import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { get } from '../helpers/api_helper';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your bookings');
        return;
      }
      const response = await get('/bookings/user');
      if (response.success) {
        setBookings(response.data);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center mb-6 sm:mb-8">
            <FaHome className="mr-3 text-rose-500 text-xl sm:text-2xl" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Bookings</h1>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <FaCalendarAlt className="mx-auto text-4xl sm:text-6xl mb-4 text-gray-400" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
              <p className="text-gray-600">You haven't made any bookings yet. Start exploring properties!</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {bookings.map((b) => (
                <div key={b._id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Details */}
                    <div className="flex flex-col sm:flex-row sm:items-start mb-4 lg:mb-0 lg:flex-1">
                      <img
                        src={b.listing.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                        alt={b.listing.title}
                        className="w-full sm:w-20 sm:h-20 lg:w-24 lg:h-24 h-48 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-2 line-clamp-2">
                          {b.listing.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm sm:text-base mb-2">
                          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{b.listing.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm sm:text-base">
                          <FaCalendarAlt className="mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {new Date(b.from).toLocaleDateString()} - {new Date(b.to).toLocaleDateString()}
                          </span>
                        </div>
                        {/* Price */}
                        <div className="mt-2 sm:mt-3">
                          <span className="text-lg sm:text-xl font-bold text-rose-600">
                            ₹{b.listing.pricePerNight}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">/ night</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center lg:justify-end">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium text-center min-w-[100px] ${
                        b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings; 