import BlackShoe from "../../public/Pictures/pexels-shanekell-187407.jpg";
import NikeShoe from "../../public/Pictures/_ (2).jpg";
import FootBallShoe from "../../public/Pictures/_ (3).jpg";
import AirJorden from "../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import FormalShoe from "../../public/Pictures/La nueva colección de zapatos que acompaña tus pasos en cualquier momento del día.jpg"



const SnakerShoeHome = () => {
  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={BlackShoe}
        alt="Background"
      />

      {/* Left content */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 px-8 md:px-12 py-12 md:py-20 z-10 flex flex-col justify-center">
        <div className="mb-12 md:mb-16">
          <p className="text-white text-5xl md:text-6xl lg:text-7xl  tracking-tighter leading-none">
            Exclusive
          </p>

          <p className="font-bebas text-center text-[#00d4a0] text-6xl md:text-8xl lg:10xl leading-none font-extrabold tracking-widest">
            SNEAKERS
          </p>

          <p className="font-bebas text-white text-end pr-10 text-2xl md:text-4xl tracking-[4px]">
            LIMITED EDITION
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="font-bold text-white md:text-xl lg:text-2xl tracking-[3px] uppercase">
            About
          </p>

          <div className="w-20 h-0.5 bg-[#00d4a0] my-1.5" />

          <p className="text-[15px] text-center self-center leading-relaxed max-w-[260px] md:max-w-sm">
            Experience the perfect fusion of luxury, innovation, and street culture.
  Our sneakers are engineered for trendsetters who demand unmatched comfort
  and iconic design.
          </p>
        </div>

          <button className=" z-20 bg-[#00d4a0] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#00f0b8] transition-colors">
        Collection <span className="text-black">→</span>
      </button>

      </div>

    </div>
  );
};

const SkateShoeHome = () => {
  return (
    <div className="relative w-full flex justify-center h-screen bg-[#1a1a1a] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={NikeShoe}
        alt="Background"
      />

      {/* Left content */}
      <div className="absolute  z-10  top-20">
        <div className=" self-center">
          <p className="font-bebas self-center text-center text-[#6e4dbb] text-5xl md:text-7xl lg:9xl leading-none font-extrabold tracking -widest">
            SNEAKERS
          </p>

          <p className="font-bebas text-end pr-10 text-2xl md:text-4xl tracking-[4px]">
            VAST COLLECTION
          </p>
        </div>
       

      </div>

        <button className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 bg-[#6e4dbb] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#362069] transition-colors">
        Collection <span className="text-black">→</span>
      </button>

    </div>
  );
};

const FootBallShoeHome = () => {
  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={FootBallShoe}
        alt="Background"
      />


      {/* Left content */}
<div className="absolute left-0 top-0 bottom-0 md:w-1/2 sm:w-full px-8 md:px-12   z-10 flex flex-col justify-center">
  <div className="mb-12 md:mb-16">

    <p className="text-[#b12b48] font-serif text-4xl md:text-6xl lg:text-8xl font-extrabold text-center">
      FOOTBALL
    </p>

  </div>

  <div className="mb-12 md:mb-16 flex flex-col">
    <p className="font-bold text-white md:text-xl self-center lg:text-2xl tracking-[3px] uppercase">
      About
    </p>
     <div className="w-20 h-1 self-center  bg-[#b12b48] my-1.5" />

  
    <p className="text-[15px] text-center self-center leading-relaxed max-w-[260px] md:max-w-sm text-white">
      Experience the perfect fusion of luxury, innovation, and street culture.
      Our sneakers are engineered for trendsetters who demand unmatched comfort
      and iconic design.
    </p>
  </div>

  <button className="z-20 bg-[#b12b48] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#8a1f3c] transition-colors">
    EXPLOR MORE <span className="text-black">→</span>
  </button>
</div>

    </div>
  );
};

const AirJordenHome = () => {
  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={AirJorden}
        alt="Background"
      />

      {/* Left content */}
      <div className="absolute right-0 top-0 bottom-0 md:w-1/2 sm:w-full px-8 md:px-12   z-10 flex flex-col justify-center">
        <div className="mb-12 md:mb-16">

          <p className="text-[#ffffff] font-serif text-4xl md:text-6xl lg:text-8xl font-extrabold text-center">
            AIR JORDEN
          </p>

        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="font-bold text-white md:text-xl self-center lg:text-2xl tracking-[3px] uppercase">
            About
          </p>
           <div className="w-20 h-1 self-center  bg-[#ffffff] my-1.5" />  
          <p className="text-[15px] text-center self-center leading-relaxed max-w-[260px] md:max-w-sm text-white">
            Experience the perfect fusion of luxury, innovation, and street culture.
            Our sneakers are engineered for trendsetters who demand unmatched comfort
            and iconic design.
          </p>
        </div>

        <button className="z-20 bg-[#ffffff] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#bbbbbb] transition-colors">
          EXPLOR MORE <span className="text-black">→</span>
        </button>
      </div>

    </div>
  );
};

const FormalShoeHome = () => {
   return (
    <div className="relative flex flex-col w-full h-screen bg-[#1a1a1a] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={FormalShoe}
        alt="Background"
      />

      {/* Left content */}
      <div className="absolute self-center top-0 bottom-0 lg:h-full px-8 md:px-12 z-10 flex flex-col justify-between">
        <div className="mb-12 md:mb-16">

          <p className="text-[#ffffff] font-serif text-4xl mt-32 uppercase md:text-6xl lg:text-8xl font-extrabold text-center">
            Leather Collection
          </p>

        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="font-bold text-white md:text-xl self-center lg:text-2xl tracking-[3px] uppercase">
            About
          </p>
           <div className="w-20 h-1 self-center  bg-[#ffffff] my-1.5" />  
          <p className="text-[15px] text-center self-center leading-relaxed max-w-[260px] md:max-w-sm text-white">
            Experience the perfect fusion of luxury, innovation, and street culture.
            Our sneakers are engineered for trendsetters who demand unmatched comfort
            and iconic design.
          </p>
          
          <button className="z-20 bg-[#ffffff] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 my-7 rounded-sm hover:bg-[#bbbbbb] transition-colors">
          EXPLOR MORE <span className="text-black">→</span>
        </button>
        </div>

        
      </div>

    </div>
  );

}






export { SnakerShoeHome,SkateShoeHome , FootBallShoeHome , AirJordenHome , FormalShoeHome};