import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import girl from "../assets/house1.webp";
import { post } from "../helpers/api_helper";

const Login = () => {
  const navigate = useNavigate();
  
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await post("/users/login", values);
      toast.success(response.message);
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", response.email);
      localStorage.setItem("role", response.role);
      localStorage.setItem("fullName", response.fullName);
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={girl}
          alt="Login Visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-gray-100 to-white px-4 py-8 md:py-0">
        <div className="bg-white/90 shadow-xl backdrop-blur-md px-6 py-8 sm:px-10 sm:py-12 rounded-2xl w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500">
              Login to your account
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "", showPassword: false }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Field
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Field
                      type={values.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full border border-gray-300 rounded-md p-3 pr-12 text-base focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => setFieldValue("showPassword", !values.showPassword)}
                    >
                      {values.showPassword ? (
                        <FaEye className="w-5 h-5" />
                      ) : (
                        <FaEyeSlash className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-md hover:from-rose-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="text-sm text-center mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-rose-600 hover:text-rose-700 hover:underline font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
