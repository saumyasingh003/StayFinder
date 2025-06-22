import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaHome, FaBuilding, FaCalendarCheck, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  let role = null;
  let fullName = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
      fullName = localStorage.getItem('fullName');
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getNavLinks = () => {
    const links = [
      { to: "/home", label: "Home", icon: FaHome, show: true }
    ];

    if (token) {
      if (role === 'host') {
        links.push(
          { to: "/host-dashboard", label: "Dashboard", icon: FaBuilding, show: true }
        );
      } else {
        links.push(
          { to: "/my-bookings", label: "My Bookings", icon: FaCalendarCheck, show: true }
        );
      }
    }

    return links.filter(link => link.show);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to='/' className="text-xl sm:text-2xl font-bold tracking-wide font-serif italic hover:text-gray-200 transition-colors">
            StayFinder
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <div className="flex space-x-4 lg:space-x-6">
              {getNavLinks().map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.to
                        ? 'bg-white bg-opacity-20 text-gray-700'
                        : 'hover:bg-white hover:bg-opacity-10 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {!token ? (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-white bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:text-rose-600 transform hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span className="hidden lg:inline">Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-rose-50 hover:text-gray-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  <FaUserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign Up</span>
                </Link>
              </div>
            ) : (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 hover:border-white/50 font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  <FaUser className="w-4 h-4 text-white" />
                  <span className="hidden lg:block text-white">{fullName || 'User'}</span>
                  <span className="text-xs text-white ml-1">▾</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900">{fullName || 'User'}</p>
                      <p className="text-xs text-gray-600 capitalize mt-1 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {role} Account
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mt-2 mb-4 py-4 border border-white/20">
            <div className="flex flex-col space-y-2">
              {getNavLinks().map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.to
                        ? 'bg-white/20 text-white'
                        : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-white/20 mt-4 pt-4">
                {!token ? (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-white bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:text-rose-600 transition-all duration-200"
                    >
                      <FaSignInAlt className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-rose-50 hover:text-gray-700 transition-all duration-200"
                    >
                      <FaUserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                ) : (
                  <div className="px-2">
                    <div className="bg-white/10 rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <FaUser className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{fullName || 'User'}</p>
                          <p className="text-xs text-white/80 capitalize flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            {role} Account
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
