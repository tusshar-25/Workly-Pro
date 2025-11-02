import React from "react";

const Footer = () => (
  <footer
    className="w-full text-gray-100 mt-auto relative z-40 backdrop-blur-sm"
    style={{
      background: "transparent",
      boxShadow: "none",
    }}
  >
    {/* ===== Thin Blue Glow Line on Top (Subtle) ===== */}
    <div className="absolute  top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/50 via-blue-400/60 to-blue-500/50 animate-pulse"></div>

    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-5">
      {/* === LEFT: COPYRIGHT === */}
      <p className="text-sm text-blue-100">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Workly Pro</span>. All rights reserved.
      </p>

      {/* === CENTER: LINKS === */}
      <p className="text-sm  text-blue-200">
        Need help?{" "}
        <a
          href="/contact"
          className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline transition-all duration-300"
        >
          Contact Us
        </a>{" "}
        |{" "}
        <a
          href="/support"
          className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline transition-all duration-300"
        >
          Support
        </a>
      </p>

      {/* === RIGHT: SOCIAL LINKS === */}
      <div className="flex gap-5 text-sm text-blue-200">
        {["Twitter", "LinkedIn", "Facebook"].map((platform) => (
          <a
            key={platform}
            href={`https://${platform.toLowerCase()}.com`}
            target="_blank"
            rel="noreferrer"
            className="relative overflow-hidden group"
          >
            <span className="transition-colors duration-300 group-hover:text-blue-300">
              {platform}
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;