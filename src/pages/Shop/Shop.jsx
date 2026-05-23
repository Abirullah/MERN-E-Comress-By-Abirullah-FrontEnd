import React from "react";
import ProductCard from "../../components/ProductCard";

const products = [
  {
    id: 1,
    name: "Men's Black Running",
    price: "$79.90",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Men's Classic Blue",
    price: "$69.00",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Men's Classic Mint",
    price: "$79.90",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Nike Air Max",
    price: "$120.00",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Jordan Retro",
    price: "$180.00",
    image:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Adidas Street",
    price: "$99.00",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Puma Runner",
    price: "$85.00",
    image:
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "White Sneakers",
    price: "$95.00",
    image:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1200&auto=format&fit=crop",
  },
];

function ShopPage() {
  return (
    <section className="bg-[#f5f5f3] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <h1 className="text-6xl font-bold text-[#6f6d4f] mb-14 mt-10">
          Shop
        </h1>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          
          <div className="flex items-center gap-6 flex-wrap">
            <button className="bg-[#6f6d4f] text-white px-6 py-3 uppercase tracking-[3px] text-sm font-semibold hover:opacity-90 transition">
              ☰ Filter Shoes
            </button>

            <p className="text-gray-500 text-lg">
              Showing 1–8 of 20 results
            </p>
          </div>

          <div className="flex items-center gap-6">
            <select className="bg-transparent outline-none text-gray-600 text-lg">
              <option>Default sorting</option>
              <option>Sort by price</option>
              <option>Sort by popularity</option>
              <option>Latest products</option>
            </select>

            <div className="flex gap-3 text-gray-500 text-xl">
              <span className="cursor-pointer">☷</span>
              <span className="cursor-pointer">☰</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10 place-items-center">
          
          {products.map((product) => (
            <ProductCard
              key={product.id}
              img={product.image}
              name={product.name}
              price={product.price}
            />
          ))}

        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16 gap-3">
          <button className="w-12 h-12 bg-[#6f6d4f] text-white">
            1
          </button>

          <button className="w-12 h-12 border border-gray-300 hover:bg-[#6f6d4f] hover:text-white transition">
            2
          </button>

          <button className="w-12 h-12 border border-gray-300 hover:bg-[#6f6d4f] hover:text-white transition">
            3
          </button>
        </div>

      </div>
    </section>
  );
}

export default ShopPage;