import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import girl from "../assets/house1.webp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { post } from "../helpers/api_helper";


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Full name must be at least 2 characters"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await post("/users/signup", values);
        toast.success(response.message);
        navigate("/login");
      } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={girl}
          alt="Sign Up Visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-gray-100 to-white px-4 py-8 md:py-0">
        <div className="bg-white/90 shadow-xl backdrop-blur-md px-6 py-8 sm:px-10 sm:py-12 rounded-2xl w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
              Create Account
            </h2>
            <p className="text-sm text-gray-500">
              Sign up for free to access our platform
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="designer@gmail.com"
                className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-md p-3 pr-12 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye className="w-5 h-5" />
                  ) : (
                    <FaEyeSlash className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                name="role"
                className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors bg-white"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="user">Guest (I want to book properties)</option>
                <option value="host">Host (I want to list my properties)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-md hover:from-rose-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-rose-600 hover:text-rose-700 hover:underline font-medium transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
