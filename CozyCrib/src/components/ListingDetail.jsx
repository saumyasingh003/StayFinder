import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaChevronLeft, FaChevronRight, FaCreditCard, FaLock, FaTimes } from 'react-icons/fa';
import { get } from '../helpers/api_helper';
import { post } from '../helpers/api_helper';

const PaymentModal = ({ isOpen, onClose, bookingData, listing, totalPrice, onPaymentComplete }) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    if (formattedValue.length <= 5) {
      setExpiryDate(formattedValue);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast.error('Please fill in all card details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number');
      return;
    }

    setPaymentLoading(true);

    setTimeout(async () => {
      try {
        await onPaymentComplete();
        setPaymentLoading(false);
        onClose();
      } catch (error) {
        setPaymentLoading(false);
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FaCreditCard className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FaLock className="w-3 h-3 mr-1" />
                <span>Powered by Stripe</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{listing?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{new Date(bookingData.from).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{new Date(bookingData.to).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-800">Total Amount:</span>
              <span className="font-bold text-lg text-rose-600">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <FaLock className="text-blue-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Your payment is secure</p>
                  <p className="text-blue-600">This is a demo payment form. No actual charges will be made.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={paymentLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {paymentLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <FaLock className="w-4 h-4" />
                  <span>Complete Payment ₹{totalPrice}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    from: '',
    to: ''
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchListingDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchListingDetail = async () => {
    try {
      const response = await get(`/listings/view/${id}`);
      if (response.data.success) {
        setListing(response.data.data);
      } else {
        toast.error('Listing not found');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Error fetching listing details');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!bookingData.from || !bookingData.to) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await post(
        '/bookings',
        {
          listingId: id,
          from: bookingData.from,
          to: bookingData.to
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Booking and payment completed successfully!');
        setBookingData({ from: '', to: '' });
        setShowPaymentModal(false);
      } else {
        toast.error('Booking failed');
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed');
      throw error;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const calculateDays = () => {
    if (bookingData.from && bookingData.to) {
      const fromDate = new Date(bookingData.from);
      const toDate = new Date(bookingData.to);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const totalPrice = calculateDays() * (listing?.pricePerNight || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing not found</h2>
          <button 
            onClick={() => navigate('/home')}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaChevronLeft className="mr-2" />
            Back to listings
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{listing.location}</span>
            <div className="flex items-center ml-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span>4.8 (123 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src={listing.images[currentImageIndex] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>
              
              {listing.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-rose-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <FaWifi className="text-rose-500 mr-3" />
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center">
                  <FaParking className="text-rose-500 mr-3" />
                  <span>Free Parking</span>
                </div>
                <div className="flex items-center">
                  <FaSwimmingPool className="text-rose-500 mr-3" />
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center">
                  <FaDumbbell className="text-rose-500 mr-3" />
                  <span>Gym</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg lg:sticky lg:top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">₹{listing.pricePerNight}</span>
                    <span className="text-gray-500 ml-1">/ night</span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBooking}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={bookingData.from}
                      onChange={(e) => setBookingData({ ...bookingData, from: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={bookingData.to}
                      onChange={(e) => setBookingData({ ...bookingData, to: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {calculateDays() > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span>₹{listing.pricePerNight} × {calculateDays()} nights</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <FaCreditCard className="w-4 h-4" />
                  <span>Reserve & Pay</span>
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={bookingData}
        listing={listing}
        totalPrice={totalPrice}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default ListingDetail; 