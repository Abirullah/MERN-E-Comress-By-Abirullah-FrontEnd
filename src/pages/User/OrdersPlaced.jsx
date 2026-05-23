import { useState } from "react";
import {
  Eye,
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock3,
} from "lucide-react";

const INITIAL_ORDERS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    name: "Men's Black Running",
    price: "$79.90",
    brand: "Premium Shoes",
    status: "Delivered",
    date: "21 May 2026",
    quantity: 1,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    name: "Men's Classic Blue",
    price: "$69.00",
    brand: "Premium Shoes",
    status: "Shipping",
    date: "18 May 2026",
    quantity: 2,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=800&q=80",
    name: "Men's Classic Mint",
    price: "$79.90",
    brand: "Premium Shoes",
    status: "Processing",
    date: "16 May 2026",
    quantity: 1,
  },
];

function OrderCard({ item }) {
  const getStatusUI = () => {
    switch (item.status) {
      case "Delivered":
        return {
          icon: <PackageCheck size={14} />,
          color: "text-green-600",
          bg: "bg-green-100",
        };

      case "Shipping":
        return {
          icon: <Truck size={14} />,
          color: "text-blue-600",
          bg: "bg-blue-100",
        };

      default:
        return {
          icon: <Clock3 size={14} />,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        };
    }
  };

  const statusUI = getStatusUI();

  return (
    <div
      className="
        group relative w-full
        rounded-xl overflow-hidden
        bg-[#ebeaea]
        hover:shadow-2xl
        transition-all duration-500
      "
      style={{ height: 520 }}
    >
      {/* IMAGE */}
      <div
        className="relative overflow-hidden bg-[#e9eaea]"
        style={{ height: "70%" }}
      >
        <img
          src={item.img}
          alt={item.name}
          className="
            w-full h-full object-cover
            transition-all duration-500
            group-hover:scale-110 group-hover:-translate-y-2
          "
        />

        {/* Hover Buttons */}
        <div
          className="
            absolute top-5 right-5
            flex flex-col gap-3
            opacity-0 translate-x-10
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all duration-500
          "
        >
          <button
            className="
              w-11 h-11 rounded-full bg-white shadow-lg
              flex items-center justify-center
              hover:bg-black hover:text-white transition
            "
          >
            <Eye size={20} />
          </button>

          <button
            className="
              w-11 h-11 rounded-full bg-white shadow-lg
              flex items-center justify-center
              hover:bg-black hover:text-white transition
            "
          >
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <div
            className={`
              flex items-center gap-2
              px-3 py-1.5 rounded-full
              backdrop-blur-sm shadow
              ${statusUI.bg}
            `}
          >
            <span className={statusUI.color}>
              {statusUI.icon}
            </span>

            <span
              className={`text-[10px] font-semibold uppercase tracking-widest ${statusUI.color}`}
            >
              {item.status}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="px-6 py-5 flex flex-col justify-center"
        style={{ height: "30%" }}
      >
        <p className="text-sm uppercase tracking-[3px] text-gray-500">
          {item.brand}
        </p>

        <h2 className="text-2xl font-bold text-black mt-2">
          {item.name}
        </h2>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl font-semibold text-black">
              {item.price}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Qty: {item.quantity}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[2px] text-gray-400">
              Ordered
            </p>

            <p className="text-sm font-medium text-black mt-1">
              {item.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPlaced() {
  const [orders] = useState(INITIAL_ORDERS);

  return (
    <div
      className="min-h-screen bg-[#f2f1f0] px-6 py-10"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto mt-10 pt-5">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[4px] text-gray-400 mb-2">
            Purchase history
          </p>

          <h1 className="text-5xl font-bold text-black leading-none">
            My Orders

            <span className="ml-3 text-2xl font-normal text-gray-400">
              ({orders.length})
            </span>
          </h1>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag
              size={48}
              className="text-gray-200 mb-4"
            />

            <p className="text-2xl font-bold text-gray-300">
              No orders yet
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Your purchased products will appear here
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((item) => (
                <OrderCard key={item.id} item={item} />
              ))}
            </div>

            {/* FOOTER SUMMARY */}
            <div className="mt-12 border-t border-gray-200 pt-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-1">
                  Total orders
                </p>

                <p className="text-3xl font-bold text-black">
                  {orders.length}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-1 text-right">
                  Total spent
                </p>

                <p className="text-3xl font-bold text-black">
                  $
                  {orders
                    .reduce(
                      (sum, item) =>
                        sum +
                        parseFloat(item.price.replace("$", "")) *
                          item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}