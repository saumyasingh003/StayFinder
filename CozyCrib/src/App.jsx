import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./components/Landing";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Listings from "./components/Listings";
import Footer from "./components/Footer";
import HostDashboard from "./components/HostDashboard";
import ListingForm from "./components/ListingForm";
import ListingDetail from "./components/ListingDetail";
import MyBookings from "./components/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isLandingPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/listing/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
        
        <Route 
          path="/host-dashboard" 
          element={<ProtectedRoute requiredRole="host"><HostDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/add-listing" 
          element={<ProtectedRoute requiredRole="host"><ListingForm /></ProtectedRoute>} 
        />
        <Route 
          path="/edit-listing/:id" 
          element={<ProtectedRoute requiredRole="host"><ListingForm /></ProtectedRoute>} 
        />

        <Route 
          path="/my-bookings" 
          element={<ProtectedRoute requiredRole="user"><MyBookings /></ProtectedRoute>} 
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isLandingPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
