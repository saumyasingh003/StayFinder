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
    <div className="flex h-screen">
      {/* Left Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={girl}
          alt="Sign Up Visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Signup Form */}
      <div className="flex justify-center items-center  mt-16 w-full md:w-1/2 bg-gradient-to-br from-gray-100 to-white px-4">
        <div className="bg-white/90 shadow-xl backdrop-blur-md px-10 py-12 rounded-2xl w-full max-w-md">
          <h2 className="text-4xl font-bold mb-2 text-center text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign up for free to access our platform
          </p>

          {/* Signup Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">FullName</label>
              <input
                type="text"
                name="fullName"
                placeholder="designer"
                className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="designer@gmail.com"
                className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {showPassword ? (
                  <FaEye
                    className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Role Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                name="role"
                className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
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
              className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
