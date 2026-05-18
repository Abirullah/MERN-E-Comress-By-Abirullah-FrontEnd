import Pic from "../../public/Pictures/pexels-ian-panelo-7716266.jpg";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";


const bestSelling = [
  { id: 1, name: "Nike Air Max", price: "$120" },
  { id: 2, name: "Jordan Retro", price: "$180" },
  { id: 3, name: "Puma Street", price: "$110" },
  { id: 4, name: "Adidas Future", price: "$140" },
  { id: 5, name: "Vans Urban", price: "$100" },
  { id: 6, name: "New Balance X", price: "$160" },
  { id: 7, name: "Nike Zoom", price: "$190" },
  { id: 8, name: "Air Force", price: "$150" },
];

const newArrivals = [
  {
    id: 1,
    name: "Adidas Future",
    price: "$140",
  },
  {
    id: 2,
    name: "New Balance X",
    price: "$160",
  },
  {
    id: 3,
    name: "Vans Urban",
    price: "$100",
  },
  {
    id: 4,
    name: "Puma Street",
    price: "$110",
  },
  {
    id: 5,
    name: "Jordan Retro",
    price: "$180",
  },
  {
    id: 6,
    name: "Nike Air Max",
    price: "$120",
  },
  {
    id: 7,
    name: "Air Force",
    price: "$150",
  },
];

function ProductsSections() {
  const bestSellingRef = useRef(null);
const newArrivalRef = useRef(null);


const scrollLeft = (ref) => {
  ref.current.scrollBy({
    left: -350,
    behavior: "smooth",
  });
};

const scrollRight = (ref) => {
  ref.current.scrollBy({
    left: 350,
    behavior: "smooth",
  });
};

  return (
    <div className="relative w-full bg-black">
    
      <section
        className="
          relative
          min-h-screen
          bg-[#f8f8f8]
          px-6 md:px-16
          py-24
          z-20
        "
      >
        
        {/* Blur Decoration */}
        <div
          className="
            absolute
            top-0
            left-0
            w-[450px]
            h-[450px]
            bg-gray-200
            rounded-full
            blur-[120px]
            opacity-50
          "
        ></div>

        {/* Heading */}
        <div className="relative z-10 text-center mb-20">
          
          <p
            className="
              uppercase
              tracking-[8px]
              text-gray-500
              text-sm
              mb-4
            "
          >
            Product Collection
          </p>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              text-black
            "
          >
            Best Selling
          </h1>

          <div className="w-28 h-1 bg-black mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Cards */}
       <div className="relative w-full flex justify-center">
  
  {/* MAIN CONTAINER */}
  <div className="relative w-[80%]">
    
    {/* LEFT BUTTON */}
    <button
      onClick={() => scrollLeft(bestSellingRef)}
      className="
        absolute
        -left-7
        top-1/2
        -translate-y-1/2
        z-20
        w-14
        h-14
        rounded-full
        bg-white
        shadow-2xl
        flex
        items-center
        justify-center
        hover:bg-black
        hover:text-white
        transition-all
        duration-300
      "
    >
      <ChevronLeft size={28} />
    </button>

    {/* RIGHT BUTTON */}
    <button
      onClick={() => scrollRight(bestSellingRef)}
      className="
        absolute
        -right-7
        top-1/2
        -translate-y-1/2
        z-20
        w-14
        h-14
        rounded-full
        bg-white
        shadow-2xl
        flex
        items-center
        justify-center
        hover:bg-black
        hover:text-white
        transition-all
        duration-300
      "
    >
      <ChevronRight size={28} />
    </button>

    {/* SLIDER */}
    <div
      ref={bestSellingRef}
      className="
        flex
        gap-8
        overflow-x-auto
        scroll-smooth
        scrollbar-hide
        px-4
        py-6
      "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      
      {bestSelling.map((product) => (
        <div
          key={product.id}
          className="
            min-w-[300px]
            flex-shrink-0
          "
        >
          <ProductCard
            img={Pic}
            name={product.name}
            price={product.price}
          />
        </div>
      ))}

    </div>
  </div>
</div>
      </section>


      <section
        className="
          sticky
          top-0
          h-screen
          overflow-hidden
          z-10
        "
      >
        
        {/* Background Image */}
        <img
          src={Pic}
          alt="Sneaker Banner"
          className="
            w-full
            h-full
            object-cover
            scale-110
          "
        />

        {/* Dark Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/50
          "
        ></div>

        {/* Content */}
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            text-center
            text-white
            px-6
          "
        >
          
          <p
            className="
              uppercase
              tracking-[10px]
              text-sm
              mb-6
            "
          >
            Premium Sneakers
          </p>

          <h1
            className="
              text-5xl
              md:text-8xl
              font-black
              leading-none
            "
          >
            STREET
            <br />
            CULTURE
          </h1>

          <button
            className="
              mt-10
              px-8
              py-4
              rounded-full
              border
              border-white
              hover:bg-white
              hover:text-black
              transition-all
              duration-500
            "
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* ================================================= */}
      {/* ================= THIRD SECTION ================= */}
      {/* ================================================= */}

      <section
        className="
          relative
          min-h-screen
          bg-white
          px-6 md:px-16
          py-24
          z-30
        "
      >
        
        {/* Blur Decoration */}
        <div
          className="
            absolute
            bottom-0
            right-0
            w-[450px]
            h-[450px]
            bg-gray-100
            rounded-full
            blur-[120px]
            opacity-70
          "
        ></div>

        {/* Heading */}
        <div className="relative z-10 text-center mb-20">
          
          <p
            className="
              uppercase
              tracking-[8px]
              text-gray-500
              text-sm
              mb-4
            "
          >
            Latest Drops
          </p>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              text-black
            "
          >
            New Arrivals
          </h1>

          <div className="w-28 h-1 bg-black mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="relative w-full flex justify-center">
  
  {/* MAIN CONTAINER */}
  <div className="relative w-[80%]">
    
    {/* LEFT BUTTON */}
    <button
      onClick={() => scrollLeft(newArrivalRef)}
      className="
        absolute
        -left-7
        top-1/2
        -translate-y-1/2
        z-20
        w-14
        h-14
        rounded-full
        bg-white
        shadow-2xl
        flex
        items-center
        justify-center
        hover:bg-black
        hover:text-white
        transition-all
        duration-300const bestSellingRef = useRef(null);
const newArrivalRef = useRef(null);
      "
    >
      <ChevronLeft size={28} />
    </button>

    {/* RIGHT BUTTON */}
    <button
      onClick={() => scrollRight(newArrivalRef)}
      className="
        absolute
        -right-7
        top-1/2
        -translate-y-1/2
        z-20
        w-14
        h-14
        rounded-full
        bg-white
        shadow-2xl
        flex
        items-center
        justify-center
        hover:bg-black
        hover:text-white
        transition-all
        duration-300const bestSellingRef = useRef(null);
const newArrivalRef = useRef(null);
      "
    >
      <ChevronRight size={28} />
    </button>

    {/* SLIDER */}
    <div
      ref={newArrivalRef}
      className="
        flex
        gap-8
        overflow-x-auto
        scroll-smooth
        scrollbar-hide
        px-4
        py-6
      "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      
      {newArrivals.map((product) => (
        <div
          key={product.id}
          className="
            min-w-[300px]
            flex-shrink-0
          "
        >
          <ProductCard
            img={Pic}
            name={product.name}
            price={product.price}
          />
        </div>
      ))}

    </div>
  </div>
</div>
      </section>
    </div>
  );
}

export default ProductsSections;