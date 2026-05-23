import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import img2 from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import img3 from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import img4 from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import img5 from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";

const images = [
  { id: 1, label: "Front", src: img1, bg: "#f5f5f3" },
  { id: 2, label: "Side", src: img2, bg: "#efefed" },
  { id: 3, label: "Top", src: img3, bg: "#f0f0ee" },
  { id: 4, label: "Sole", src: img4, bg: "#f5f5f3" },
  { id: 5, label: "Back", src: img5, bg: "#efefed" },
];

const sizes = [
  { eu: "39", uk: "6", available: true },
  { eu: "40", uk: "6.5", available: true },
  { eu: "41", uk: "7", available: true },
  { eu: "42", uk: "8", available: true },
  { eu: "42.5", uk: "8.5", available: false },
  { eu: "43", uk: "9", available: true },
  { eu: "44", uk: "9.5", available: true },
  { eu: "44.5", uk: "10", available: true },
  { eu: "45", uk: "10.5", available: false },
  { eu: "46", uk: "11", available: true },
  { eu: "47", uk: "12", available: true },
];

const colors = [
  {
    id: "Y37",
    name: "White & Gum",
    hex1: "#ffffff",
    hex2: "#c4a97d",
  },
  {
    id: "B60",
    name: "Navy & White",
    hex1: "#1a2e5a",
    hex2: "#ffffff",
  },
  {
    id: "G74",
    name: "Green & Off-White",
    hex1: "#2d5a3d",
    hex2: "#f0ede8",
  },
];

function DeliveryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 3h15v13H1z" strokeLinejoin="round" />
      <path d="M16 8h4l3 4v4h-7V8z" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill={filled ? "#111" : "none"}
      stroke="#111"
      strokeWidth="1.5"
    >
      <path
        d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M9 18l6-6-6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LacosteProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [sizeUnit, setSizeUnit] = useState("eu");
  const [addedToBag, setAddedToBag] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Y37");
  const [sizeError, setSizeError] = useState(false);

  // TOGGLE STATE
  const [activeTab, setActiveTab] = useState("size");

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    setAddedToBag(true);

    setTimeout(() => {
      setAddedToBag(false);
    }, 2000);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#fafaf8] text-[#111]">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 h-screen mt-10 flex items-center">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full h-full items-center">
          
          {/* LEFT SIDE */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-[58%] h-full items-center">
            
            {/* THUMBNAILS */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`
                    flex-shrink-0
                    w-14
                    h-14
                    rounded-2xl
                    overflow-hidden
                    border
                    transition-all
                    duration-300
                    backdrop-blur-md
                    ${
                      selectedImage === idx
                        ? "border-black shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    }
                  `}
                  style={{
                    background: img.bg,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div
              className="
                relative
                flex-1
                rounded-[2rem]
                h-[70vh]
                lg:h-[82vh]
                overflow-hidden
                border
                border-white/40
                backdrop-blur-xl
                shadow-[0_20px_80px_rgba(0,0,0,0.08)]
                flex
                items-center
                justify-center
              "
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255,255,255,0.8), transparent 60%),
                  ${images[selectedImage].bg}
                `,
              }}
            >
              {/* Glow */}
              <div className="absolute w-[320px] h-[320px] bg-black/5 blur-3xl rounded-full" />

              {/* Wishlist */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="
                  absolute
                  top-5
                  right-5
                  z-20
                  w-10
                  h-10
                  rounded-full
                  bg-white/80
                  backdrop-blur-xl
                  flex
                  items-center
                  justify-center
                  shadow-md
                  hover:scale-110
                  transition-all
                "
              >
                <HeartIcon filled={wishlist} />
              </button>

              {/* MAIN PRODUCT IMAGE */}
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                src={images[selectedImage].src}
                alt={images[selectedImage].label}
                className="
                  w-full
                  h-full
                  object-contain
                  p-6
                  lg:p-8
                  hover:scale-105
                  transition-all
                  duration-700
                  relative
                  z-10
                "
                style={{
                  filter:
                    "drop-shadow(0px 30px 40px rgba(0,0,0,0.18))",
                }}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-[42%] h-full pt-12 flex flex-col justify-center gap-4">
            
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="uppercase tracking-[0.25em] text-xs text-gray-400 font-medium">
                  Lacoste
                </span>
              </div>

              <h1
                className="
                  text-3xl
                  lg:text-5xl
                  leading-[0.95]
                  tracking-tight
                  font-light
                  text-black
                "
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Men's Carnaby
                <br />
                Pro Leather
                <br />
                Trainers
              </h1>

              <p className="mt-3 text-sm text-gray-400 tracking-wide">
                Men · White · Sneakers · Premium Collection
              </p>
            </div>

            {/* PRICE */}
            <div>
              <span className="text-4xl font-extralight tracking-tight">
                £95
              </span>
            </div>

            {/* COLORS */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                Colour Selection
              </p>

              <div className="flex gap-4">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className="group flex flex-col items-center gap-1"
                  >
                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        overflow-hidden
                        border
                        transition-all
                        duration-300
                        ${
                          selectedColor === color.id
                            ? "border-black scale-105 shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                        }
                      `}
                    >
                      <div className="grid grid-cols-2 w-full h-full">
                        <div style={{ background: color.hex1 }} />
                        <div style={{ background: color.hex2 }} />
                      </div>
                    </div>

                    <span className="text-[10px] tracking-widest text-gray-400">
                      {color.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* TOGGLE SECTION */}
            <div className="border border-black/5 rounded-3xl bg-white/70 backdrop-blur-xl overflow-hidden">
              
              {/* TOGGLE BUTTONS */}
              <div className="flex p-2 gap-2 border-b border-black/5">
                <button
                  onClick={() => setActiveTab("size")}
                  className={`
                    flex-1
                    py-2.5
                    rounded-2xl
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    transition-all
                    duration-300
                    ${
                      activeTab === "size"
                        ? "bg-black text-white shadow-md"
                        : "text-gray-500 hover:bg-black/5"
                    }
                  `}
                >
                  Size
                </button>

                <button
                  onClick={() => setActiveTab("details")}
                  className={`
                    flex-1
                    py-2.5
                    rounded-2xl
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    transition-all
                    duration-300
                    ${
                      activeTab === "details"
                        ? "bg-black text-white shadow-md"
                        : "text-gray-500 hover:bg-black/5"
                    }
                  `}
                >
                  Details
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-5 min-h-[300px]">
                <AnimatePresence mode="wait">
                  
                  {/* SIZE TAB */}
                  {activeTab === "size" && (
                    <motion.div
                      key="size"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          Select Size
                        </p>

                        <div className="flex gap-2">
                          {["eu", "uk"].map((u) => (
                            <button
                              key={u}
                              onClick={() => setSizeUnit(u)}
                              className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                transition-all
                                ${
                                  sizeUnit === u
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-500 hover:text-black"
                                }
                              `}
                            >
                              {u.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {sizeError && (
                        <p className="text-red-500 text-xs mb-2">
                          Please select a size
                        </p>
                      )}

                      <div className="grid grid-cols-4 gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size.eu}
                            disabled={!size.available}
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeError(false);
                            }}
                            className={`
                              relative
                              py-2.5
                              rounded-2xl
                              border
                              text-sm
                              transition-all
                              duration-300
                              hover:-translate-y-1
                              ${
                                !size.available
                                  ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                  : selectedSize?.eu === size.eu
                                  ? "bg-black text-white border-black shadow-lg"
                                  : "border-gray-200 hover:border-black"
                              }
                            `}
                          >
                            {sizeUnit === "eu"
                              ? size.eu
                              : size.uk}

                            {!size.available && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="absolute w-full h-px bg-gray-200 rotate-12" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                    </motion.div>
                  )}

                 
                  {/* DETAILS TAB */}
{activeTab === "details" && (
  <motion.div
    key="details"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
className="h-[240px] overflow-y-auto pr-1 pb-3 scrollbar-hide"
  >
    <h3 className="text-base mb-4 font-medium sticky top-0 bg-white/70 backdrop-blur-xl pb-2 z-10">
      Product Details
    </h3>

    <ul className="space-y-3 text-sm text-gray-500 leading-relaxed">
      <li>· Premium full-grain leather upper</li>

      <li>· Iconic crocodile branding on side</li>

      <li>· Signature gum rubber outsole</li>

      <li>· Padded collar for maximum comfort</li>

      <li>· Luxury lifestyle sneaker silhouette</li>

      <li>· Soft inner lining for all-day wear</li>

      <li>· Designed for premium streetwear styling</li>

      <li>· Durable rubber traction outsole</li>

      <li>· Minimal luxury-inspired design language</li>

      <li>· Breathable interior cushioning</li>

      <li>· High-end crafted stitching details</li>

      <li>· Everyday comfort with premium aesthetics</li>

      <li>· Imported materials and construction</li>

      <li>· Perfect for smart casual outfits</li>
    </ul>
  </motion.div>
)}
                </AnimatePresence>
              </div>
            </div>

            {/* ADD TO BAG */}
            <button
              onClick={handleAddToBag}
              className={`
                relative
                overflow-hidden
                w-full
                py-4
                rounded-2xl
                text-sm
                tracking-[0.25em]
                font-medium
                transition-all
                duration-500
                hover:scale-[1.01]
                active:scale-[0.99]
                shadow-lg
                ${
                  addedToBag
                    ? "bg-green-700 text-white"
                    : "bg-black hover:bg-neutral-800 text-white"
                }
              `}
            >
              {addedToBag
                ? "✓ ADDED TO BAG"
                : "ADD TO SHOPPING BAG"}
            </button>

            {/* DELIVERY */}
            <div className="border border-black/5 rounded-3xl p-4 bg-white/70 backdrop-blur-xl">
              <div className="flex gap-3">
                <div className="mt-1">
                  <DeliveryIcon />
                </div>

                <div>
                  <p className="text-sm text-gray-700">
                    Standard delivery £4.95
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Free delivery on orders over £99
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}