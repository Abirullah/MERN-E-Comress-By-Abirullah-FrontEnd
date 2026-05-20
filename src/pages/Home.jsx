import {
  SnakerShoeHome,
  SkateShoeHome,
  FootBallShoeHome,
  AirJordenHome,
  FormalShoeHome,
} from "../Sagments/HeroSegments";

import BrandStrip from "../Sagments/BrandStrip";
import PremimunCollection from "../Sagments/PremimunCollection";
import ProductsSections from "../Sagments/ProductsSections";
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const sections = [
  {
    id: 1,
    component: <SnakerShoeHome />,
    bg: "bg-black",
  },
  {
    id: 2,
    component: <SkateShoeHome />,
    bg: "bg-zinc-900",
  },
  {
    id: 3,
    component: <FootBallShoeHome />,
    bg: "bg-neutral-900",
  },
  {
    id: 4,
    component: <AirJordenHome />,
    bg: "bg-gray-900",
  },
  {
    id: 5,
    component: <FormalShoeHome />,
    bg: "bg-stone-900",
  },
];

const Home = () => {
  return (
    <div className="w-full">
      
      {/* OVERLAP SECTIONS */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`sticky top-0 h-screen overflow-hidden ${section.bg}`}
          style={{
            zIndex: index + 1,
          }}
        >
          {section.component}
        </section>
      ))}

      {/* NORMAL SECTIONS */}
      <div className="relative z-50 bg-white">
        <BrandStrip />
        <PremimunCollection />
        <ProductsSections />
        <Contact/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;