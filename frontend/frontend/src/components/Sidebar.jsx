import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Building2,
  CreditCard,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role =
    user?.role?.toLowerCase() || user?.type?.toLowerCase() || "employee";

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Employees", path: "/employees", icon: <Users size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Meetings", path: "/meetings", icon: <Calendar size={20} /> },
    {
      name: "Subscription",
      path: "/subscription",
      icon: <CreditCard size={20} />,
    },
  ];

  const employeeLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Meetings", path: "/meetings", icon: <Calendar size={20} /> },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  return (
    <>
      {/* 🌐 Desktop Sidebar */}
      <aside
        className="
          hidden md:flex
          fixed top-20 bottom-0 left-0 w-60 
          flex-col justify-between
          text-white pt-20 pb-20
          border-r border-blue-400/40 
          backdrop-blur-2xl
          overflow-y-auto
        "
      >
        <ul className="space-y-3 px-4">
          {links.map((link, i) => (
            <li key={i}>
              <NavLink
                to={link.path}
                state={{ from: location.pathname }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600/30 text-white shadow-lg backdrop-blur-md border border-blue-400/30"
                      : "hover:bg-blue-500/10 text-blue-100 hover:text-white"
                  }`
                }
              >
                {link.icon}
                <span className="text-sm sm:text-base">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center text-sm text-blue-100 shadow-inner border border-blue-400/30">
            <p className="font-semibold text-white truncate">
              {user.name || "Team Member"}
            </p>
            <p className="text-xs uppercase tracking-wide opacity-80">
              {role.toUpperCase()}
            </p>
          </div>
        </div>
      </aside>

      {/* 📱 Mobile Bottom Navbar */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          flex md:hidden
          justify-around items-center
          bg-gradient-to-t from-black via-blue-950/60 to-gray-900/80
          border-t border-blue-400/30
          backdrop-blur-2xl
          py-3
        "
      >
        {links.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            state={{ from: location.pathname }}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all ${
                isActive ? "text-blue-400" : "text-blue-200 hover:text-white"
              }`
            }
          >
            {link.icon}
            <span className="mt-1 text-[11px]">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
