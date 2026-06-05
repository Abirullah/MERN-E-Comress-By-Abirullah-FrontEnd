import { Eye, ShoppingCart } from "lucide-react";
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
        border-white/70
        bg-[#ebeaea]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      <div className="relative h-[320px] overflow-hidden bg-[#e9eaea]">
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

        {product.off > 0 && (
          <span className="absolute left-5 top-5 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            {product.off}% off
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
              bg-white
              shadow-lg
              transition
              hover:bg-black
              hover:text-white
            "
            aria-label={`View ${product.name}`}
          >
            <Eye size={20} />
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
              bg-white
              shadow-lg
              transition
              hover:bg-black
              hover:text-white
            "
            aria-label={`Open ${product.name}`}
          >
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-gray-500">
            {product.brand || product.category || "Premium shoes"}
          </p>

          <Link to={`/products/${productId}`} state={{ product }}>
            <h2 className="mt-2 text-2xl font-bold text-black transition-colors duration-300 group-hover:text-amber-700">
              {product.name}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-black">
              {formatCurrency(currentPrice)}
            </p>

            {hasDiscount && (
              <p className="text-sm text-slate-400 line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>

          <span
            className={`text-sm font-medium ${
              inStock ? "text-green-600" : "text-rose-500"
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
