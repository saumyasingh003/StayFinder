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
    <div className="flex h-screen w-full">
      <div className="hidden md:block w-1/2">
        <img
          src={girl}
          alt="Login Visual"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex justify-center items-center mt-16  w-full md:w-1/2 bg-gradient-to-br from-gray-100 to-white px-4">
        <div className="bg-white/90 shadow-xl backdrop-blur-md px-10 py-12 rounded-2xl w-full max-w-md">
          <h2 className="text-4xl font-bold mb-1 text-center text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Login to your account
          </p>

          <Formik
            initialValues={{ email: "", password: "", showPassword: false }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Field
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Field
                      type={values.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="mt-1 w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-black"
                    />
                    {values.showPassword ? (
                      <FaEye
                        className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                        onClick={() => setFieldValue("showPassword", false)}
                      />
                    ) : (
                      <FaEyeSlash
                        className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                        onClick={() => setFieldValue("showPassword", true)}
                      />
                    )}
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
                  className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-500"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <div className="text-sm text-center mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:underline font-medium"
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
