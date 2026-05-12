import nike from "../../public/Logoes/pngwing.com (1).png";
import adidas from "../../public/Logoes/pngwing.com.png";
import puma from "../../public/Logoes/pngwing.com (6).png";
import reebok from "../../public/Logoes/pngwing.com (3).png";
import vans from "../../public/Logoes/pngwing.com (8).png";
import newbalance from "../../public/Logoes/pngwing.com (2).png";
import skechers from "../../public/Logoes/pngwing.com (5).png";

const brands = [
  nike,
  adidas,
  puma,
  reebok,
  vans,
  newbalance,
  skechers
];

const BrandStrip = () => {
  return (
        <div className="flex items-center justify-between h-full px-8 ">
          
          {brands.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-full"
            >
              <img
                src={logo}
                alt="brand-logo"
                className="h-8 md:h-10 object-contain opacity-70 hover:opacity-100 transition duration-300"
              />
            </div>
          ))}

        </div>
  );
};

export default BrandStrip;