import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import {
  clearProductMessages,
  fetchProducts,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch, products.length]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextProducts = [...products];

    const searchedProducts = normalizedSearch
      ? nextProducts.filter((product) => {
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
        })
      : nextProducts;

    switch (sortType) {
      case "low":
        searchedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high":
        searchedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name":
        searchedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        searchedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    return searchedProducts;
  }, [products, searchTerm, sortType]);

  return (
    <section className="min-h-screen bg-[#f5f5f3] py-16">
      <div className="mx-auto mt-16 max-w-7xl px-5 lg:px-8">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>

            <h1 className="text-5xl font-bold leading-tight text-[#2a2a2a] md:text-6xl">
              Discover Your
              <span className="block text-[#6f6d4f]">
                Perfect Sneakers
              </span>
            </h1>

          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => setShowFilters((current) => !current)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#6f6d4f] px-6 py-3 text-white transition-all duration-300 hover:scale-105"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-[#6f6d4f] sm:w-[280px]"
              />

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-lg text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-4">
              <span className="text-gray-500">Sort By:</span>

              <select
                value={sortType}
                onChange={(event) => setSortType(event.target.value)}
                className="rounded-full bg-[#f5f5f3] px-5 py-3 outline-none"
              >
                <option value="default">Default</option>
                <option value="newest">Newest</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={50} className="animate-spin text-[#6f6d4f]" />
          </div>
        )}

        {error && (
          <div className="mb-10 rounded-2xl bg-red-100 px-6 py-4 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-700">
              No Products Found
            </h2>

            <p className="text-gray-500">
              Try searching with another keyword or add products from the
              backend admin flow.
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex justify-center">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ShopPage;
