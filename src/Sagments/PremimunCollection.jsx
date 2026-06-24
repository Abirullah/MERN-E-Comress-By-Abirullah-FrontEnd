import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../ReduxSetUp/Feature/Products/ProductSlice";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function PremiumCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const currentProduct = products[current];

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length === 0 || hovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length, hovered]);

  /* ── Loading Skeleton ── */
  if (products.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-5 md:px-16 py-16 overflow-hidden animate-pulse bg-[#080808]">
        <div className="w-full max-w-[1500px] flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* image skeleton — top on mobile */}
          <div className="w-full flex items-center justify-center order-first lg:order-last">
            <div className="w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[700px] h-[260px] sm:h-[380px] lg:h-[650px] bg-[#1e1e1e] rounded-[24px] sm:rounded-[36px] lg:rounded-[50px]" />
          </div>

          {/* text skeleton */}
          <div className="space-y-5 w-full order-last lg:order-first">
            <div className="w-40 h-4 bg-[#1e1e1e] rounded-full" />
            <div className="space-y-3">
              <div className="w-[90%] h-10 sm:h-16 bg-[#1e1e1e] rounded-2xl" />
              <div className="w-[70%] h-10 sm:h-16 bg-[#1e1e1e] rounded-2xl" />
            </div>
            <div className="w-32 h-8 bg-[#1e1e1e] rounded-2xl" />
            <div className="space-y-2">
              <div className="w-full h-4 bg-[#1e1e1e] rounded-full" />
              <div className="w-[80%] h-4 bg-[#1e1e1e] rounded-full" />
            </div>
            <div className="w-36 h-11 bg-[#1e1e1e] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#080808] overflow-hidden relative flex items-center justify-center border-b border-[#1e1e1e]">

      {/* HUGE BG TEXT — scaled down on mobile */}
      <h1 className="absolute text-[80px] sm:text-[140px] md:text-[240px] font-black text-[#d4a544]/[0.03] uppercase tracking-[12px] sm:tracking-[20px] pointer-events-none select-none">
        Premium
      </h1>

      {/* GRADIENT LIGHTS */}
      <div className="absolute top-[-100px] left-[-80px] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-[#d4a544]/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-[#d4a544]/5 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1500px] px-5 sm:px-8 md:px-16 py-12 sm:py-16 relative z-10
        flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-center gap-8">

        {/* ── IMAGE — top on mobile, right on desktop ── */}
        <div
          className="relative flex items-center justify-center w-full order-first lg:order-last"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* glow */}
          <div className="absolute w-[260px] h-[260px] sm:w-[500px] sm:h-[500px] bg-[#d4a544]/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

          {/* rotating ring — hidden on mobile to avoid overflow */}
          <div className="absolute w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] border border-[#d4a544]/10 rounded-full animate-spin-slow hidden sm:block pointer-events-none" />

          {/* product image */}
          <img
            key={currentProduct._id}
            src={currentProduct.images[0]}
            alt={currentProduct.name}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[700px]
              h-[240px] sm:h-[380px] lg:h-[650px]
              object-cover
              rounded-[20px] sm:rounded-[36px] lg:rounded-[50px]
              drop-shadow-[0_20px_50px_rgba(212,165,68,0.15)]
              animate-image"
          />

          {/* product number — smaller on mobile */}
          <div className="absolute top-3 right-3 sm:top-10 sm:right-10 text-[#d4a544]/20 text-4xl sm:text-7xl font-black pointer-events-none">
            0{current + 1}
          </div>
        </div>

        {/* ── TEXT CONTENT — bottom on mobile, left on desktop ── */}
        <div className="text-[#ddd4be] order-last lg:order-first w-full">

          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Sparkles size={14} className="text-[#d4a544]" />
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#d4a544]">
              New Collection 2026
            </p>
          </div>

          <h1
            key={currentProduct.name}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-none animate-slide text-[#ddd4be]"
          >
            {currentProduct.name}
          </h1>

          <div className="flex items-center gap-3 sm:gap-5 mt-5 sm:mt-8 flex-wrap">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d4a544]">
              ${currentProduct.price}
            </span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#d4a544]/10 border border-[#d4a544]/20 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#d4a544] backdrop-blur-xl">
              Limited Edition
            </span>
          </div>

          {/* description — hidden on mobile to keep it clean */}
          <p className="hidden sm:block text-[#6b6666] text-base lg:text-lg leading-8 mt-6 sm:mt-8 max-w-[600px]">
            {currentProduct.desc}
          </p>

          <div className="flex items-center gap-4 mt-5 sm:mt-8">
            <button
              onClick={() => navigate(`/products/${currentProduct._id}`)}
              className="px-7 sm:px-10 py-3 sm:py-3.5 bg-[#d4a544] text-[#080808] rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-[#c19a3e] transition-all duration-300 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20 hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              View Details
              <ArrowRight size={14} />
            </button>
          </div>

          {/* INDICATORS */}
          <div className="flex gap-2 sm:gap-3 mt-8 sm:mt-16">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`cursor-pointer transition-all duration-500 rounded-full ${
                  current === index
                    ? "w-10 sm:w-16 h-2 sm:h-2.5 bg-[#d4a544]"
                    : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1e1e1e] hover:bg-[#d4a544]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @keyframes imageReveal {
          from { opacity: 0; transform: scale(1.06); filter: blur(8px);  }
          to   { opacity: 1; transform: scale(1);    filter: blur(0px); }
        }

        .animate-slide { animation: slide 0.8s ease; }
        .animate-image { animation: imageReveal 1s ease; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
      `}</style>
    </div>
  );
}

export default PremiumCollection;