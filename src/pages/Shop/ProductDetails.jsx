import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearProductMessages,
  createProductReview,
  fetchProductById,
  toggleProductWishlist,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

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

const buildVariantKey = (variant) => `${variant.size}-${variant.color}`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedProduct,
    detailsLoading,
    detailsError,
    wishlistLoading,
    reviewLoading,
    reviewError,
    reviewSuccessMessage,
  } = useSelector((state) => state.products);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariantKey, setSelectedVariantKey] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch, id]);

  const product =
    selectedProduct && selectedProduct._id === id
      ? selectedProduct
      : null;

  const images = useMemo(() => {
    if (!product?.images?.length) {
      return [FALLBACK_IMAGE];
    }

    return product.images;
  }, [product]);

  const colors = useMemo(() => {
    const variantColors = product?.variants?.map((variant) => variant.color) || [];
    return [...new Set(variantColors.filter(Boolean))];
  }, [product]);

  const visibleVariants = useMemo(() => {
    if (!product?.variants?.length) {
      return [];
    }

    if (!selectedColor) {
      return product.variants;
    }

    return product.variants.filter(
      (variant) => variant.color === selectedColor
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    return (
      product?.variants?.find(
        (variant) => buildVariantKey(variant) === selectedVariantKey
      ) || null
    );
  }, [product, selectedVariantKey]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const firstVariant =
      product.variants?.find((variant) => variant.stock > 0) ||
      product.variants?.[0];

    setSelectedImage(0);
    setSelectedColor(firstVariant?.color || "");
    setSelectedVariantKey(
      firstVariant ? buildVariantKey(firstVariant) : ""
    );
  }, [product]);

  const handleWishlistToggle = async () => {
    if (!product) {
      return;
    }

    try {
      const response = await dispatch(
        toggleProductWishlist(product._id)
      ).unwrap();

      toast.success(response?.message || "Wishlist updated");
    } catch (error) {
      toast.error(error?.message || "Wishlist update failed");
    }
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
      dispatch(fetchProductById(id));
    } catch (error) {
      toast.error(error?.message || "Review could not be submitted");
    }
  };

  if (detailsLoading && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf8]">
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

  const currentPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);
  const isInStock =
    selectedVariant?.stock > 0 ||
    (!selectedVariant && Number(product.countInStock) > 0);

  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 pb-16 pt-28 text-[#111] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex gap-3 overflow-x-auto lg:flex-col">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setSelectedImage(index)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                  selectedImage === index
                    ? "border-black shadow-lg"
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

          <div className="relative flex-1 overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <div className="absolute right-5 top-5 z-20 flex gap-3">
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {wishlistLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Heart size={18} />
                )}
              </button>
            </div>

            <div className="min-h-[520px] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_55%)] p-8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[selectedImage]}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-[460px] w-full object-contain"
                />
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="rounded-[2.25rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>{product.brand || "Premium"}</span>
            <span>{product.category || "Shoes"}</span>
            <span>{product.gender || "Unisex"}</span>
            <span>{product.status || "New Arrival"}</span>
          </div>

          <h1
            className="mt-4 text-4xl font-light leading-tight text-black lg:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.name}
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-4xl font-extralight tracking-tight">
              {formatCurrency(currentPrice)}
            </span>

            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}

            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                isInStock
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {isInStock ? "In Stock" : "Sold Out"}
            </span>
          </div>

          {colors.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                Available colors
              </p>

              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {visibleVariants.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Choose size
                </p>

                {selectedVariant && (
                  <p className="text-xs text-slate-500">
                    Stock: {selectedVariant.stock}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {visibleVariants.map((variant) => {
                  const variantKey = buildVariantKey(variant);
                  const isAvailable = Number(variant.stock) > 0;

                  return (
                    <button
                      key={variantKey}
                      disabled={!isAvailable}
                      onClick={() => setSelectedVariantKey(variantKey)}
                      className={`rounded-2xl border py-3 text-sm transition-all ${
                        !isAvailable
                          ? "cursor-not-allowed border-gray-100 text-gray-300"
                          : selectedVariantKey === variantKey
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-gray-200 hover:border-black"
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {wishlistLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Heart size={18} />
              )}
              Toggle Wishlist
            </button>

            <Link
              to="/shop"
              className="flex flex-1 items-center justify-center rounded-full border border-slate-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Back to Shop
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-slate-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Fast dispatch
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Orders are prepared quickly once the product is in stock.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Authentic product data
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                This page is reading the same product document returned by your
                backend API.
              </p>
            </div>
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <MessageSquareText size={18} className="text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
          </div>

          <div className="mt-6 space-y-4">
            {product.reviews?.length > 0 ? (
              product.reviews.map((review) => (
                <div
                  key={review._id || `${review.user}-${review.createdAt}`}
                  className="rounded-[1.5rem] bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={
                            index < Number(review.rating)
                              ? "fill-current"
                              : ""
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-500">
                No reviews yet. Be the first to share feedback for this product.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-bold text-slate-900">
            Write a review
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Submit feedback directly to the backend review endpoint for this
            product.
          </p>

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

          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
            <div>
              <label className="field-label">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(event) =>
                  handleReviewChange("rating", event.target.value)
                }
                className="field-input"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="field-label">Comment</label>
              <textarea
                rows="5"
                value={reviewForm.comment}
                onChange={(event) =>
                  handleReviewChange("comment", event.target.value)
                }
                className="field-input min-h-36 resize-y"
                placeholder="Tell other shoppers what you liked or what could be better."
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reviewLoading ? "Submitting review..." : "Submit review"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
