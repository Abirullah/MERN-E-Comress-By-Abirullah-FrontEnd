import nike from "../../public/Logoes/pngwing.com (1).png";
import adidas from "../../public/Logoes/pngwing.com.png";
import puma from "../../public/Logoes/pngwing.com (6).png";
import reebok from "../../public/Logoes/pngwing.com (3).png";
import vans from "../../public/Logoes/pngwing.com (8).png";
import newbalance from "../../public/Logoes/pngwing.com (2).png";
import skechers from "../../public/Logoes/pngwing.com (5).png";
import { NavLink } from "react-router-dom";

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
  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-100 py-14 overflow-hidden">
      
      {/* Heading */}
      <div className="text-center mb-12">
        
        <p className="uppercase tracking-[6px] text-gray-500 text-sm mb-3">
          Trusted Worldwide
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-black">
          Famous Brands
        </h1>

        <div className="w-32 h-1 bg-black mx-auto mt-5 rounded-full"></div>
      </div>

      {/* Logo Slider */}
      <div className="relative w-full overflow-hidden">
        
        {/* Blur Sides */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Moving Track */}
        <div className="flex animate-scroll whitespace-nowrap w-max">
          
          {[...brands, ...brands].map((logo, index) => (
            <NavLink  key={index} to="/shop">
            <div
             
              className="mx-6 md:mx-10 w-[180px] h-[100px] bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 flex items-center justify-center group border border-gray-100"
            >
              <img
                src={logo}
                alt="brand-logo"
                className="w-[100px] h-[50px] object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-500"
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
