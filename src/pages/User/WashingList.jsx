import { useState, useEffect } from "react";
import { Eye, ShoppingCart, X, Heart, Trash2 } from "lucide-react";
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
        bg-black text-white text-xs tracking-wider
        px-4 py-3 rounded-xl shadow-2xl
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
        hover:shadow-2xl rounded-xl overflow-hidden
        transition-all duration-500 bg-[#ebeaea]
        ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
      style={{ height: 500 }}
    >
      {/* IMAGE SECTION */}
      <div
        className="relative overflow-hidden bg-[#e9eaea]"
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
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full">
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
              w-11 h-11 rounded-full bg-white shadow-lg
              flex items-center justify-center
              hover:bg-black hover:text-white transition
            "
          >
            <Eye size={20} />
          </button>

          <button
            onClick={() => onAddToBag(item.id)}
            className={`
              w-11 h-11 rounded-full shadow-lg
              flex items-center justify-center transition
              ${
                item.added
                  ? "bg-black text-white"
                  : "bg-white hover:bg-black hover:text-white"
              }
            `}
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
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

        {/* Saved Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow">
            <Heart size={12} className="fill-red-500 text-red-500" />

            <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-700">
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

          <span
            className={`text-sm font-medium ${
              item.inStock ? "text-green-600" : "text-red-400"
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
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f2f1f0] px-6 py-10"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto mt-10 pt-5">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-gray-400 mb-2">
              Your collection
            </p>

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

        {/* FILTERS */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilter(filter.key)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium tracking-wide
                border transition-all duration-300
                ${
                  activeFilter === filter.key
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
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
            <Heart size={48} className="text-gray-200 mb-4" />

            <p className="text-2xl font-bold text-gray-300">
              Nothing saved yet
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Add some shoes to your wishlist to see them here
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
            <div className="mt-12 flex items-center justify-between flex-wrap gap-4 border-t border-gray-200 pt-8">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-1">
                  Total saved value
                </p>

                <p className="text-3xl font-bold text-black">
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
          </>
        )}

        {error && !wishlistLoading && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            {error}
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
