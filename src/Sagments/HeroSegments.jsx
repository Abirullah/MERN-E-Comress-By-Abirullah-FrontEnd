import NikeShoe from "../../public/Pictures/_ (2).jpg";
import FootBallShoe from "../../public/Pictures/_ (3).jpg";
import AirJorden from "../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";
import FormalShoe from "../../public/Pictures/La nueva colección de zapatos que acompaña tus pasos en cualquier momento del día.jpg";
import NeonShoe from "../../public/Pictures/Sneaker Jordan by IA STUDIO , IA STUDIO.jpeg";

import { Link } from "react-router-dom";
import { buildShopLink } from "../utils/shopLinks";

/* ── shared ── */
const CollectionButton = ({ to, className, children }) => (
  <Link to={to} className={className}>
    {children}
  </Link>
);

const baseButtonClass =
  "z-20 inline-flex w-[160px] sm:w-[200px] items-center justify-center gap-2 self-center rounded-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors";

/* ──────────────────────────────────────────
   1. SKATE / NIKE
   Layout: full-bleed image, title at top-center, button at bottom-center
────────────────────────────────────────── */
const SkateShoeHome = () => (
  <div className="relative flex h-screen [height:100dvh] w-full justify-center overflow-hidden bg-[#1a1a1a]">
    {/* full-bleed image — always visible */}
    <img className="h-full w-full object-cover" src={NikeShoe} alt="Nike sneaker" />

    {/* dark overlay so text is readable on mobile */}
    <div className="absolute inset-0 bg-black/30 sm:bg-black/10" />

    {/* heading */}
    <div className="absolute top-16 sm:top-20 z-10 px-4 text-center">
      <p className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold leading-none text-[#6e4dbb] tracking-widest mt-5">
        SNEAKERS
      </p>
      <p className="font-bebas text-lg sm:text-2xl tracking-[4px] text-white/80 sm:text-black mt-1">
        VAST COLLECTION
      </p>
    </div>

    {/* button */}
    <CollectionButton
      to={buildShopLink({ brand: "nike" })}
      className={`${baseButtonClass} absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-[#6e4dbb] text-white hover:bg-[#362069]`}
    >
      Nike Collection <span>→</span>
    </CollectionButton>
  </div>
);

/* ──────────────────────────────────────────
   2. FOOTBALL / ADIDAS
   Layout: image right, text panel left
────────────────────────────────────────── */
const FootBallShoeHome = () => (
  <div className="relative h-screen [height:100dvh] w-full overflow-hidden bg-[#1a1a1a]">
    <img className="h-full w-full object-cover" src={FootBallShoe} alt="Football shoe" />

    {/* overlay — stronger on mobile so left panel text is readable */}
    <div className="absolute inset-0 bg-black/40 sm:bg-black/20 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />

    <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-8 md:w-1/2 md:px-12">
      {/* title */}
      <p className="text-center font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-[#b12b48]">
        FOOTBALL
      </p>

      {/* about — hidden on mobile */}
      <div className="hidden sm:flex mt-8 sm:mt-10 flex-col">
        <p className="self-center text-center text-base sm:text-xl font-bold uppercase tracking-[3px] text-white">
          About
        </p>
        <div className="my-1.5 h-1 w-20 self-center bg-[#b12b48]" />
        <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
          Experience the perfect fusion of luxury, innovation, and street culture.
          Our sneakers are engineered for trendsetters who demand unmatched comfort
          and iconic design.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <CollectionButton
          to={buildShopLink({ brand: "adidas" })}
          className={`${baseButtonClass} bg-[#b12b48] text-white hover:bg-[#8a1f3c]`}
        >
          Adidas Collection <span>→</span>
        </CollectionButton>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────────
   3. AIR JORDAN
   Layout: image left, text panel right
────────────────────────────────────────── */
const AirJordenHome = () => (
  <div className="relative h-screen [height:100dvh] w-full overflow-hidden bg-[#1a1a1a]">
    <img className="h-full w-full object-cover" src={AirJorden} alt="Air Jordan" />

    <div className="absolute inset-0 bg-black/40 sm:bg-black/20 md:bg-gradient-to-l md:from-black/80 md:via-black/40 md:to-transparent" />

    <div className="absolute right-0 inset-y-0 z-10 flex flex-col justify-center px-6 sm:px-8 md:w-1/2 md:px-12">
      <p className="text-center font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-white">
        AIR JORDAN
      </p>

      {/* about — hidden on mobile */}
      <div className="hidden sm:flex mt-8 sm:mt-10 flex-col">
        <p className="self-center text-center text-base sm:text-xl font-bold uppercase tracking-[3px] text-white">
          About
        </p>
        <div className="my-1.5 h-1 w-20 self-center bg-white" />
        <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
          Experience the perfect fusion of luxury, innovation, and street culture.
          Our sneakers are engineered for trendsetters who demand unmatched comfort
          and iconic design.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <CollectionButton
          to={buildShopLink({ brand: "jordan" })}
          className={`${baseButtonClass} bg-white text-black hover:bg-[#bbbbbb]`}
        >
          Jordan Collection <span>→</span>
        </CollectionButton>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────────
   4. FORMAL / LEATHER / REEBOK
   Layout: centered overlay
────────────────────────────────────────── */
const FormalShoeHome = () => (
  <div className="relative h-screen [height:100dvh] w-full overflow-hidden bg-[#1a1a1a]">
    <img className="h-full w-full object-cover" src={FormalShoe} alt="Formal shoe" />

    <div className="absolute inset-0 bg-black/40 sm:bg-black/20" />

    <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-16 sm:py-20 px-6">
      {/* title at top */}
      <p className="text-center font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold uppercase text-white">
        Leather<br className="sm:hidden" /> Collection
      </p>

      {/* about — hidden on mobile */}
      <div className="hidden sm:flex flex-col items-center">
        <p className="text-center text-xl font-bold uppercase tracking-[3px] text-white">
          About
        </p>
        <div className="my-1.5 h-1 w-20 bg-white" />
        <p className="max-w-[260px] text-center text-[15px] leading-relaxed text-white md:max-w-sm">
          Experience the perfect fusion of luxury, innovation, and street culture.
          Our sneakers are engineered for trendsetters who demand unmatched comfort
          and iconic design.
        </p>
      </div>

      {/* button at bottom */}
      <CollectionButton
        to={buildShopLink({ brand: "reebok" })}
        className={`${baseButtonClass} bg-white text-black hover:bg-[#bbbbbb]`}
      >
        Reebok Collection <span>→</span>
      </CollectionButton>
    </div>
  </div>
);

/* ──────────────────────────────────────────
   5. NEON / PHANTOM GLOW / PUMA
   Layout: image left, text panel right
────────────────────────────────────────── */
const NeonSneakerHero = () => (
  <div className="relative h-screen [height:100dvh] w-full overflow-hidden bg-[#070b14]">
    <img className="h-full w-full object-cover" src={NeonShoe} alt="Phantom Glow Sneaker" />

    {/* glows */}
    <div className="absolute bottom-0 left-1/2 h-[200px] w-[500px] sm:h-[250px] sm:w-[600px] -translate-x-1/2 rounded-full bg-orange-500/30 blur-[120px] sm:blur-[140px] pointer-events-none" />
    <div className="absolute right-16 top-10 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-cyan-400/20 blur-[100px] sm:blur-[120px] pointer-events-none" />

    <div className="absolute inset-0 bg-black/40 sm:bg-black/10 md:bg-gradient-to-l md:from-black/80 md:via-black/30 md:to-transparent" />

    <div className="absolute right-0 inset-y-0 z-10 flex flex-col justify-center px-6 sm:px-8 md:w-1/2 md:px-12">
      {/* label */}
      <p className="mb-2 text-center text-[10px] sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[6px] text-orange-400">
        Neon Performance
      </p>

      {/* title */}
      <p className="text-center font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-tight text-white">
        PHANTOM
        <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
          GLOW
        </span>
      </p>

      {/* about — hidden on mobile */}
      <div className="hidden sm:flex mt-8 sm:mt-10 flex-col">
        <p className="self-center text-center text-base sm:text-xl font-bold uppercase tracking-[3px] text-white">
          About
        </p>
        <div className="my-1.5 h-1 w-20 self-center bg-gradient-to-r from-orange-400 to-cyan-400" />
        <p className="self-center max-w-[260px] text-center text-[15px] leading-relaxed text-gray-300 md:max-w-sm">
          Built for the future with glowing sole technology,
          ultra-light cushioning, and a bold cyber-inspired design.
          The perfect blend of street energy and luxury aesthetics.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <CollectionButton
          to={buildShopLink({ brand: "puma" })}
          className={`${baseButtonClass} bg-white text-black hover:bg-[#bbbbbb]`}
        >
          Puma Collection <span>→</span>
        </CollectionButton>
      </div>
    </div>

    {/* decorative elements — hidden on mobile to reduce clutter */}
    <div className="pointer-events-none hidden sm:block absolute top-24 right-16 h-24 w-24 rounded-full border border-cyan-400/30 animate-pulse" />
    <div className="pointer-events-none hidden sm:block absolute bottom-20 left-12 h-20 w-20 rounded-full bg-cyan-400/40 blur-3xl" />
    <div className="pointer-events-none hidden sm:block absolute top-10 left-20 h-32 w-3 rotate-12 bg-gradient-to-b from-cyan-400 to-transparent blur-sm" />
  </div>
);

export {
  SkateShoeHome,
  FootBallShoeHome,
  AirJordenHome,
  FormalShoeHome,
  NeonSneakerHero,
};