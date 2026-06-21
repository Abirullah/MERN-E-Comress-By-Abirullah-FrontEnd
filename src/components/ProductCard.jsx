import { Eye, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const formatCurrency = (amount) => {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const getPrimaryImage = (product) => {
  return product?.images?.[0] || FALLBACK_IMAGE;
};

const renderStars = (rating = 0) => {
  const normalizedRating = Number(rating || 0);

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={12}
      className={
        index < Math.round(normalizedRating)
          ? "fill-[#d4a544] text-[#d4a544]"
          : "text-[#333]"
      }
    />
  ));
};

function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productId = product._id || product.id;
  const currentPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);
  const inStock = Number(product.countInStock) > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
    : 0;

  return (
    <div
      className="
        group
        relative
        flex
        h-full
        w-full
        max-w-[400px]
        flex-col
        overflow-hidden
        rounded-[1.75rem]
        border
        border-[#1e1e1e]
        bg-[#0e0e0e]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
        hover:shadow-[#d4a544]/5
        hover:border-[#d4a544]/30
      "
    >
      <div className="relative h-[320px] overflow-hidden bg-[#1a1a1a]">
        <Link to={`/products/${productId}`} state={{ product }}>
          <img
            src={getPrimaryImage(product)}
            alt={product.name}
            className="
              h-full
              w-full
              object-cover
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:-translate-y-2
            "
          />
        </Link>

        {discountPercent > 0 && (
          <span className="absolute left-5 top-5 rounded-lg bg-[#d4a544] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#080808]">
            {discountPercent}% off
          </span>
        )}

        <div
          className="
            absolute
            right-5
            top-5
            flex
            translate-x-10
            flex-col
            gap-3
            opacity-0
            transition-all
            duration-500
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          <Link
            to={`/products/${productId}`}
            state={{ product }}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#0e0e0e]
              border
              border-[#1e1e1e]
              text-[#ddd4be]
              shadow-lg
              transition-all
              duration-300
              hover:bg-[#d4a544]
              hover:text-[#080808]
              hover:border-[#d4a544]
            "
            aria-label={`View ${product.name}`}
          >
            <Eye size={18} />
          </Link>

          <Link
            to={`/checkout/${productId}`}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#0e0e0e]
              border
              border-[#1e1e1e]
              text-[#ddd4be]
              shadow-lg
              transition-all
              duration-300
              hover:bg-[#d4a544]
              hover:text-[#080808]
              hover:border-[#d4a544]
            "
            aria-label={`Buy ${product.name}`}
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-6 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5a5a5a]">
            {product.brand || product.category || "Premium shoes"}
          </p>

          <Link to={`/products/${productId}`} state={{ product }}>
            <h2 className="mt-2 text-xl font-bold text-[#ddd4be] transition-colors duration-300 group-hover:text-[#d4a544] line-clamp-2">
              {product.name}
            </h2>
          </Link>

          <div className="flex items-center gap-1 mt-2">
            {renderStars(product.rating)}
            <span className="text-[11px] text-[#5a5a5a] ml-1">
              {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-[#6b6666]">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-[#ddd4be]">
              {formatCurrency(currentPrice)}
            </p>

            {hasDiscount && (
              <p className="text-sm text-[#5a5a5a] line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>

          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
              inStock ? "text-[#8fbc8f]" : "text-[#e57373]"
            }`}
          >
            {inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;