import { useState } from "react";
import { Eye, ShoppingCart, X, Heart, Trash2 } from "lucide-react";

const INITIAL_WISHLIST = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    name: "Men's Black Running",
    price: "$79.90",
    brand: "Premium Shoes",
    inStock: true,
    category: "running",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    name: "Men's Classic Blue",
    price: "$69.00",
    brand: "Premium Shoes",
    inStock: true,
    category: "classic",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=800&q=80",
    name: "Men's Classic Mint",
    price: "$79.90",
    brand: "Premium Shoes",
    inStock: true,
    category: "classic",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    name: "Men's Tan Casual",
    price: "$89.00",
    brand: "Premium Shoes",
    inStock: false,
    category: "casual",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    name: "Men's Air Blue",
    price: "$95.00",
    brand: "Premium Shoes",
    inStock: true,
    category: "running",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    name: "Men's Burgundy Low",
    price: "$74.90",
    brand: "Premium Shoes",
    inStock: true,
    category: "casual",
  },
];

const FILTERS = [
  { key: "all",     label: "All"     },
  { key: "running", label: "Running" },
  { key: "classic", label: "Classic" },
  { key: "casual",  label: "Casual"  },
];


function Toast({ message, visible }) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        bg-black text-white text-xs tracking-wider
        px-4 py-3 rounded-xl shadow-2xl
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}
      `}
    >
      {message}
    </div>
  );
}


function WishlistCard({ item, onRemove, onAddToBag }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <div
      className={`
        group relative w-full
        hover:shadow-2xl rounded-xl overflow-hidden
        transition-all duration-500 bg-[#ebeaea]
        ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
      style={{ height: 500 }}
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative overflow-hidden bg-[#e9eaea]" style={{ height: "70%" }}>
        <img
          src={item.img}
          alt={item.name}
          className="
            w-full h-full object-cover
            transition-all duration-500
            group-hover:scale-110 group-hover:-translate-y-2
          "
        />

        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover action icons — Eye + Cart (your original style) */}
        <div
          className="
            absolute top-5 right-5
            flex flex-col gap-3
            opacity-0 translate-x-10
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-500
          "
        >
          <button
            className="
              w-11 h-11 rounded-full bg-white shadow-lg
              flex items-center justify-center
              hover:bg-black hover:text-white transition
            "
            aria-label="Quick view"
          >
            <Eye size={20} />
          </button>

          <button
            onClick={() => onAddToBag(item.id)}
            className={`
              w-11 h-11 rounded-full shadow-lg
              flex items-center justify-center transition
              ${item.added
                ? "bg-black text-white"
                : "bg-white hover:bg-black hover:text-white"}
            `}
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Remove from wishlist — top left, appears on hover */}
        <button
          onClick={handleRemove}
          aria-label="Remove from wishlist"
          className="
            absolute top-5 left-5
            w-11 h-11 rounded-full bg-white shadow-lg
            flex items-center justify-center
            opacity-0 -translate-x-10
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-500
            hover:bg-red-500 hover:text-white
          "
        >
          <X size={20} />
        </button>

        {/* Wishlist heart badge — always visible */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow">
            <Heart size={12} className="fill-red-500 text-red-500" />
            <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-700">Saved</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTENT — your original layout ── */}
      <div className="px-6 py-5 flex flex-col justify-center" style={{ height: "30%" }}>
        <p className="text-sm uppercase tracking-[3px] text-gray-500">
          {item.brand}
        </p>

        <h2 className="text-2xl font-bold text-black mt-2">
          {item.name}
        </h2>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-semibold text-black">
            {item.price}
          </p>
          <span className={`text-sm font-medium ${item.inStock ? "text-green-600" : "text-red-400"}`}>
            {item.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}


export default function WishlistPage() {
  const [items, setItems]         = useState(INITIAL_WISHLIST.map((i) => ({ ...i, added: false })));
  const [activeFilter, setFilter] = useState("all");
  const [toast, setToast]         = useState({ visible: false, message: "" });

  const notify = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    notify("Removed from wishlist");
  };

  const handleAddToBag = (id) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = { ...i, added: !i.added };
        if (next.added) notify(`${i.name} added to bag`);
        return next;
      })
    );
  };

  const handleClearAll = () => {
    setItems([]);
    notify("Wishlist cleared");
  };

  const visibleItems = items.filter((i) =>
    activeFilter === "all" ? true : i.category === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#f2f1f0] px-6 py-10" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-gray-400 mb-2">Your collection</p>
            <h1 className="text-5xl font-bold text-black leading-none">
              Wishlist
              <span className="ml-3 text-2xl font-normal text-gray-400">
                ({visibleItems.length})
              </span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="
                flex items-center gap-2 text-sm text-gray-400
                hover:text-red-500 transition-colors duration-200
                border border-gray-300 hover:border-red-400
                rounded-full px-4 py-2
              "
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        {/* ── Filter chips ── */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium tracking-wide
                border transition-all duration-300
                ${activeFilter === f.key
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart size={48} className="text-gray-200 mb-4" />
            <p className="text-2xl font-bold text-gray-300">Nothing saved yet</p>
            <p className="text-sm text-gray-400 mt-2">Add some shoes to your wishlist to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onAddToBag={handleAddToBag}
              />
            ))}
          </div>
        )}

        {/* ── Footer summary ── */}
        {visibleItems.length > 0 && (
          <div className="mt-12 flex items-center justify-between flex-wrap gap-4 border-t border-gray-200 pt-8">
            <div>
              <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-1">Total saved value</p>
              <p className="text-3xl font-bold text-black">
                ${visibleItems
                  .reduce((sum, i) => sum + parseFloat(i.price.replace("$", "")), 0)
                  .toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => {
                setItems((prev) => prev.map((i) => ({ ...i, added: true })));
                notify("All items added to bag");
              }}
              className="
                bg-black text-white text-sm font-semibold
                tracking-widest uppercase
                px-8 py-4 rounded-xl
                hover:bg-neutral-800 active:scale-95
                transition-all duration-200
                flex items-center gap-3
              "
            >
              <ShoppingCart size={18} />
              Add all to bag
            </button>
          </div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}