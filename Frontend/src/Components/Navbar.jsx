import { Link, useNavigate } from "react-router-dom";
import { ShieldPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <Link
          to="/dashboard"
          className="flex items-center gap-2"
        >
          <ShieldPlus className="text-blue-600" size={32} />

          <span className="text-2xl font-bold text-blue-700">
            HCMS
          </span>
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/dashboard"
            className="hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/plans"
            className="hover:text-blue-600"
          >
            Insurance Plans
          </Link>

          <Link
            to="/my-policies"
            className="hover:text-blue-600"
          >
            My Policies
          </Link>

          <Link
            to="/profile"
            className="hover:text-blue-600"
          >
            Profile
          </Link>

          <div className="text-gray-600 font-semibold">
            {user?.name}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;