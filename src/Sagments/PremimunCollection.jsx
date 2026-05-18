import { useEffect, useState } from "react";
import Pic from "../../public/Pictures/pexels-ian-panelo-7716266.jpg";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: "$120",
    desc: "Premium streetwear sneakers with modern comfort and iconic design.",
    image: Pic,
  },
  {
    id: 2,
    name: "Adidas Runner",
    price: "$95",
    desc: "Lightweight running shoes built for speed and everyday style.",
    image: Pic,
  },
  {
    id: 3,
    name: "Puma Street",
    price: "$110",
    desc: "Urban-inspired sneakers designed for casual and trendy outfits.",
    image: Pic,
  },
  {
    id: 4,
    name: "Jordan Retro",
    price: "$180",
    desc: "Classic basketball silhouette with premium materials and comfort.",
    image: Pic,
  },
];

function PremimunCollection() {
  const [current, setCurrent] = useState(0);

  // Auto Change Product
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-16 overflow-hidden">
      
      <div className="w-full lg:w-[85%] bg-white overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[650px]">
          
          {/* LEFT SIDE IMAGE */}
          <div className="relative h-full overflow-hidden">
            <img
              key={products[current].id}
              src={products[current].image}
              alt={products[current].name}
              className="w-full h-full object-cover animate-fade"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-12">
            
            <p className="text-gray-500 uppercase tracking-[5px] mb-4">
              Premium Collection
            </p>

            <h1
              key={products[current].name}
              className="text-5xl md:text-6xl font-bold text-black leading-tight animate-slide"
            >
              {products[current].name}
            </h1>

            <p className="text-2xl font-semibold text-gray-700 mt-6">
              {products[current].price}
            </p>

            <p className="text-gray-600 mt-6 leading-8 text-lg max-w-[500px]">
              {products[current].desc}
            </p>

            <button className="mt-10 w-fit px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition duration-300 hover:scale-105">
              Add To Cart
            </button>

            {/* Indicators */}
            <div className="flex gap-3 mt-12">
              {products.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    current === index
                      ? "w-10 bg-black"
                      : "w-3 bg-gray-300"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes fade {
            from {
              opacity: 0;
              transform: scale(1.1);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slide {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade {
            animation: fade 1s ease;
          }

          .animate-slide {
            animation: slide 0.8s ease;
          }
        `}
      </style>
    </div>
  );
}

export default PremimunCollection;