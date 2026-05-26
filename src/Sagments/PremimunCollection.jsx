import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  toggleProductWishlist,
} from "../ReduxSetUp/Feature/Products/ProductSlice";
import { useNavigate } from "react-router-dom";

function PremimunCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);

  const [current, setCurrent] = useState(0);

  const currentProduct = products[current];

  console.log("Current Product:", currentProduct); 

  function AddToChart(id) {
    const UserInfor = JSON.parse(localStorage.getItem("userInfo"));

    if (!UserInfor) {
      navigate("/login");
      return;
    }

    dispatch(toggleProductWishlist(id));
    
  }

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Auto Change Product
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  // Loading State
  if (products.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-16 overflow-hidden">
      <div className="w-full lg:w-[85%] bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[650px]">
          
          {/* LEFT SIDE IMAGE */}
          <div className="relative h-full overflow-hidden">
            <img
            
              key={currentProduct._id}
              src = {currentProduct.images[0]}
              alt={currentProduct.name}
              className="w-full h-full object-cover animate-fade"
            />

            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-12">
            <p className="text-gray-500 uppercase tracking-[5px] mb-4">
              Premium Collection
            </p>

            <h1
              key={currentProduct.name}
              className="text-5xl md:text-6xl font-bold text-black leading-tight animate-slide"
            >
              {currentProduct.name}
            </h1>

            <p className="text-2xl font-semibold text-gray-700 mt-6">
              {currentProduct.price}
            </p>

            <p className="text-gray-600 mt-6 leading-8 text-lg max-w-[500px]">
              {currentProduct.desc}
            </p>

            <button
              className="mt-10 w-fit px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition duration-300 hover:scale-105"
              onClick={() => AddToChart(currentProduct._id)}
            >
              Add To Cart
            </button>

            {/* Indicators */}
            <div className="flex gap-3 mt-12">
              {products.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    current === index
                      ? "w-10 bg-black"
                      : "w-3 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fade {
            from {
              opacity: 0;
              transform: scale(1.1);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slide {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade {
            animation: fade 1s ease;
          }

          .animate-slide {
            animation: slide 0.8s ease;
          }
        `}
      </style>
    </div>
  );
}

export default PremimunCollection;