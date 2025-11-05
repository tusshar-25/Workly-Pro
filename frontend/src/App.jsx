import React, {useEffect} from "react";
import { Routes, Route, useLocation , useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Dashboard/Employees";
import Meetings from "./pages/Dashboard/Meetings";
import Tasks from "./pages/Dashboard/Tasks";
import Subscription from "./pages/Dashboard/Subscription";
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./components/WelcomeScreen"; 
import MainDash from "./pages/MainDashboard";


const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = useAuth();

   

  const isAuthPage =
  location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />
      <div className="bg-floating-blobs"></div>


      {/* Main Content Layout */}
        <div className="flex flex-1 pt-20 pb-24 md:pb-0">
        {/* Sidebar (hidden on login/register pages) */}
        {!isAuthPage && <Sidebar />}

        {/* Page Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            !isAuthPage ? "md:ml-60 lg:ml-60 ml-0 px-6 py-6" : "px-0"
          }`}
        >
          {/* Show welcome animation only on login/register */}
          {isAuthPage &&  <WelcomeScreen />}

          <Routes>
            <Route path="/" element={<MainDash />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <Meetings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <div className="pb-12 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default App;
