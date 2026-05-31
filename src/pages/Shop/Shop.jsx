import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  clearProductMessages,
  fetchProducts,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const formatLabel = (value) => {
  if (!value) {
    return "";
  }

  return String(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getPrimaryImage = (product) =>
  product?.images?.[0] || FALLBACK_IMAGE;

const getCurrentPrice = (product) =>
  Number(product?.discountPrice) > 0
    ? Number(product.discountPrice)
    : Number(product?.price || 0);

const getProductStock = (product) =>
  Number(product?.countInStock) > 0 ||
  (Array.isArray(product?.variants) &&
    product.variants.some((variant) => Number(variant.stock) > 0));

const getProductSizes = (product) => {
  const sizes = Array.isArray(product?.variants)
    ? product.variants
        .map((variant) => variant?.size)
        .filter((size) => size !== undefined && size !== null && size !== "")
    : [];

  const uniqueSizes = [...new Set(sizes.map((size) => String(size)))];

  uniqueSizes.sort((firstSize, secondSize) => {
    const firstNumber = Number.parseFloat(firstSize);
    const secondNumber = Number.parseFloat(secondSize);

    if (!Number.isNaN(firstNumber) && !Number.isNaN(secondNumber)) {
      return firstNumber - secondNumber;
    }

    return firstSize.localeCompare(secondSize);
  });

  return uniqueSizes;
};

const renderStars = (rating = 0) => {
  const normalizedRating = Number(rating || 0);

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={14}
      className={
        index < Math.round(normalizedRating)
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300"
      }
    />
  ));
};

