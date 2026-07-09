import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  FileSearch,
  User,
  LogOut,
} from "lucide-react";

const AgentLayout = ({ children }) => {
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
      path: "/agent/dashboard",
    },
    {
      name: "Assigned Claims",
      icon: FileSearch,
      path: "/agent/claims",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      <aside
        className={`fixed lg:static z-50 bg-white shadow-lg h-screen w-64 transition-transform
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        <div className="flex justify-between items-center p-5 border-b">

          <Link
            to="/agent/dashboard"
            className="text-2xl font-bold text-green-600"
          >
            Agent Panel
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>

        </div>

        <nav className="mt-6 px-3 space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg
                  ${
                    isActive
                      ? "bg-green-600 text-white"
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
            className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg w-full"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </aside>

      <div className="flex-1">

        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="text-2xl font-bold">
            Agent Dashboard
          </h1>

          <span className="font-semibold">
            Insurance Agent
          </span>

        </header>

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AgentLayout;