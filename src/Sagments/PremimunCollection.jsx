import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
} from "../ReduxSetUp/Feature/Products/ProductSlice";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function PremiumCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const currentProduct = products[current];


  // Fetch Products
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Auto Change Product
  useEffect(() => {
    if (products.length === 0 || hovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length, hovered]);

  // Loading Skeleton
  if (products.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-16 overflow-hidden animate-pulse bg-[#080808]">
        <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div className="w-40 h-4 bg-[#1e1e1e] rounded-full"></div>

            <div className="space-y-4">
              <div className="w-[90%] h-16 bg-[#1e1e1e] rounded-2xl"></div>
              <div className="w-[70%] h-16 bg-[#1e1e1e] rounded-2xl"></div>
            </div>

            <div className="w-40 h-10 bg-[#1e1e1e] rounded-2xl"></div>

            <div className="space-y-3">
              <div className="w-full h-4 bg-[#1e1e1e] rounded-full"></div>
              <div className="w-full h-4 bg-[#1e1e1e] rounded-full"></div>
              <div className="w-[80%] h-4 bg-[#1e1e1e] rounded-full"></div>
            </div>

            <div className="flex gap-5 mt-10">
              <div className="w-44 h-14 bg-[#1e1e1e] rounded-full"></div>
              <div className="w-44 h-14 bg-[#1e1e1e] rounded-full"></div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[700px] h-[650px] bg-[#1e1e1e] rounded-[50px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#080808] overflow-hidden relative flex items-center justify-center border-b border-[#1e1e1e]">

      {/* HUGE BACKGROUND TEXT */}
      <h1 className="absolute text-[140px] md:text-[240px] font-black text-[#d4a544]/[0.03] uppercase tracking-[20px] pointer-events-none select-none">
        Premium
      </h1>

      {/* GRADIENT LIGHTS */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-[#d4a544]/10 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#d4a544]/5 blur-[140px] rounded-full"></div>

      <div className="w-full max-w-[1500px] px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT CONTENT */}
        <div className="text-[#ddd4be]">

          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={16} className="text-[#d4a544]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a544]">
              New Collection 2026
            </p>
          </div>

          <h1
            key={currentProduct.name}
            className="text-6xl md:text-8xl font-black leading-none animate-slide text-[#ddd4be]"
          >
            {currentProduct.name}
          </h1>

          <div className="flex items-center gap-5 mt-8 flex-wrap">

            <span className="text-5xl font-bold text-[#d4a544]">
              ${currentProduct.price}
            </span>

            <span className="px-4 py-2 rounded-lg bg-[#d4a544]/10 border border-[#d4a544]/20 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#d4a544] backdrop-blur-xl">
              Limited Edition
            </span>
          </div>

          <p className="text-[#6b6666] text-lg leading-8 mt-8 max-w-[600px]">
            {currentProduct.desc}
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => navigate(`/products/${currentProduct._id}`)}
              className="px-10 py-3.5 bg-[#d4a544] text-[#080808] rounded-lg text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#c19a3e] transition-all duration-300 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20 hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              View Details
              <ArrowRight size={16} />
            </button>
          </div>

          {/* INDICATORS */}
          <div className="flex gap-3 mt-16">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`cursor-pointer transition-all duration-500 rounded-full ${
                  current === index
                    ? "w-16 h-2.5 bg-[#d4a544]"
                    : "w-2.5 h-2.5 bg-[#1e1e1e] hover:bg-[#d4a544]/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >

          {/* GLOW */}
          <div className="absolute w-[500px] h-[500px] bg-[#d4a544]/5 blur-[120px] rounded-full"></div>

          {/* ROTATING CIRCLE */}
          <div className="absolute w-[600px] h-[600px] border border-[#d4a544]/10 rounded-full animate-spin-slow"></div>

          {/* PRODUCT IMAGE */}
          <img
            key={currentProduct._id}
            src={currentProduct.images[0]}
            alt={currentProduct.name}
            className="relative z-10 w-full max-w-[700px] h-[650px] object-cover rounded-[50px] drop-shadow-[0_40px_80px_rgba(212,165,68,0.15)] animate-image"
          />

          {/* PRODUCT NUMBER */}
          <div className="absolute top-10 right-10 text-[#d4a544]/20 text-7xl font-black">
            0{current + 1}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slide {
            from {
              opacity: 0;
              transform: translateY(60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes imageReveal {
            from {
              opacity: 0;
              transform: scale(1.08);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: scale(1);
              filter: blur(0px);
            }
          }

          .animate-slide {
            animation: slide 0.8s ease;
          }

          .animate-image {
            animation: imageReveal 1s ease;
          }

          .animate-spin-slow {
            animation: spin 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

export default PremiumCollection;