import NikeShoe from "../../public/Pictures/_ (2).jpg";
import FootBallShoe from "../../public/Pictures/_ (3).jpg";
import AirJorden from "../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import FormalShoe from "../../public/Pictures/La nueva colección de zapatos que acompaña tus pasos en cualquier momento del día.jpg"
import NeonShoe from "../../public/Pictures/Sneaker Jordan by IA STUDIO , IA STUDIO.jpeg"

import { NavLink } from "react-router";




const SkateShoeHome = () => {
  return (
    <div className="relative w-full mt-5 flex justify-center h-screen bg-[#1a1a1a] overflow-hidden p-10">
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
        <NavLink to="/shop">Collection <span className="text-black">→</span></NavLink>
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

    <NavLink to="/shop">EXPLOR MORE <span className="text-black">→</span> </NavLink>
  </button>
</div>

    </div>
  );
};


const NeonSneakerHero = () => {
  return (
    <div className="relative w-full h-screen bg-[#070b14] overflow-hidden p-10">
      <img
        className="h-full w-full object-cover"
        src={NeonShoe}
        alt="Phantom Glow Sneaker"
      />

      {/* ORANGE GLOW - Background effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-orange-500/30 blur-[140px] rounded-full pointer-events-none" />

      {/* BLUE LIGHT - Background effect */}
      <div className="absolute top-10 right-20 w-[300px] h-[300px] bg-cyan-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Left/Right content - positioned on the right side */}
      <div className="absolute right-0 top-0 bottom-0 md:w-1/2 sm:w-full px-8 md:px-12 z-10 flex flex-col justify-center">
        
        <div className="mb-12 md:mb-16">
          <p className="text-orange-400 text-sm md:text-base font-semibold uppercase tracking-[6px] text-center mb-3">
            Neon Performance
          </p>
          
          <p className="text-[#ffffff] font-serif text-4xl md:text-6xl lg:text-8xl font-extrabold text-center leading-tight">
            PHANTOM
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400">
              GLOW
            </span>
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="font-bold text-white md:text-xl self-center lg:text-2xl tracking-[3px] uppercase">
            About
          </p>
          <div className="w-20 h-1 self-center bg-gradient-to-r from-orange-400 to-cyan-400 my-1.5" />
          <p className="text-[15px] text-center self-center leading-relaxed max-w-[260px] md:max-w-sm text-gray-300">
            Built for the future with glowing sole technology, 
            ultra-light cushioning, and a bold cyber-inspired design. 
            The perfect blend of street energy and luxury aesthetics.
          </p>
        </div>
         <button className="z-20 bg-[#ffffff] text-black w-[200px] self-center font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#bbbbbb] transition-colors">
          <NavLink to="/shop">EXPLOR MORE <span className="text-black">→</span></NavLink>
        </button>
      </div>

      {/* FLOATING EFFECTS */}
      <div className="absolute top-24 right-16 w-24 h-24 border border-cyan-400/30 rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-12 w-20 h-20 bg-cyan-400/40 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-10 left-20 w-3 h-32 bg-gradient-to-b from-cyan-400 to-transparent rotate-12 blur-sm pointer-events-none" />
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
          <p className="font-bold text-white </NavLink> md:text-xl self-center lg:text-2xl tracking-[3px] uppercase">
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
          <NavLink to="/shop">EXPLOR MORE <span className="text-black">→</span></NavLink>
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
         <NavLink to="/shop">EXPLOR MORE <span className="text-black">→</span></NavLink> 
        </button>
        </div>

        
      </div>

    </div>
  );

}






export { SkateShoeHome , FootBallShoeHome , AirJordenHome , FormalShoeHome , NeonSneakerHero};