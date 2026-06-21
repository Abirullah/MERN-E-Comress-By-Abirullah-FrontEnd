import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import {
  clearProductMessages,
  fetchProducts,
} from "../ReduxSetUp/Feature/Products/ProductSlice";

const heroImage = "/Pictures/pexels-ian-panelo-7716266.jpg";

function ProductsSections() {
  const dispatch = useDispatch();
  const bestSellingRef = useRef(null);
  const newArrivalRef = useRef(null);

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch, products.length]);

  const bestSelling = useMemo(() => {
    return [...products]
      .sort((firstProduct, secondProduct) => {
        const ratingGap =
          Number(secondProduct.rating || 0) -
          Number(firstProduct.rating || 0);

        if (ratingGap !== 0) {
          return ratingGap;
        }

        return (
          Number(secondProduct.numReviews || 0) -
          Number(firstProduct.numReviews || 0)
        );
      })
      .slice(0, 8);
  }, [products]);

  const newArrivals = useMemo(() => {
    return [...products]
      .sort(
        (firstProduct, secondProduct) =>
          new Date(secondProduct.createdAt) -
          new Date(firstProduct.createdAt)
      )
      .slice(0, 8);
  }, [products]);

  const scrollLeft = (reference) => {
    reference.current?.scrollBy({
      left: -360,
      behavior: "smooth",
    });
  };

  const scrollRight = (reference) => {
    reference.current?.scrollBy({
      left: 360,
      behavior: "smooth",
    });
  };

  const renderProductStrip = (title, subtitle, productsList, reference) => (
    <section className="relative min-h-screen bg-[#080808] px-6 py-24 md:px-16">
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-[#d4a544]/5 opacity-50 blur-[120px]" />

      <div className="relative z-10 mb-20 text-center">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a544]">
          {subtitle}
        </p>
        <h1 className="text-5xl font-black text-[#ddd4be] md:text-7xl">
          {title}
        </h1>
        <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-[#d4a544]" />
      </div>

      <div className="relative z-10 flex justify-center">
        <div className="relative w-full xl:w-[85%]">
          <button
            onClick={() => scrollLeft(reference)}
            className="absolute -left-5 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e0e0e] border border-[#1e1e1e] shadow-2xl transition-all duration-300 hover:bg-[#d4a544] hover:text-[#080808] hover:border-[#d4a544] xl:flex"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={() => scrollRight(reference)}
            className="absolute -right-5 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e0e0e] border border-[#1e1e1e] shadow-2xl transition-all duration-300 hover:bg-[#d4a544] hover:text-[#080808] hover:border-[#d4a544] xl:flex"
          >
            <ChevronRight size={28} />
          </button>

          <div
            ref={reference}
            className="flex gap-8 overflow-x-auto px-4 py-6 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {productsList.map((product) => (
              <div
                key={product._id}
                className="min-w-[320px] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1e1e1e] border-t-[#d4a544] mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={20} className="text-[#d4a544]" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#6b6666] uppercase tracking-[0.18em]">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="bg-[#080808] px-6 py-20 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#4a2d2d] bg-gradient-to-r from-[#2e1a1a] to-[#0e0e0e] px-6 py-5 text-center">
          <p className="text-[#e57373] uppercase tracking-[0.15em] text-[10px] font-semibold mb-2">Error</p>
          <p className="text-[11px] text-[#8b7070]">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-[#080808] px-6 py-20 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-5 text-center text-[#5a5a5a]">
          Add products in the backend first, then this section will render them
          automatically.
        </div>
      </section>
    );
  }

  return (
    <div className="relative w-full bg-[#080808]">
      {renderProductStrip(
        "Best Selling",
        "Product Collection",
        bestSelling,
        bestSellingRef
      )}

      {/* Hero Section */}
      <section className="sticky top-0 h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Sneaker Banner"
          className="h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center px-6 text-center">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a544]">
            Premium Sneakers
          </p>

          <h1 className="text-5xl font-black leading-none text-[#c2c1c1] md:text-8xl">
            STREET
            <br />
            CULTURE
          </h1>

          <NavLink
            to="/shop"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[#d4a544] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-500 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20"
          >
            Explore Collection
          </NavLink>
        </div>
      </section>

      {renderProductStrip(
        "New Arrivals",
        "Latest Drops",
        newArrivals,
        newArrivalRef
      )}
    </div>
  );
}

export default ProductsSections;