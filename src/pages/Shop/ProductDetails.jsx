import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Loader2,
  MessageSquareText,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  clearProductMessages,
  createProductReview,
  fetchProductById,
  fetchProducts,
  toggleProductWishlist,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const DEFAULT_SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const REVIEW_BATCH_SIZE = 4;

const COLOR_SWATCHES = {
  black: "#111827",
  white: "#f8fafc",
  gray: "#6b7280",
  grey: "#6b7280",
  navy: "#1e3a8a",
  blue: "#2563eb",
  red: "#dc2626",
  green: "#15803d",
  olive: "#556b2f",
  brown: "#8b5e34",
  beige: "#d6c5a8",
  cream: "#f5f0e6",
  orange: "#f97316",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#7c3aed",
  burgundy: "#7f1d1d",
  maroon: "#7f1d1d",
  silver: "#cbd5e1",
  gold: "#d4af37",
  teal: "#0f766e",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatDate = (value) => {
  if (!value) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

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

const getCurrentPrice = (product) => {
  const discountPrice = Number(product?.discountPrice || 0);
  const basePrice = Number(product?.price || 0);

  if (discountPrice > 0 && discountPrice < basePrice) {
    return discountPrice;
  }

  return basePrice;
};

const getOriginalPrice = (product) => Number(product?.price || 0);

const getDiscountPercent = (product) => {
  const basePrice = getOriginalPrice(product);
  const discountPrice = Number(product?.discountPrice || 0);

  if (basePrice <= 0 || discountPrice <= 0 || discountPrice >= basePrice) {
    return 0;
  }

  return Math.round((1 - discountPrice / basePrice) * 100);
};

const getAvailableColors = (product) => {
  const variantColors = Array.isArray(product?.variants)
    ? product.variants.map((variant) => variant?.color).filter(Boolean)
    : [];

  return [...new Set(variantColors.map((color) => String(color)))];
};

const getAvailableSizes = (variants = []) => {
  const sizes = variants
    .map((variant) => variant?.size)
    .filter((size) => size !== undefined && size !== null && size !== "");

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

const getVariantForSelection = (product, selectedColor, selectedSize) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];

  if (variants.length === 0) {
    return null;
  }

  const normalizedColor = normalizeValue(selectedColor);
  const normalizedSize = normalizeValue(selectedSize);

  const exactMatch = variants.find((variant) => {
    const colorMatches = normalizedColor
      ? normalizeValue(variant.color) === normalizedColor
      : true;
    const sizeMatches = normalizedSize
      ? normalizeValue(variant.size) === normalizedSize
      : true;

    return colorMatches && sizeMatches;
  });

  if (exactMatch) {
    return exactMatch;
  }

  const variantsByColor = normalizedColor
    ? variants.filter(
        (variant) => normalizeValue(variant.color) === normalizedColor
      )
    : variants;

  return (
    variantsByColor.find((variant) => Number(variant.stock) > 0) ||
    variantsByColor[0] ||
    variants.find((variant) => Number(variant.stock) > 0) ||
    variants[0] ||
    null
  );
};

const resolveSwatchColor = (color) => {
  const normalizedColor = normalizeValue(color);
  if (!normalizedColor) {
    return "#94a3b8";
  }

  if (COLOR_SWATCHES[normalizedColor]) {
    return COLOR_SWATCHES[normalizedColor];
  }

  if (normalizedColor.startsWith("#")) {
    return normalizedColor;
  }

  return color;
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

const getRelatedProducts = (products, product) => {
  if (!product) {
    return [];
  }

  const currentId = product._id || product.id;
  const pool = products.filter((item) => (item._id || item.id) !== currentId);

  if (pool.length === 0) {
    return [];
  }

  const normalizedCategory = normalizeValue(product.category);
  const normalizedBrand = normalizeValue(product.brand);

  const preferredProducts = pool.filter((item) => {
    const itemCategory = normalizeValue(item.category);
    const itemBrand = normalizeValue(item.brand);

    return (
      (normalizedCategory && itemCategory === normalizedCategory) ||
      (normalizedBrand && itemBrand === normalizedBrand)
    );
  });

  const mergedProducts = [...preferredProducts, ...pool];
  const uniqueProducts = Array.from(
    new Map(
      mergedProducts.map((item) => [(item._id || item.id), item])
    ).values()
  );

  return uniqueProducts.slice(0, 4);
};

function RelatedProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productId = product._id || product.id;
  const currentPrice = getCurrentPrice(product);
  const originalPrice = getOriginalPrice(product);
  const hasDiscount =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < originalPrice;
  const discountPercent = getDiscountPercent(product);

  return (
    <Link
      to={`/products/${productId}`}
      state={{ product }}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative overflow-hidden bg-[#f3f1eb]">
          <div className="aspect-[0.95] overflow-hidden">
            <img
              src={getPrimaryImage(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="space-y-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {product.brand || "Premium shoes"}
          </p>

          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950 transition-colors duration-300 group-hover:text-amber-700">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-amber-400">
            {renderStars(product.rating)}
            <span className="ml-1 text-[11px] text-slate-400">
              {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <p className="text-sm font-bold text-slate-950">
              {formatCurrency(currentPrice)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    selectedProduct,
    products,
    detailsLoading,
    detailsError,
    wishlistLoading,
    reviewLoading,
    reviewError,
    reviewSuccessMessage,
  } = useSelector((state) => state.products);

  const routeProduct = location.state?.product;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSort, setReviewSort] = useState("latest");
  const [visibleReviews, setVisibleReviews] = useState(REVIEW_BATCH_SIZE);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const initializedProductId = useRef(null);

  useEffect(() => {
    dispatch(fetchProductById(id));

    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch, id, products.length]);

  const product = useMemo(() => {
    if (selectedProduct && selectedProduct._id === id) {
      return selectedProduct;
    }

    if (routeProduct && (routeProduct._id === id || routeProduct.id === id)) {
      return routeProduct;
    }

    return null;
  }, [selectedProduct, routeProduct, id]);

  const productKey = product?._id || product?.id || "";

  const images = useMemo(() => {
    return product?.images?.length ? product.images : [FALLBACK_IMAGE];
  }, [product]);

  const colors = useMemo(() => getAvailableColors(product), [product]);

  const variantsForColor = useMemo(() => {
    if (!product?.variants?.length) {
      return [];
    }

    if (!selectedColor) {
      return product.variants;
    }

    return product.variants.filter(
      (variant) => normalizeValue(variant.color) === normalizeValue(selectedColor)
    );
  }, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    const sizes = getAvailableSizes(variantsForColor);

    if (sizes.length > 0) {
      return sizes;
    }

    const fallbackSizes = getAvailableSizes(product?.variants || []);

    return fallbackSizes.length > 0 ? fallbackSizes : DEFAULT_SHOE_SIZES;
  }, [variantsForColor, product]);

  const selectedVariant = useMemo(() => {
    return getVariantForSelection(product, selectedColor, selectedSize);
  }, [product, selectedColor, selectedSize]);

  const currentPrice = getCurrentPrice(product);
  const originalPrice = getOriginalPrice(product);
  const hasDiscount =
    Number(product?.discountPrice) > 0 &&
    Number(product?.discountPrice) < originalPrice;
  const discountPercent = getDiscountPercent(product);
  const inStock = selectedVariant
    ? Number(selectedVariant.stock) > 0
    : Number(product?.countInStock) > 0;
  const stockValue = selectedVariant
    ? Number(selectedVariant.stock || 0)
    : Number(product?.countInStock || 0);
  const ratingValue = Number(product?.rating || 0);
  const reviewCount = Array.isArray(product?.reviews)
    ? product.reviews.length
    : Number(product?.numReviews || 0);

  const sortedReviews = useMemo(() => {
    const nextReviews = Array.isArray(product?.reviews)
      ? [...product.reviews]
      : [];

    switch (reviewSort) {
      case "oldest":
        nextReviews.sort(
          (firstReview, secondReview) =>
            new Date(firstReview.createdAt) - new Date(secondReview.createdAt)
        );
        break;
      case "highest":
        nextReviews.sort(
          (firstReview, secondReview) =>
            Number(secondReview.rating || 0) - Number(firstReview.rating || 0)
        );
        break;
      case "lowest":
        nextReviews.sort(
          (firstReview, secondReview) =>
            Number(firstReview.rating || 0) - Number(secondReview.rating || 0)
        );
        break;
      case "latest":
      default:
        nextReviews.sort(
          (firstReview, secondReview) =>
            new Date(secondReview.createdAt) - new Date(firstReview.createdAt)
        );
        break;
    }

    return nextReviews;
  }, [product, reviewSort]);

  const visibleReviewItems = sortedReviews.slice(0, visibleReviews);

  const relatedProducts = useMemo(
    () => getRelatedProducts(products, product),
    [products, product]
  );

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    if (initializedProductId.current === productKey) {
      return;
    }

    initializedProductId.current = productKey;

    const firstVariant =
      product.variants?.find((variant) => Number(variant.stock) > 0) ||
      product.variants?.[0] ||
      null;

    const initialColor = firstVariant?.color || colors[0] || "";
    const initialSize =
      firstVariant?.size !== undefined && firstVariant?.size !== null
        ? String(firstVariant.size)
        : availableSizes[0] || DEFAULT_SHOE_SIZES[0];

    setSelectedImage(0);
    setSelectedColor(initialColor);
    setSelectedSize(initialSize);
    setQuantity(1);
    setActiveTab("reviews");
    setShowReviewForm(false);
    setReviewSort("latest");
    setVisibleReviews(REVIEW_BATCH_SIZE);
    setReviewForm({
      rating: 5,
      comment: "",
    });
  }, [product, colors, availableSizes, productKey]);

  useEffect(() => {
    setVisibleReviews(REVIEW_BATCH_SIZE);
  }, [reviewSort, product?._id]);

  const handleWishlistToggle = async () => {
    if (!product) {
      return;
    }

    try {
      const response = await dispatch(
        toggleProductWishlist(productKey)
      ).unwrap();

      toast.success(response?.message || "Wishlist updated");
    } catch (error) {
      toast.error(error?.message || "Wishlist update failed");
    }
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setSelectedImage(0);
    setQuantity(1);

    const colorVariants = Array.isArray(product?.variants)
      ? product.variants.filter(
          (variant) => normalizeValue(variant.color) === normalizeValue(color)
        )
      : [];

    const nextVariant =
      colorVariants.find((variant) => Number(variant.stock) > 0) ||
      colorVariants[0] ||
      null;

    if (nextVariant?.size !== undefined && nextVariant?.size !== null) {
      setSelectedSize(String(nextVariant.size));
      return;
    }

    const nextSizes = getAvailableSizes(colorVariants);
    setSelectedSize(nextSizes[0] || DEFAULT_SHOE_SIZES[0]);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(String(size));
    setQuantity(1);
  };

  const handleQuantityChange = (direction) => {
    const maxQuantity = Math.max(1, stockValue || 1);

    setQuantity((current) => {
      if (direction === "decrease") {
        return Math.max(1, current - 1);
      }

      return Math.min(maxQuantity, current + 1);
    });
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (!inStock) {
      toast.error("This size is sold out");
      return;
    }

    toast.success(`${product.name} added to your cart selection`);
  };

  const handleReviewChange = (field, value) => {
    setReviewForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!reviewForm.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const response = await dispatch(
        createProductReview({
          productId: id,
          reviewData: {
            rating: Number(reviewForm.rating),
            comment: reviewForm.comment.trim(),
          },
        })
      ).unwrap();

      toast.success(response?.message || "Review submitted");
      setReviewForm({
        rating: 5,
        comment: "",
      });
      setShowReviewForm(false);
      setVisibleReviews(REVIEW_BATCH_SIZE);
      dispatch(fetchProductById(id));
    } catch (error) {
      toast.error(error?.message || "Review could not be submitted");
    }
  };

  if (detailsLoading && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef]">
        <Loader2 size={52} className="animate-spin text-slate-700" />
      </div>
    );
  }

  if (detailsError && !product) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-center text-rose-600">
          {detailsError}
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const tabs = [
    { key: "details", label: "Product Details" },
    { key: "reviews", label: "Rating & Reviews" },
    { key: "faqs", label: "FAQs" },
  ];

  return (
    <section className="min-h-screen bg-[#f7f5ef] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          <Link to="/" className="transition hover:text-slate-950">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="transition hover:text-slate-950">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span>{formatLabel(product.gender || "Shoes")}</span>
          <ChevronRight size={12} />
          <span>{formatLabel(product.category || "Sneakers")}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="grid gap-4 xl:grid-cols-[96px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto xl:order-1 xl:flex-col xl:overflow-visible">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    selectedImage === index
                      ? "border-slate-950 shadow-lg"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm xl:order-2">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-[#f3f1eb]">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Toggle wishlist"
                >
                  {wishlistLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Heart size={18} />
                  )}
                </button>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[selectedImage]}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    src={images[selectedImage]}
                    alt={product.name}
                    className="h-[420px] w-full object-contain p-6 sm:h-[520px]"
                  />
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {product.brand || "Premium shoes"} /{" "}
              {product.category || "Sneakers"}
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-slate-950 sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {renderStars(ratingValue)}
                <span className="ml-2 text-sm text-slate-500">
                  {ratingValue.toFixed(1)} / 5
                </span>
              </div>

              <span className="text-sm text-slate-400">
                ({reviewCount} reviews)
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-slate-950">
                {formatCurrency(currentPrice)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {product.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Select Colors
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {colors.length > 0 ? (
                      colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleSelectColor(color)}
                          className={`h-10 w-10 rounded-full border-2 transition ${
                            normalizeValue(selectedColor) === normalizeValue(color)
                              ? "border-slate-950 ring-4 ring-slate-950/10"
                              : "border-white shadow-sm hover:scale-105"
                          }`}
                          style={{ backgroundColor: resolveSwatchColor(color) }}
                          title={color}
                          aria-label={`Select ${color}`}
                        />
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No color variants available
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Stock
                  </p>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      inStock ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {inStock ? `${stockValue} available` : "Sold out"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Choose Size
                </p>

                <span className="text-xs text-slate-400">
                  Shoe sizes
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSize(size)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      normalizeValue(selectedSize) === normalizeValue(size)
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-full border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={!inStock}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-12 px-3 text-center text-sm font-semibold text-slate-950">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={!inStock}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add to Cart
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
              <span className="rounded-full bg-slate-50 px-3 py-2">
                Free shipping
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-2">
                30-day returns
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-2">
                Secure checkout
              </span>
            </div>
          </section>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "text-slate-950"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-slate-950" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {activeTab === "details" && (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Overview
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {product.description}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Highlights
                  </p>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex items-start gap-3">
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      Authentic product data from the backend.
                    </li>
                    <li className="flex items-start gap-3">
                      <Truck size={16} className="mt-0.5 shrink-0 text-slate-700" />
                      Fast dispatch for in-stock variants.
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageSquareText
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-700"
                      />
                      Review and rating support stays attached to the same item.
                    </li>
                  </ul>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Specs
                  </p>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-4">
                      <span>Brand</span>
                      <span className="font-semibold text-slate-950">
                        {product.brand || "Premium shoes"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Category</span>
                      <span className="font-semibold text-slate-950">
                        {formatLabel(product.category || "Sneakers")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Gender</span>
                      <span className="font-semibold text-slate-950">
                        {formatLabel(product.gender || "Unisex")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <section>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      All Reviews ({reviewCount})
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      Rating & Reviews
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={reviewSort}
                      onChange={(event) => setReviewSort(event.target.value)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      <option value="latest">Latest</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="oldest">Oldest</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm((current) => !current)}
                      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {showReviewForm ? "Hide Form" : "Write a Review"}
                    </button>
                  </div>
                </div>

                {(reviewError || reviewSuccessMessage) && (
                  <div
                    className={`mt-6 rounded-[1.5rem] px-4 py-3 text-sm ${
                      reviewError
                        ? "border border-rose-200 bg-rose-50 text-rose-600"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {reviewError || reviewSuccessMessage}
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {showReviewForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleReviewSubmit}
                      className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Rating
                          </label>
                          <select
                            value={reviewForm.rating}
                            onChange={(event) =>
                              handleReviewChange("rating", event.target.value)
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Comment
                          </label>
                          <textarea
                            rows="5"
                            value={reviewForm.comment}
                            onChange={(event) =>
                              handleReviewChange("comment", event.target.value)
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            placeholder="Tell other shoppers what you liked or what could be better."
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {reviewLoading ? "Submitting review..." : "Submit Review"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {visibleReviewItems.length > 0 ? (
                    visibleReviewItems.map((review) => (
                      <article
                        key={review._id || `${review.user}-${review.createdAt}`}
                        className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-950">
                                {review.name}
                              </h3>
                              <ShieldCheck
                                size={14}
                                className="text-emerald-500"
                              />
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 text-amber-400">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {review.comment}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500 md:col-span-2">
                      No reviews yet. Be the first to share feedback for this
                      product.
                    </div>
                  )}
                </div>

                {visibleReviews < sortedReviews.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleReviews((current) =>
                          Math.min(current + REVIEW_BATCH_SIZE, sortedReviews.length)
                        )
                      }
                      className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      Load More Reviews
                    </button>
                  </div>
                )}
              </section>
            )}

            {activeTab === "faqs" && (
              <div className="grid gap-4">
                {[
                  {
                    question: "How do I choose the right shoe size?",
                    answer:
                      "Use the shoe size chips above and match them against your usual sneaker size. If the pair fits narrow, consider one size up.",
                  },
                  {
                    question: "Can I return the shoes if they do not fit?",
                    answer:
                      "Yes. The page is designed around a friendly return policy, so customers can request a return if the sizing is off.",
                  },
                  {
                    question: "Are the product photos and reviews linked to the same item?",
                    answer:
                      "They are pulled from the same product document returned by the backend, so the gallery, ratings, and reviews stay in sync.",
                  },
                ].map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-950">
                      <span>{faq.question}</span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </summary>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="space-y-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              You might also like
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950">
              Recommended Products
            </h2>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-6 text-sm text-slate-500 shadow-sm">
              More shoes will appear here once the full product list is loaded.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
