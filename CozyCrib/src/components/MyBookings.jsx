import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaCalendarAlt, FaHome } from 'react-icons/fa';

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
      const response = await axios.get('http://localhost:8000/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookings(response.data.data);
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <FaHome className="mr-2" /> My Bookings
        </div>
        {bookings.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <FaCalendarAlt className="mx-auto text-4xl mb-2 text-gray-400" />
            <p>No bookings found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((b) => (
              <li key={b._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <img
                    src={b.listing.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    alt={b.listing.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{b.listing.title}</div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaMapMarkerAlt className="mr-1" /> {b.listing.location}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {new Date(b.from).toLocaleDateString()} - {new Date(b.to).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 