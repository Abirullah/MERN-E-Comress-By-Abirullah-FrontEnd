import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useCreateReviewMutation,
  useGetProductByIdQuery,
  useToggleWishlistMutation,
} from "../../redux/api/productsApiSlice";
import { formatCurrency, formatDate } from "../../utils/formatters";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [wishlistPending, setWishlistPending] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(id);
  const [toggleWishlist] = useToggleWishlistMutation();
  const [createReview, { isLoading: isSubmittingReview }] =
    useCreateReviewMutation();

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  const handleWishlist = async () => {
    setWishlistPending(true);

    try {
      const response = await toggleWishlist(id).unwrap();
      toast.success(response?.message || "Wishlist updated");
    } catch (requestError) {
      toast.error(
        requestError?.data?.message ||
          requestError?.message ||
          "Wishlist request failed"
      );
    } finally {
      setWishlistPending(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createReview({
        productId: id,
        rating,
        comment,
      }).unwrap();

      toast.success(response?.message || "Review added");
      setRating("5");
      setComment("");
      refetch();
    } catch (requestError) {
      toast.error(
        requestError?.data?.message ||
          requestError?.message ||
          "Review request failed"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app-card p-6">
        <Message variant="error">
          {error?.data?.message || error?.message || "Product could not be loaded."}
        </Message>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="secondary-button" onClick={refetch}>
            Try again
          </button>
          <Link to="/shop" className="primary-button">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const selectedImage =
    product.images?.[selectedImageIndex] ||
    product.images?.[0] ||
    "https://via.placeholder.com/1200x900?text=Product";
  const reviews = product.reviews || [];

  return (
    <div className="space-y-6">
      <Link to="/shop" className="secondary-button">
        Back to shop
      </Link>

      <section className="app-card overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-[26rem] w-full rounded-[1.75rem] object-cover"
            />
            <div className="grid grid-cols-4 gap-3">
              {(product.images || []).map((image, index) => (
                <button
                  key={`${product._id}-preview-${index}`}
                  type="button"
                  className={`overflow-hidden rounded-2xl border ${
                    selectedImageIndex === index
                      ? "border-slate-900"
                      : "border-slate-200"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="muted-chip">{product.category || "Shoes"}</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
                {product.name}
              </h1>
              <p className="mt-3 text-lg font-medium text-slate-500">
                {product.brand} · {product.gender} · {product.status}
              </p>
            </div>

            <p className="section-copy">{product.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Current price</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {formatCurrency(product.discountPrice || product.price)}
                </p>
                {product.discountPrice ? (
                  <p className="mt-1 text-sm text-slate-500 line-through">
                    {formatCurrency(product.price)}
                  </p>
                ) : null}
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Inventory</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {product.countInStock}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {product.variants?.length || 0} size and color variants
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-slate-900 p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Product actions
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="primary-button bg-white text-slate-900 hover:bg-slate-100"
                  disabled={wishlistPending}
                  onClick={handleWishlist}
                >
                  {wishlistPending ? "Updating..." : "Toggle wishlist"}
                </button>
                <button type="button" className="secondary-button border-white/30 bg-transparent text-white hover:bg-white/10">
                  {reviews.length} reviews
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Variants
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(product.variants || []).map((variant, index) => (
                  <div
                    key={`${product._id}-${variant.color}-${variant.size}-${index}`}
                    className="rounded-3xl border border-slate-200 p-4"
                  >
                    <p className="text-lg font-bold text-slate-900">
                      US {variant.size}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {variant.color} · {variant.stock} available
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(product.tags || []).map((tag) => (
                <span
                  key={`${product._id}-${tag}`}
                  className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="app-card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Leave a review</h2>
          <p className="mt-2 section-copy">
            Reviews are saved into local preview data so you can test the full
            detail-page UI.
          </p>

          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="rating" className="field-label">
                Rating
              </label>
              <select
                id="rating"
                className="field-input"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div>
              <label htmlFor="comment" className="field-label">
                Comment
              </label>
              <textarea
                id="comment"
                rows="5"
                className="field-input"
                placeholder="Share what stood out about the product"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </div>

        <div className="app-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Customer reviews</h2>
              <p className="mt-2 section-copy">
                {reviews.length > 0
                  ? "Recent feedback pulled from the local preview product record."
                  : "No reviews have been added yet."}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {reviews.length} total
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                Be the first person to review this product.
              </div>
            ) : (
              reviews.map((review) => (
                <article
                  key={review._id || `${review.user}-${review.createdAt}`}
                  className="rounded-3xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {review.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                      {review.rating}/5
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