function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShopProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productId = product._id || product.id;
  const currentPrice = getCurrentPrice(product);
  const hasDiscount =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - Number(product.discountPrice) / Number(product.price || 1)) * 100
      )
    : 0;
  const inStock = getProductStock(product);

  return (
    <Link
      to={`/products/${productId}`}
      state={{ product }}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative overflow-hidden bg-[#f2f0ea]">
          <div className="aspect-[0.95] overflow-hidden">
            <img
              src={getPrimaryImage(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {hasDiscount && (
            <span className="absolute left-4 top-4 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                {product.brand || "Premium shoes"}
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-tight text-slate-950 transition-colors duration-300 group-hover:text-amber-700">
                {product.name}
              </h2>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                inStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {inStock ? "In Stock" : "Sold Out"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            {renderStars(product.rating)}
            <span className="ml-1 text-xs text-slate-400">
              {Number(product.rating || 0).toFixed(1)} / 5
            </span>
          </div>

          <div className="mt-auto flex items-end gap-3">
            <p className="text-lg font-bold text-slate-950">
              {formatCurrency(currentPrice)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-slate-400 line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("popular");
  const [showFilters, setShowFilters] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceLimit, setPriceLimit] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch, products.length]);

  const maxProductPrice = useMemo(() => {
    return products.reduce((currentMax, product) => {
      return Math.max(currentMax, getCurrentPrice(product));
    }, 0);
  }, [products]);

  useEffect(() => {
    if (maxProductPrice <= 0) {
      return;
    }

    setPriceLimit((current) => {
      if (current === 0 || current > maxProductPrice) {
        return maxProductPrice;
      }

      return current;
    });
  }, [maxProductPrice]);

  const categoryOptions = useMemo(() => {
    const rawCategories = products
      .map((product) => product.category || product.gender)
      .filter(Boolean)
      .map((value) => String(value));

    return [...new Set(rawCategories)];
  }, [products]);

  const shoeSizes = useMemo(() => {
    const sizes = products.flatMap((product) => getProductSizes(product));
    return [...new Set(sizes)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeValue(searchTerm);

    let nextProducts = [...products];

    if (normalizedSearch) {
      nextProducts = nextProducts.filter((product) => {
        const searchableText = [
          product.name,
          product.brand,
          product.category,
          product.description,
          product.gender,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    if (selectedCategory !== "all") {
      const normalizedCategory = normalizeValue(selectedCategory);

      nextProducts = nextProducts.filter((product) => {
        const productCategory = normalizeValue(product.category || product.gender);
        return productCategory === normalizedCategory;
      });
    }

    if (selectedSize) {
      nextProducts = nextProducts.filter((product) => {
        const productSizes = getProductSizes(product);

        if (productSizes.length === 0) {
          return true;
        }

        return productSizes.some(
          (size) => normalizeValue(size) === normalizeValue(selectedSize)
        );
      });
    }

    if (priceLimit > 0) {
      nextProducts = nextProducts.filter((product) => {
        return getCurrentPrice(product) <= priceLimit;
      });
    }

    switch (sortType) {
      case "newest":
        nextProducts.sort(
          (firstProduct, secondProduct) =>
            new Date(secondProduct.createdAt) - new Date(firstProduct.createdAt)
        );
        break;
      case "low":
        nextProducts.sort(
          (firstProduct, secondProduct) =>
            getCurrentPrice(firstProduct) - getCurrentPrice(secondProduct)
        );
        break;
      case "high":
        nextProducts.sort(
          (firstProduct, secondProduct) =>
            getCurrentPrice(secondProduct) - getCurrentPrice(firstProduct)
        );
        break;
      case "name":
        nextProducts.sort((firstProduct, secondProduct) =>
          String(firstProduct.name || "").localeCompare(
            String(secondProduct.name || "")
          )
        );
        break;
      case "popular":
      default:
        nextProducts.sort((firstProduct, secondProduct) => {
          const ratingGap =
            Number(secondProduct.rating || 0) - Number(firstProduct.rating || 0);

          if (ratingGap !== 0) {
            return ratingGap;
          }

          return (
            Number(secondProduct.numReviews || 0) -
            Number(firstProduct.numReviews || 0)
          );
        });
        break;
    }

    return nextProducts;
  }, [products, searchTerm, selectedCategory, selectedSize, priceLimit, sortType]);

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? "All Shoes"
      : formatLabel(selectedCategory);

  const activeProductCount = filteredProducts.length;

  const resetFilters = () => {
    setSearchTerm("");
    setSortType("popular");
    setSelectedCategory("all");
    setSelectedSize("");
    setPriceLimit(maxProductPrice || 0);
  };

  const renderFiltersPanel = () => (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Filters
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Open Menu
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(false)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-950 lg:hidden"
          aria-label="Close filters"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-sm leading-6 text-slate-500">
        Use the menu sections to filter by category, price, and shoe size.
      </p>

      <div className="space-y-3">
        <FilterSection title="Categories" defaultOpen>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                selectedCategory === "all"
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>All Shoes</span>
              <ChevronRight size={14} />
            </button>

            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                  normalizeValue(selectedCategory) === normalizeValue(category)
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{formatLabel(category)}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price" defaultOpen>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max={maxProductPrice || 0}
              value={priceLimit}
              onChange={(event) => setPriceLimit(Number(event.target.value))}
              className="w-full accent-slate-950"
              disabled={maxProductPrice === 0}
            />

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(priceLimit || maxProductPrice)}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Shoe Size" defaultOpen>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSize("")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSize === ""
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>

            {(shoeSizes.length > 0 ? shoeSizes : ["38", "39", "40", "41", "42", "43", "44", "45"]).map(
              (size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(String(size))}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    normalizeValue(selectedSize) === normalizeValue(size)
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {size}
                </button>
              )
            )}
          </div>
        </FilterSection>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#f7f5ef] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Home</span>
              <ChevronRight size={12} />
              <span>Shop</span>
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {selectedCategoryLabel}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Browse the collection, open or hide the filter menu, and sort
                the shoes the way you want.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="relative min-w-[240px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search shoes, brands, or styles"
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-950">
                  {activeProductCount}
                </span>{" "}
                of {products.length} products
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {selectedCategoryLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-500">
                Sort By
              </label>
              <select
                value={sortType}
                onChange={(event) => setSortType(event.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 ${showFilters ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "lg:grid-cols-1"}`}>
          {showFilters && (
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                {renderFiltersPanel()}
              </div>
            </aside>
          )}

          <div className="space-y-6">
            {loading && (
              <div className="flex min-h-[40vh] items-center justify-center rounded-[2rem] border border-slate-200 bg-white">
                <Loader2 size={48} className="animate-spin text-slate-700" />
              </div>
            )}

            {error && (
              <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-4 text-center text-rose-600">
                {error}
              </div>
            )}

            {!loading && !error && activeProductCount === 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                  No Products Found
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
                  Try a different search term or open the filter menu and clear
                  one of the active selections.
                </p>
              </div>
            )}

            {!loading && !error && activeProductCount > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ShopProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close filter overlay"
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setShowFilters(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 180 }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-[340px] overflow-y-auto bg-[#f7f5ef] p-4 shadow-2xl"
            >
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                {renderFiltersPanel()}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ShopPage;
