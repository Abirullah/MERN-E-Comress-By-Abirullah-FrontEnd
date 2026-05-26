import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
    <section className="relative min-h-screen bg-[#f8f8f8] px-6 py-24 md:px-16">
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-gray-200 opacity-50 blur-[120px]" />

      <div className="relative z-10 mb-20 text-center">
        <p className="mb-4 text-sm uppercase tracking-[8px] text-gray-500">
          {subtitle}
        </p>
        <h1 className="text-5xl font-black text-black md:text-7xl">
          {title}
        </h1>
        <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-black" />
      </div>

      <div className="relative z-10 flex justify-center">
        <div className="relative w-full xl:w-[85%]">
          <button
            onClick={() => scrollLeft(reference)}
            className="absolute -left-5 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 hover:bg-black hover:text-white xl:flex"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={() => scrollRight(reference)}
            className="absolute -right-5 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 hover:bg-black hover:text-white xl:flex"
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
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader2 size={48} className="animate-spin text-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="bg-white px-6 py-20 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-center text-rose-600">
          {error}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white px-6 py-20 md:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 text-center text-slate-600">
          Add products in the backend first, then this section will render them
          automatically.
        </div>
      </section>
    );
  }

  return (
    <div className="relative w-full bg-black">
      {renderProductStrip(
        "Best Selling",
        "Product Collection",
        bestSelling,
        bestSellingRef
      )}

      <section className="sticky top-0 h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Sneaker Banner"
          className="h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-6 text-sm uppercase tracking-[10px]">
            Premium Sneakers
          </p>

          <h1 className="text-5xl font-black leading-none md:text-8xl">
            STREET
            <br />
            CULTURE
          </h1>

          <NavLink
            to="/shop"
            className="mt-10 rounded-full border border-white px-8 py-4 transition-all duration-500 hover:bg-white hover:text-black"
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
