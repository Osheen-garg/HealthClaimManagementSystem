import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Shield,
  FileText,
  User,
  LogOut,
} from "lucide-react";


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Insurance Plans",
      icon: Shield,
      path: "/admin/plans",
    },
    {
      name: "Claims",
      icon: FileText,
      path: "/admin/claims",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <aside
        className={`fixed lg:static z-50 bg-white shadow-lg h-screen w-64 transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        <div className="flex justify-between items-center p-5 ">

          <Link
            to="/admin/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            Health Claim
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>

        </div>

        <nav className="mt-6 space-y-2 px-3">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />

                {item.name}
              </NavLink>
            );
          })}

        </nav>

        <div className="absolute bottom-6 w-full px-4">

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg justify-center"
          >
            <LogOut size={20} />

            Logout
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="flex-1">

        {/* Topbar */}

        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="text-2xl font-bold">
            Admin Panel
          </h1>

          <div className="font-semibold text-gray-600">
            Administrator
          </div>

        </header>

        {/* Content */}

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;