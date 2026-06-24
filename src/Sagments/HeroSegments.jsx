import NikeShoe from "../../public/Pictures/_ (2).jpg";
import FootBallShoe from "../../public/Pictures/_ (3).jpg";
import AirJorden from "../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import FormalShoe from "../../public/Pictures/La nueva colección de zapatos que acompaña tus pasos en cualquier momento del día.jpg";
import NeonShoe from "../../public/Pictures/Sneaker Jordan by IA STUDIO , IA STUDIO.jpeg";

import { Link } from "react-router-dom";
import { buildShopLink } from "../utils/shopLinks";

const CollectionButton = ({ to, className, children }) => (
  <Link to={to} className={className}>
    {children}
  </Link>
);

const baseButtonClass =
  "z-20 inline-flex w-[200px] items-center justify-center gap-2 self-center rounded-sm px-5 py-2.5 text-center text-xs font-bold uppercase tracking-widest transition-colors";

const SkateShoeHome = () => {
  return (
    <div className="relative mt-5 flex h-screen w-full justify-center overflow-hidden bg-[#1a1a1a] py-10">
      <img
        className="h-full w-full object-cover"
        src={NikeShoe}
        alt="Background"
      />

      <div className="absolute top-20 z-10">
        <div className="self-center">
          <p className="font-bebas self-center text-center text-5xl font-extrabold leading-none text-[#6e4dbb] tracking-widest md:text-7xl lg:text-9xl">
            SNEAKERS
          </p>

          <p className="font-bebas pr-10 text-end text-2xl tracking-[4px] text-black md:text-4xl">
            VAST COLLECTION
          </p>
        </div>
      </div>

      <CollectionButton
        to={buildShopLink({ brand: "nike" })}
        className={`${baseButtonClass} absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#6e4dbb] text-black hover:bg-[#362069]`}
      >
        Nike Collection <span className="text-black">→</span>
      </CollectionButton>
    </div>
  );
};

const FootBallShoeHome = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a1a] py-10">
      <img
        className="h-full w-full object-cover"
        src={FootBallShoe}
        alt="Background"
      />

      <div className="absolute left-0 top-0 bottom-0 z-10 flex flex-col justify-center px-8 md:w-1/2 md:px-12 sm:w-full">
        <div className="mb-12 md:mb-16">
          <p className="text-center font-serif text-4xl font-extrabold text-[#b12b48] md:text-6xl lg:text-8xl">
            FOOTBALL
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="self-center text-center text-xl font-bold uppercase tracking-[3px] text-white lg:text-2xl md:text-xl">
            About
          </p>
          <div className="my-1.5 h-1 w-20 self-center bg-[#b12b48]" />

          <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
            Experience the perfect fusion of luxury, innovation, and street culture.
            Our sneakers are engineered for trendsetters who demand unmatched comfort
            and iconic design.
          </p>
        </div>

        <CollectionButton
          to={buildShopLink({ brand: "adidas" })}
          className={`${baseButtonClass} bg-[#b12b48] text-black hover:bg-[#8a1f3c]`}
        >
          Adidas Collection <span className="text-black">→</span>
        </CollectionButton>
      </div>
    </div>
  );
};

const NeonSneakerHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#070b14] py-10">
      <img
        className="h-full w-full object-cover"
        src={NeonShoe}
        alt="Phantom Glow Sneaker"
      />

      <div className="absolute bottom-0 left-1/2 h-[250px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/30 blur-[140px] pointer-events-none" />
      <div className="absolute right-20 top-10 h-[300px] w-[300px] rounded-full bg-cyan-400/20 blur-[120px] pointer-events-none" />

      <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center px-8 md:w-1/2 md:px-12 sm:w-full">
        <div className="mb-12 md:mb-16">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[6px] text-orange-400 md:text-base">
            Neon Performance
          </p>

          <p className="text-center font-serif text-4xl font-extrabold leading-tight text-[#ffffff] md:text-6xl lg:text-8xl">
            PHANTOM
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
              GLOW
            </span>
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="self-center text-center text-xl font-bold uppercase tracking-[3px] text-white lg:text-2xl md:text-xl">
            About
          </p>
          <div className="my-1.5 h-1 w-20 self-center bg-gradient-to-r from-orange-400 to-cyan-400" />
          <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-gray-300 md:max-w-sm">
            Built for the future with glowing sole technology,
            ultra-light cushioning, and a bold cyber-inspired design.
            The perfect blend of street energy and luxury aesthetics.
          </p>
        </div>

        <CollectionButton
          to={buildShopLink({ brand: "puma" })}
          className={`${baseButtonClass} bg-[#ffffff] text-black hover:bg-[#bbbbbb]`}
        >
          Puma Collection <span className="text-black">→</span>
        </CollectionButton>
      </div>

      <div className="pointer-events-none absolute top-24 right-16 h-24 w-24 rounded-full border border-cyan-400/30 animate-pulse" />
      <div className="pointer-events-none absolute bottom-20 left-12 h-20 w-20 rounded-full bg-cyan-400/40 blur-3xl" />
      <div className="pointer-events-none absolute top-10 left-20 h-32 w-3 rotate-12 bg-gradient-to-b from-cyan-400 to-transparent blur-sm" />
    </div>
  );
};

const AirJordenHome = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a1a] py-10">
      <img
        className="h-full w-full object-cover"
        src={AirJorden}
        alt="Background"
      />

      <div className="absolute right-0 top-0 bottom-0 z-10 flex flex-col justify-center px-8 md:w-1/2 md:px-12 sm:w-full">
        <div className="mb-12 md:mb-16">
          <p className="text-center font-serif text-4xl font-extrabold text-[#ffffff] md:text-6xl lg:text-8xl">
            AIR JORDEN
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="self-center text-center text-xl font-bold uppercase tracking-[3px] text-white lg:text-2xl md:text-xl">
            About
          </p>
          <div className="my-1.5 h-1 w-20 self-center bg-[#ffffff]" />
          <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
            Experience the perfect fusion of luxury, innovation, and street culture.
            Our sneakers are engineered for trendsetters who demand unmatched comfort
            and iconic design.
          </p>
        </div>

        <CollectionButton
          to={buildShopLink({ brand: "jordan" })}
          className={`${baseButtonClass} bg-[#ffffff] text-black hover:bg-[#bbbbbb]`}
        >
          Jordan Collection <span className="text-black">→</span>
        </CollectionButton>
      </div>
    </div>
  );
};

const FormalShoeHome = () => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#1a1a1a] py-10">
      <img
        className="h-full w-full object-cover"
        src={FormalShoe}
        alt="Background"
      />

      <div className="absolute top-0 bottom-0 self-center z-10 flex flex-col justify-between px-8 md:px-12 lg:h-full">
        <div className="mb-12 md:mb-16">
          <p className="mt-32 text-center font-serif text-4xl font-extrabold uppercase text-[#ffffff] md:text-6xl lg:text-8xl">
            Leather Collection
          </p>
        </div>

        <div className="mb-12 md:mb-16 flex flex-col">
          <p className="self-center text-center text-xl font-bold uppercase tracking-[3px] text-white lg:text-2xl md:text-xl">
            About
          </p>
          <div className="my-1.5 h-1 w-20 self-center bg-[#ffffff]" />
          <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
            Experience the perfect fusion of luxury, innovation, and street culture.
            Our sneakers are engineered for trendsetters who demand unmatched comfort
            and iconic design.
          </p>

          <CollectionButton
            to={buildShopLink({ brand: "reebok" })}
            className={`${baseButtonClass} my-7 bg-[#ffffff] text-black hover:bg-[#bbbbbb]`}
          >
            Reebok Collection <span className="text-black">→</span>
          </CollectionButton>
        </div>
      </div>
    </div>
  );
};

export {
  SkateShoeHome,
  FootBallShoeHome,
  AirJordenHome,
  FormalShoeHome,
  NeonSneakerHero,
};
