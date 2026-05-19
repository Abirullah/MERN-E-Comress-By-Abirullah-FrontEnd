import { Eye, ShoppingCart } from "lucide-react";

function ProductCard({ img, name, price }) {
  return (
    <div
      className="
        group
        relative
        w-[400px]
        h-[500px]
        hover:shadow-2xl
        rounded-xl
        overflow-hidden
        transition-all
        duration-500
        bg-[#ebeaea]
      "
    >
      
      {/* IMAGE SECTION */}
      <div className="relative h-[70%] bg-[#e9eaea] overflow-hidden">
        
        <img
  src={img}
  alt={name}
  className="
    w-full
    h-full
    object-cover
    transition-all
    duration-500
    hover:shadow-2xl
    group-hover:scale-110
    group-hover:-translate-y-2
  "
/>

        {/* HOVER ICONS */}
        <div
          className="
            absolute
            top-5
            right-5
            flex
            flex-col
            gap-3
            opacity-0
            translate-x-10
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-500
          "
        >
          
          {/* Eye */}
          <button
            className="
              w-11 h-11
              rounded-full
              bg-white
              shadow-lg
              flex items-center justify-center
              hover:bg-black
              hover:text-white
              transition
            "
          >
            <Eye size={20} />
          </button>

          {/* Cart */}
          <button
            className="
              w-11 h-11
              rounded-full
              bg-white
              shadow-lg
              flex items-center justify-center
              hover:bg-black
              hover:text-white
              transition
            "
          >
            <ShoppingCart size={20} />
          </button>

        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="h-[30%] px-6 py-5 flex flex-col justify-center">
        
        <p className="text-sm uppercase tracking-[3px] text-gray-500">
          Premium Shoes
        </p>

        <h2 className="text-2xl font-bold text-black mt-2">
          {name}
        </h2>

        <div className="flex items-center justify-between mt-3">
          
          <p className="text-xl font-semibold text-black">
            {price}
          </p>

          <span className="text-green-600 text-sm font-medium">
            In Stock
          </span>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;