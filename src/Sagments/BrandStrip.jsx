import nike from "../../public/Logoes/pngwing.com (1).png";
import adidas from "../../public/Logoes/pngwing.com.png";
import puma from "../../public/Logoes/pngwing.com (6).png";
import reebok from "../../public/Logoes/pngwing.com (3).png";
import vans from "../../public/Logoes/pngwing.com (8).png";
import newbalance from "../../public/Logoes/pngwing.com (2).png";
import skechers from "../../public/Logoes/pngwing.com (5).png";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const THEME_KEY = "site-theme";
const brands = [
  nike,
  adidas,
  puma,
  reebok,
  vans,
  newbalance,
  skechers,
];

const BrandStrip = () => {
  // Use state to track theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem(THEME_KEY) || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(currentTheme);
    };

    // Listen for storage changes (when theme changes in other tabs)
    window.addEventListener('storage', handleThemeChange);

    // Custom event for theme changes within the same tab
    window.addEventListener('themechange', handleThemeChange);

    // Check for changes every second (fallback)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem(THEME_KEY) || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themechange', handleThemeChange);
      clearInterval(interval);
    };
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className={`w-full py-14 overflow-hidden border-t ${
      isDark 
        ? 'bg-gradient-to-b from-[#080808] to-[#0e0e0e] border-[#1e1e1e]' 
        : 'bg-gradient-to-b from-[#f5f5f5] to-[#ffffff] border-[#e0e0e0]'
    }`}>
      
      {/* Heading */}
      <div className="text-center mb-12">
        
        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-3 ${
          isDark ? 'text-[#5a5a5a]' : 'text-[#999999]'
        }`}>
          Trusted Worldwide
        </p>

        <h1 className={`text-4xl md:text-5xl font-black ${
          isDark ? 'text-[#ddd4be]' : 'text-[#1a1a1a]'
        }`}>
          Famous Brands
        </h1>

        <div className="w-32 h-1 bg-[#d4a544] mx-auto mt-5 rounded-full"></div>
      </div>

      {/* Logo Slider */}
      <div className="relative w-full overflow-hidden">
        
        {/* Blur Sides - Updated for both themes */}
        <div className={`absolute left-0 top-0 h-full w-32 z-10 ${
          isDark 
            ? 'bg-gradient-to-r from-[#080808] to-transparent' 
            : 'bg-gradient-to-r from-[#f5f5f5] to-transparent'
        }`}></div>
        <div className={`absolute right-0 top-0 h-full w-32 z-10 ${
          isDark 
            ? 'bg-gradient-to-l from-[#080808] to-transparent' 
            : 'bg-gradient-to-l from-[#f5f5f5] to-transparent'
        }`}></div>

        {/* Moving Track */}
        <div className="flex animate-scroll whitespace-nowrap w-max my-5">
          
          {[...brands, ...brands].map((logo, index) => (
            <NavLink key={index} to="/shop">
              <div
                className={`mx-6 md:mx-10 w-[180px] h-[100px] rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 flex items-center justify-center group border hover:border-[#d4a544]/50 hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-[#0e0e0e] border-[#1e1e1e]' 
                    : 'bg-[#ffffff] border-[#e0e0e0] shadow-gray-200'
                }`}
              >
                <img
                  src={logo}
                  alt="brand-logo"
                  className={`w-[100px] h-[50px] object-contain transition duration-500 ${
                    isDark 
                      ? 'opacity-40 group-hover:opacity-100 filter brightness-0 invert' 
                      : 'opacity-60 group-hover:opacity-100 filter brightness-0' 
                  } group-hover:scale-110`}
                />
              </div>
            </NavLink>
          ))}

        </div>
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 20s linear infinite;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
};

export default BrandStrip;