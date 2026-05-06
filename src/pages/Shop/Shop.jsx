import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useGetProductsQuery,
  useToggleWishlistMutation,
} from "../../redux/api/productsApiSlice";
import { formatCurrency } from "../../utils/formatters";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeWishlistId, setActiveWishlistId] = useState(null);

  const { data: products = [], isLoading, error, refetch } = useGetProductsQuery();
  const [toggleWishlist] = useToggleWishlistMutation();

  const categories = useMemo(
    () => [
      "All",
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleWishlist = async (productId) => {
    setActiveWishlistId(productId);

    try {
      const response = await toggleWishlist(productId).unwrap();
      toast.success(response?.message || "Wishlist updated");
    } catch (requestError) {
      toast.error(
        requestError?.data?.message ||
          requestError?.message ||
          "Wishlist request failed"
      );
    } finally {
      setActiveWishlistId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="grid gap-6 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <span className="muted-chip">Preview catalog</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Browse a seeded product catalog while you build the storefront UI.
            </h1>
            <p className="mt-4 section-copy max-w-2xl">
              Products, wishlist actions, and reviews are all powered by local
              preview data so interaction design can move faster.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700">Products</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {products.length}
              </p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-700">Categories</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {Math.max(categories.length - 1, 0)}
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">Featured</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {products.filter((product) => product.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-card p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="shop-search" className="field-label">
              Search products
            </label>
            <input
              id="shop-search"
              type="text"
              className="field-input"
              placeholder="Search by name, brand, category, or tag"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category ? "primary-button" : "secondary-button"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="app-card p-6">
          <Message variant="error">
            {error?.data?.message || error?.message || "Products could not be loaded."}
          </Message>
          <button type="button" className="secondary-button mt-4" onClick={refetch}>
            Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="app-card p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No products match this filter</h2>
          <p className="mt-3 section-copy">
            Try a different search term or reset to all categories.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const heroImage = product.images?.[0] || "https://via.placeholder.com/800x600?text=Product";

            return (
              <article key={product._id} className="app-card overflow-hidden">
                <img
                  src={heroImage}
                  alt={product.name}
                  className="h-60 w-full object-cover"
                />
                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="muted-chip">{product.category || "Shoes"}</span>
                    {product.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={`${product._id}-${tag}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {product.brand} · {product.gender}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
                    <div>
                      <p className="text-slate-500">Price</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatCurrency(product.discountPrice || product.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Stock</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {product.countInStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Reviews</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {product.reviews?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to={`/products/${product._id}`} className="primary-button">
                      View details
                    </Link>
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={activeWishlistId === product._id}
                      onClick={() => handleWishlist(product._id)}
                    >
                      {activeWishlistId === product._id
                        ? "Updating..."
                        : "Toggle wishlist"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Shop;
