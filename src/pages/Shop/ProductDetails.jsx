import { useEffect, useMemo, useRef, useState  } from "react";
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
import { Link, useLocation, useParams , useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  clearProductMessages,
  createProductReview,
  fetchProductById,
  fetchProducts,
  toggleProductWishlist,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";
import Footer from "../../components/Footer";


const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const DEFAULT_SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const REVIEW_BATCH_SIZE = 4;


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

const renderStars = (rating = 0) => {
  const normalizedRating = Number(rating || 0);

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={
        index < Math.round(normalizedRating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
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
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative overflow-hidden bg-gray-50">
          <div className="aspect-square overflow-hidden">
            <img
              src={getPrimaryImage(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold uppercase text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-600">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
            <span className="ml-1 text-xs text-gray-400">
              {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <p className="text-base font-bold text-gray-900">
              {formatCurrency(currentPrice)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
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


const navigate = useNavigate();

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
 const reviews = Array.isArray(product?.reviews) ? product.reviews : [];

const reviewCount = reviews.length;

const ratingValue =
  reviewCount > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={52} className="animate-spin text-gray-900" />
      </div>
    );
  }

  if (detailsError && !product) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="rounded-2xl border border-red-200 bg-red-100 px-6 py-5 text-center text-red-600">
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
    <>
    

      {/* Main Content */}
      <main className="bg-white mt-20">
        <div className=" lg:px-20  mx-auto px-4 sm:px-6  py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400 mb-6">
            <Link to="/" className="transition hover:text-gray-900">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="transition hover:text-gray-900">
              Shop
            </Link>
            <ChevronRight size={12} />
            <span>{formatLabel(product.gender || "Shoes")}</span>
            <ChevronRight size={12} />
            <span className="text-gray-700">{formatLabel(product.category || "Sneakers")}</span>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="w-full h-auto object-contain p-8"
                  />
                </AnimatePresence>
              </div>

              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-gray-900 shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
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
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  {product.brand || "Premium Shoes"} / {product.category || "Sneakers"}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(ratingValue)}
                </div>
                <span className="text-sm text-gray-500">
                  {ratingValue.toFixed(1)}/5
                </span>
                <span className="text-sm text-gray-400">
                  ({reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Choose Size
                  </p>
                  <span className="text-xs text-gray-400 underline cursor-pointer">
                    Size Guide
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
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Availability
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${
                    inStock ? "text-green-600" : "text-red-500"
                  }`}>
                    {inStock ? `${stockValue} in stock` : "Sold out"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={!inStock}
                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={!inStock}
                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => navigate(`/checkout/${selectedProduct._id}`, { state: { product, selectedVariant, quantity } })}

                // onClick={() => console.log("Add to cart", { product, selectedVariant, quantity })} 
                disabled={!inStock}
                className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              {/* Shipping Info */}
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-gray-500">
                <span className="rounded-full bg-gray-100 px-3 py-2">
                  Free shipping
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-2">
                  30-day returns
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-2">
                  Secure checkout
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12 border-t border-gray-200">
            <div className="flex gap-6 overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-1 py-4 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-6">
              {activeTab === "details" && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Overview
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {product.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Highlights
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-3">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-600" />
                        Authentic product from trusted brands
                      </li>
                      <li className="flex items-start gap-3">
                        <Truck size={16} className="mt-0.5 shrink-0 text-gray-700" />
                        Fast shipping on in-stock items
                      </li>
                      <li className="flex items-start gap-3">
                        <MessageSquareText size={16} className="mt-0.5 shrink-0 text-gray-700" />
                        Verified customer reviews
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Specifications
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Brand</span>
                        <span className="font-semibold text-gray-900">
                          {product.brand || "Premium Shoes"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category</span>
                        <span className="font-semibold text-gray-900">
                          {formatLabel(product.category || "Sneakers")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gender</span>
                        <span className="font-semibold text-gray-900">
                          {formatLabel(product.gender || "Unisex")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <section>
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        All Reviews ({reviewCount})
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-gray-900">
                        Customer Reviews
                      </h2>
                    </div>

                    <div className="flex gap-3">
                      <select
                        value={reviewSort}
                        onChange={(event) => setReviewSort(event.target.value)}
                        className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
                      >
                        <option value="latest">Latest</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                        <option value="oldest">Oldest</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setShowReviewForm((current) => !current)}
                        className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                      >
                        Write Review
                      </button>
                    </div>
                  </div>

                  {(reviewError || reviewSuccessMessage) && (
                    <div
                      className={`mb-6 rounded-xl px-4 py-3 text-sm ${
                        reviewError
                          ? "border border-red-200 bg-red-50 text-red-600"
                          : "border border-green-200 bg-green-50 text-green-700"
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
                        className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-5"
                      >
                        <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Rating
                            </label>
                            <select
                              value={reviewForm.rating}
                              onChange={(event) =>
                                handleReviewChange("rating", event.target.value)
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
                            >
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Very Good</option>
                              <option value="3">3 - Good</option>
                              <option value="2">2 - Fair</option>
                              <option value="1">1 - Poor</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Comment
                            </label>
                            <textarea
                              rows={4}
                              value={reviewForm.comment}
                              onChange={(event) =>
                                handleReviewChange("comment", event.target.value)
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400"
                              placeholder="Share your experience with this product..."
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={reviewLoading}
                          className="mt-4 rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-70"
                        >
                          {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="grid gap-4 md:grid-cols-2">
                    {visibleReviewItems.length > 0 ? (
                      visibleReviewItems.map((review) => (
                        <article
                          key={review._id || `${review.user}-${review.createdAt}`}
                          className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <h3 className="font-semibold text-gray-900">
                                {review.name}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                            <ShieldCheck size={14} className="text-green-500" />
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {review.comment}
                          </p>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-6 text-sm text-gray-500 text-center md:col-span-2">
                        No reviews yet. Be the first to review this product!
                      </div>
                    )}
                  </div>

                  {visibleReviews < sortedReviews.length && (
                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleReviews((current) =>
                            Math.min(current + REVIEW_BATCH_SIZE, sortedReviews.length)
                          )
                        }
                        className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
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
                        "Use the size guide above and match against your usual sneaker size. If you're between sizes, we recommend sizing up for comfort.",
                    },
                    {
                      question: "Can I return the shoes if they don't fit?",
                      answer:
                        "Yes! We offer a 30-day return policy. If the shoes don't fit, simply contact our support team to initiate a return.",
                    },
                    {
                      question: "Are the product photos accurate?",
                      answer:
                        "Yes, all product photos are taken from actual inventory. Colors may vary slightly based on your screen settings.",
                    },
                  ].map((faq, idx) => (
                    <details
                      key={idx}
                      className="rounded-xl border border-gray-200 p-5 group"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900">
                        <span>{faq.question}</span>
                        <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition" />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-12 flex flex-col gap-6">
            <div className="mb-6 justify-center flex flex-col items-center text-center">
              <p className="uppercase tracking-wide text-gray-400">
                Shop Related
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                You Might Also Like
              </h2>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <RelatedProductCard
                    key={relatedProduct._id || relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-6 text-sm text-gray-500 text-center">
                More products will appear here once available.
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Newsletter Section */}
      <div className="bg-gray-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              STAY UP TO DATE
            </h2>
            <p className="text-gray-300 mb-6">
              Get the latest offers and new arrivals
            </p>
            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-full border-0 px-5 py-3 text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetailsPage;