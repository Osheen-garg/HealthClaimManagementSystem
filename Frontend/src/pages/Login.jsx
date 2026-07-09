import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await login(formData);

      if (response.success) {
        toast.success(response.message);

        switch (response.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;

          case "agent":
            navigate("/agent/dashboard");
            break;

          case "hospital":
            navigate("/hospital/dashboard");
            break;

          default:
            navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
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

          <LogIn size={70} className="mb-6" />

          <h1 className="text-4xl font-bold mb-4">
            Health Claim Management
          </h1>

          <p className="text-lg text-blue-100 leading-8">
            Securely access your account to manage insurance policies,
            purchase plans, submit health claims, and track claim status
            anytime, anywhere.
          </p>

          <div className="mt-12">
            <h3 className="text-xl font-semibold">
              Features
            </h3>

            <ul className="mt-4 space-y-3 text-blue-100">
              <li>✔ Secure Login</li>
              <li>✔ Insurance Plans</li>
              <li>✔ Health Claim Tracking</li>
            </ul>
          </div>

        </div>

        {/* Right Section */}

        <div className="p-8 md:p-12">

          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Sign in to your account
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

           

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-white transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Signing In..." : "Login"}
            </button>

            {/* Register Link */}

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Register
              </Link>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Login;