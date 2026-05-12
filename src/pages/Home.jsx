import { useEffect, useState } from "react";
import {
  SnakerShoeHome,
  SkateShoeHome,
  FootBallShoeHome,
  AirJordenHome,
  FormalShoeHome,
} from "../Sagments/HeroSegments";
import BrandStrip from "../Sagments/BrandStrip";

const sections = [
  <SnakerShoeHome />,
  <SkateShoeHome />,
  <FootBallShoeHome />,
  <AirJordenHome />,
  <FormalShoeHome />,
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sections.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
  <div >

    {sections[index]}

    {/* different comany logoes */}

    
     <BrandStrip />


    </div>
)
};

export default Home;