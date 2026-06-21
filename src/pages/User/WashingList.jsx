import { useState, useEffect } from "react";
import { Eye, ShoppingCart, X, Heart, Trash2, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchWishlist,
  toggleProductWishlist,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "classic", label: "Classic" },
  { key: "casual", label: "Casual" },
];

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const normalizeWishlistItem = (product) => {
  if (!product) {
    return null;
  }

  const numericPrice =
    Number(product.discountPrice) > 0
      ? Number(product.discountPrice)
      : Number(product.price || 0);
  const filterKeys = [
    product.category,
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return {
    ...product,
    id: product._id || product.id,
    image: product.images?.[0] || FALLBACK_IMAGE,
    price: formatCurrency(numericPrice),
    numericPrice,
    inStock:
      Number(product.countInStock) > 0 ||
      (product.variants || []).some(
        (variant) => Number(variant.stock) > 0
      ),
    filterKeys,
    added: false,
  };
};

function Toast({ message, visible }) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        bg-[#d4a544] text-[#080808] text-[11px] font-semibold uppercase tracking-[0.15em]
        px-5 py-3 rounded-xl shadow-2xl
        transition-all duration-300
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }
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

    setTimeout(() => {
      onRemove(item.id);
    }, 500);
  };

  return (
    <div
      className={`
        group relative w-full
        rounded-xl overflow-hidden
        transition-all duration-500 bg-[#0e0e0e] border border-[#1e1e1e]
        hover:border-[#d4a544]/30 hover:shadow-2xl hover:shadow-[#d4a544]/5
        ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
      style={{ height: 500 }}
    >
      {/* IMAGE SECTION */}
      <div
        className="relative overflow-hidden bg-[#1a1a1a]"
        style={{ height: "70%" }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="
            w-full h-full object-cover
            transition-all duration-500
            group-hover:scale-110 group-hover:-translate-y-2
          "
        />

        {/* Out Of Stock */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-[#2e1a1a] text-[#e57373] text-[10px] font-semibold uppercase tracking-[0.2em] px-5 py-2.5 rounded-lg border border-[#4a2d2d]">
              Out Of Stock
            </span>
          </div>
        )}

        {/* Action Buttons */}
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
              w-11 h-11 rounded-full bg-[#1a1a1a] border border-[#1e1e1e] shadow-lg
              flex items-center justify-center text-[#ddd4be]
              hover:bg-[#d4a544] hover:text-[#080808] hover:border-[#d4a544]
              transition-all duration-300
            "
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onAddToBag(item.id)}
            className={`
              w-11 h-11 rounded-full shadow-lg
              flex items-center justify-center transition-all duration-300
              ${
                item.added
                  ? "bg-[#d4a544] text-[#080808] border-[#d4a544]"
                  : "bg-[#1a1a1a] text-[#ddd4be] border border-[#1e1e1e] hover:bg-[#d4a544] hover:text-[#080808] hover:border-[#d4a544]"
              }
            `}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          className="
            absolute top-5 left-5
            w-11 h-11 rounded-full bg-[#1a1a1a] border border-[#1e1e1e] shadow-lg
            flex items-center justify-center text-[#ddd4be]
            opacity-0 -translate-x-10
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-500
            hover:bg-[#e57373] hover:text-white hover:border-[#e57373]
          "
        >
          <X size={18} />
        </button>

        {/* Saved Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 bg-[#0e0e0e]/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow border border-[#1e1e1e]">
            <Heart size={12} className="fill-[#d4a544] text-[#d4a544]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ddd4be]">
              Saved
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="px-6 py-5 flex flex-col justify-center"
        style={{ height: "30%" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#5a5a5a]">
          {item.brand}
        </p>

        <h2 className="text-2xl font-bold text-[#ddd4be] mt-2 line-clamp-1">
          {item.name}
        </h2>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-semibold text-[#ddd4be]">
            {item.price}
          </p>

          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
              item.inStock ? "text-[#8fbc8f]" : "text-[#e57373]"
            }`}
          >
            {item.inStock ? "In Stock" : "Out Of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    wishlistitems,
    wishlistLoading,
    error,
  } = useSelector((state) => state.products);
  const userId = userInfo?._id || userInfo?.id || null;

  const [items, setItems] = useState([]);
  const [activeFilter, setFilter] = useState("all");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }

    dispatch(fetchWishlist(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setItems(
      (wishlistitems || [])
        .map(normalizeWishlistItem)
        .filter(Boolean)
    );
  }, [wishlistitems]);

  const notify = (msg) => {
    setToast({
      visible: true,
      message: msg,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 2200);
  };

  const handleRemove = async (id) => {
    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await dispatch(toggleProductWishlist(id)).unwrap();

      if (userId) {
        dispatch(fetchWishlist(userId));
      }

      notify("Removed from wishlist");
    } catch (removeError) {
      setItems(previousItems);
      notify(removeError?.message || "Could not update wishlist");
    }
  };

  const handleAddToBag = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = {
          ...item,
          added: !item.added,
        };

        if (updatedItem.added) {
          notify(`${item.name} added to bag`);
        }

        return updatedItem;
      })
    );
  };

  const handleClearAll = async () => {
    if (!items.length || !userId) {
      return;
    }

    const wishlistIds = items.map((item) => item.id);
    setItems([]);

    const results = await Promise.allSettled(
      wishlistIds.map((id) =>
        dispatch(toggleProductWishlist(id)).unwrap()
      )
    );

    await dispatch(fetchWishlist(userId));

    const hasFailure = results.some(
      (result) => result.status === "rejected"
    );

    notify(
      hasFailure ? "Some items could not be removed" : "Wishlist cleared"
    );
  };

  const visibleItems = items.filter((item) =>
    activeFilter === "all"
      ? true
      : item.filterKeys?.includes(activeFilter)
  );

  const totalPrice = visibleItems.reduce((sum, item) => {
    return sum + Number(item.numericPrice || 0);
  }, 0);

  if (
    wishlistLoading &&
    items.length === 0 &&
    wishlistitems.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1e1e1e] border-t-[#d4a544] mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={20} className="text-[#d4a544]" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#6b6666] uppercase tracking-[0.18em]">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4 mt-10 pt-5">
          <div>
           

            <h1 className="text-5xl font-bold text-[#ddd4be] leading-none sm:text-6xl">
              Wishlist

              <span className="ml-3 text-2xl font-normal text-[#333]">
                ({visibleItems.length})
              </span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="
                flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5a5a5a]
                hover:text-[#e57373] transition-colors duration-200
                border border-[#1e1e1e] hover:border-[#4a2d2d]
                rounded-lg px-5 py-2.5 bg-[#0e0e0e]
              "
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilter(filter.key)}
              className={`
                px-5 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-[0.15em]
                border transition-all duration-300
                ${
                  activeFilter === filter.key
                    ? "bg-[#d4a544] text-[#080808] border-[#d4a544]"
                    : "bg-[#0e0e0e] text-[#6b6666] border-[#1e1e1e] hover:border-[#d4a544]/30 hover:text-[#d4a544]"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1a1a1a] border border-[#1e1e1e] mb-6">
              <Heart size={32} className="text-[#d4a544]" />
            </div>

            <p className="text-2xl font-bold text-[#ddd4be]">
              Nothing saved yet
            </p>

            <p className="text-[11px] text-[#6b6666] mt-3 max-w-md">
              Add some items to your wishlist to see them here
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
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

            {/* FOOTER */}
            <div className="mt-12 flex items-center justify-between flex-wrap gap-4 border-t border-[#1e1e1e] pt-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5a5a5a] mb-1">
                  Total saved value
                </p>

                <p className="text-3xl font-bold text-[#ddd4be]">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => {
                  setItems((prev) =>
                    prev.map((item) => ({
                      ...item,
                      added: true,
                    }))
                  );

                  notify("All items added to bag");
                }}
                className="
                  bg-[#d4a544] text-[#080808] text-[11px] font-bold
                  uppercase tracking-[0.2em]
                  px-8 py-4 rounded-lg
                  hover:bg-[#c19a3e] active:scale-95
                  transition-all duration-200
                  flex items-center gap-3 shadow-lg shadow-[#d4a544]/10
                  hover:shadow-xl hover:shadow-[#d4a544]/20
                "
              >
                <ShoppingCart size={16} />
                Add all to bag
              </button>
            </div>
          </>
        )}

        {error && !wishlistLoading && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#4a2d2d] bg-gradient-to-r from-[#2e1a1a] to-[#0e0e0e] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4a2d2d]">
                <XCircle size={20} className="text-[#e57373]" />
              </div>
              <div>
                <p className="font-semibold text-[#e57373] uppercase tracking-[0.15em] text-[10px]">
                  Error loading wishlist
                </p>
                <p className="mt-1 text-[11px] text-[#8b7070]">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
      />
    </div>
  );
}