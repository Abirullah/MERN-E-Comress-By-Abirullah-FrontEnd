import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  clearProductMessages,
  fetchProducts,
} from "../ReduxSetUp/Feature/Products/ProductSlice";
import { buildShopLink } from "../utils/shopLinks";

const heroImage = "/Pictures/pexels-ian-panelo-7716266.jpg";

function ProductsSections() {
  const dispatch = useDispatch();
  const bestSellingRef = useRef(null);
  const newArrivalRef  = useRef(null);

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    return () => { dispatch(clearProductMessages()); };
  }, [dispatch, products.length]);

  const bestSelling = useMemo(() =>
    [...products]
      .sort((a, b) => {
        const r = Number(b.rating || 0) - Number(a.rating || 0);
        return r !== 0 ? r : Number(b.numReviews || 0) - Number(a.numReviews || 0);
      })
      .slice(0, 8),
  [products]);

  const newArrivals = useMemo(() =>
    [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8),
  [products]);

  const scrollLeft  = (ref) => ref.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = (ref) => ref.current?.scrollBy({ left:  320, behavior: "smooth" });

  /* ── Product strip ── */
  const renderProductStrip = (title, subtitle, productsList, reference) => (
    <section className="relative bg-[#080808] py-14 sm:py-20 md:py-24 px-0 md:px-16">

      {/* ambient glow */}
      <div className="absolute left-0 top-0 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#d4a544]/5 opacity-50 blur-[100px] sm:blur-[120px] pointer-events-none" />

      {/* heading */}
      <div className="relative z-10 mb-10 sm:mb-16 md:mb-20 px-5 sm:px-0 text-center">
        <p className="mb-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#d4a544]">
          {subtitle}
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-[#ddd4be]">
          {title}
        </h1>
        <div className="mx-auto mt-4 sm:mt-6 h-0.5 sm:h-1 w-16 sm:w-28 rounded-full bg-[#d4a544]" />
      </div>

      {/* scroll strip */}
      <div className="relative z-10 flex justify-center">
        <div className="relative w-full xl:w-[85%]">

          {/* arrow buttons — desktop only */}
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

          {/* cards row */}
          <div
            ref={reference}
            className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto px-4 sm:px-6 py-4 sm:py-6 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {productsList.map((product) => (
              <div
                key={product._id}
                className="min-w-[240px] sm:min-w-[280px] md:min-w-[320px] flex-shrink-0 flex"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* mobile swipe hint — fades out after first render */}
          <p className="mt-2 text-center text-[9px] uppercase tracking-[0.2em] text-[#333] sm:hidden select-none">
            swipe to explore →
          </p>
        </div>
      </div>
    </section>
  );

  /* ── States ── */
  if (loading && products.length === 0) return <Loader fullScreen />;

  if (error)
    return (
      <section className="bg-[#080808] px-5 py-16 sm:px-6 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#4a2d2d] bg-gradient-to-r from-[#2e1a1a] to-[#0e0e0e] px-6 py-5 text-center">
          <p className="text-[#e57373] uppercase tracking-[0.15em] text-[10px] font-semibold mb-2">Error</p>
          <p className="text-[11px] text-[#8b7070]">{error}</p>
        </div>
      </section>
    );

  if (products.length === 0)
    return (
      <section className="bg-[#080808] px-5 py-16 sm:px-6 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-5 text-center text-[#5a5a5a] text-sm">
          Add products in the backend first, then this section will render them automatically.
        </div>
      </section>
    );

  return (
    <div className="relative w-full bg-[#080808]">

      {/* Best Selling */}
      {renderProductStrip("Best Selling", "Product Collection", bestSelling, bestSellingRef)}

      {/* ── Hero banner — sticky so New Arrivals scrolls over it ── */}
      <div className="sticky top-0 h-[60vh] sm:h-[70vh] md:h-screen [height:100dvh] overflow-hidden">
        <img
          src={heroImage}
          alt="Sneaker Banner"
          className="h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

        {/* sm: centered | md+: left-aligned */}
        <div className="absolute inset-0 flex flex-col justify-center
          items-center text-center px-5
          md:items-start md:text-left md:px-20 lg:px-28">

          <p className="mb-4 sm:mb-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#d4a544]">
            Premium Sneakers
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none text-[#c2c1c1]">
            STREET
            <br />
            CULTURE
          </h1>

          <Link
            to={buildShopLink({ brand: "nike" })}
            className="mt-8 sm:mt-10 inline-flex items-center gap-2 rounded-lg bg-[#d4a544] px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#080808] transition-all duration-500 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* New Arrivals — sits above sticky hero, scrolls over it */}
      <div className="relative z-10 bg-[#080808]">
        {renderProductStrip("New Arrivals", "Latest Drops", newArrivals, newArrivalRef)}
      </div>
    </div>
  );
}

export default ProductsSections;