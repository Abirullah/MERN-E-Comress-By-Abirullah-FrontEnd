import { useSelector } from "react-redux";
import Img from "../../public/Pictures/_ (1).jpeg";


const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);


  return (
    <div className="relative w-screen h-screen bg-[#1a1a1a] overflow-hidden">

      {/* Diagonal background stripes */}
      <div className="absolute right-[-60px] bottom-[-60px] w-[520px] h-screen z-0">
        {[0.18, 0.12, 0.22, 0.10, 0.24, 0.14].map((op, i) => (
          <div key={i} className="absolute w-7 h-[500px] bg-[#00d4a0] -rotate-[40deg] origin-bottom-left"
            style={{ right: `${[320,270,220,170,50,0][i]}px`, bottom: '-60px', opacity: op }} />
        ))}
      </div>

      {/* Top-right corner bars */}
      <div className="absolute top-0 right-0 w-20 h-screen z-10 overflow-hidden">
        {[{r:0,o:1},{r:18,o:0.7},{r:36,o:0.4}].map(({r,o},i) => (
          <div key={i} className="absolute w-3 h-[120px] bg-[#00d4a0] rotate-45 origin-top-right"
            style={{ right: `${r}px`, top: '-30px', opacity: o }} />
        ))}
      </div>

      {/* bg image dont crupt it*/}
      

      <div>

        <img className="h-full w-full object-cover" src={Img} alt="" />


      </div>
     


      {/* Left content */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 px-8 md:px-12 py-12 md:py-20 z-10 flex flex-col justify-center">
        <div className="mb-12 md:mb-16">
          <p className="font-dancing text-white text-4xl md:text-5xl leading-none">Exclusive</p>
          <p className="font-bebas text-[#00d4a0] text-6xl md:text-8xl leading-none tracking-widest">SNEAKERS</p>
          <p className="font-bebas text-[#00d4a0] text-2xl md:text-4xl tracking-[4px]">LIMITED EDITION</p>
        </div>
        <div className="mb-12 md:mb-16">
          <p className="font-bold text-white text-xs tracking-[3px] uppercase">SHOES 01</p>
          <div className="w-9 h-0.5 bg-[#00d4a0] my-1.5" />
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-[260px] md:max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-white tracking-widest uppercase mb-1">Social Media</p>
          <div className="flex items-center gap-2">
            {/* Add your social icons here */}
            <span className="text-[11px] text-gray-500">/ YourBrand</span>
          </div>
        </div>
      </div>

      {/* Shoe image — replace with your <img> */}
      <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 w-[380px] h-[400px] z-10 flex items-center justify-center">
        <img src="/your-shoe.png" alt="Sneaker" className="-rotate-[15deg] translate-y-2 drop-shadow-2xl w-[340px]" />
      </div>

      {/* Premium Badge */}
      <div className="absolute right-5 md:right-20 bottom-20 md:bottom-32 z-20 w-[68px] h-[68px] rounded-full border-2 border-[#00d4a0] bg-black/60 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border border-dashed border-[#00d4a0] animate-spin" style={{animationDuration:'8s'}} />
        <span className="text-[#00d4a0] text-xs z-10">★</span>
      </div>

      {/* CTA Button */}
      <button className="absolute right-5 md:right-20 bottom-4 md:bottom-10 z-20 bg-[#00d4a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#00f0b8] transition-colors">
        ORDER NOW →
      </button>
    </div>
  );
};

export default Home;
