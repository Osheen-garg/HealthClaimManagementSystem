import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (
      formData.phone &&
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await registerUser(formData);

      if (response.success) {
        toast.success(response.message);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
          <UserPlus size={70} className="mb-6" />

          <h1 className="text-4xl font-bold mb-4">
            Health Claim Management
          </h1>

          <p className="text-lg text-blue-100 leading-8">
            Register yourself to purchase insurance plans, manage
            policies, submit health claims, and track claim status
            securely from one platform.
          </p>

          <div className="mt-12">
            <h3 className="text-xl font-semibold">
              Why choose us?
            </h3>

            <ul className="mt-4 space-y-3 text-blue-100">
              <li>✔ Secure Authentication</li>
              <li>✔ Buy Insurance Plans</li>
              <li>✔ Online Claim Submission</li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12">

          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Register as a Patient
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Address (Optional)
              </label>

              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-4 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>

              </div>

            </div>
                        {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-white transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {/* Login Link */}

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Register;