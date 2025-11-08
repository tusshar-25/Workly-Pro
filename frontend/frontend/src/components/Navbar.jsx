import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const slides = [
    "Manage your company effortlessly",
    "Track tasks and meetings",
    "Boost team productivity",
    "Streamline communication",
    "Monitor performance easily",
    "Automate routine tasks",
    "Centralize your resources",
    "Simplify team collaboration",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Rotating tagline
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Animated brand text
  const AnimatedText = ({ text, delayBase = 0 }) => (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ animationDelay: `${delayBase + i * 0.08}s` }}
          className="animate-slide-letter block"
        >
          {char}
        </span>
      ))}
    </span>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-20 text-white transition-all duration-700 navbar-glow ${
        scrolled ? "py-1 shadow-2xl backdrop-blur-xl bg-opacity-80" : "py-2"
      }`}
    >
      {/* Glow underline */}
      <div className="absolute bottom-0 left-0 w-full animate-moving-glow"></div>

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Brand Section */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="w-14 h-9 sm:w-16 sm:h-10 object-contain transform hover:scale-125 transition-transform duration-300"
          />
          <div className="flex items-baseline gap-1 leading-tight">
            <h6 className="text-2xl font-bold tracking-wide text-white flex">
              <AnimatedText text="Workly" />
            </h6>
            <h6 className="text-xl font-semibold text-blue-300 flex">
              <AnimatedText text="Pro" delayBase={0.6} />
            </h6>
          </div>
        </div>

        {/* Center: Tagline */}
        <div className="hidden md:flex flex-1 justify-center text-sm font-light italic text-blue-100 animate-fade-in-slow text-center">
          {slides[currentSlide]}
        </div>

        {/* Right: Auth Section */}
        <div className="flex items-center gap-4 min-w-[120px] justify-end">
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md shadow-inner">
                <User className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium">
                  {user.role === "admin" ? "Admin" : user.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;