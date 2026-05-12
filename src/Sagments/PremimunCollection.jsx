import Pic from "../../public/Pictures/pexels-ian-panelo-7716266.jpg";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: "$120",
    image:"",
      
  },
  {
    id: 2,
    name: "Adidas Runner",
    price: "$95",
    image:"",
  },
  {
    id: 3,
    name: "Puma Street",
    price: "$110",
    image:"",
  },
  {
    id: 4,
    name: "Jordan Retro",
    price: "$180",
    image:"",
  },
  {
    id: 5,
    name: "Reebok Classic",
    price: "$90",
    image:"",
  },
  {
    id: 6,
    name: "Converse High",
    price: "$85",
    image:"",
  },
  
];

function PremimunCollection() {
  return (
    <div className="w-full flex justify-center min-h-screen bg-white px-6 md:px-16 py-16">
      <div className="lg:w-[80%]">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black">
          Premium Collection
        </h1>
        <p className="text-gray-600 mt-4">
          Explore our latest premium sneakers collection
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-3xl bg-gray-200 shadow-lg"
          >
            
            {/* Product Image */}
            <img
              src={Pic}
              alt={product.name}
              className="w-full h-[350px] object-cover transition duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center">
              
              <h2 className="text-black text-2xl font-bold mb-3">
                {product.name}
              </h2>

              <p className="text-gray-700 text-lg mb-5">
                {product.price}
              </p>

              <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
                Add To Cart
              </button>

            </div>

          </div>
        ))}

      </div>
      </div>
    </div>
  );
}

export default PremimunCollection;