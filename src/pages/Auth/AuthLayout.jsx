const AuthLayout = ({  title, description, children }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Tenor+Sans&display=swap');

        @keyframes ringPulse {
          0%,100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes particleRise {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.1;
          }
          100% {
            opacity: 0;
            transform: translateY(-260px);
          }
        }

        .lx-ring{
          position:absolute;
          border-radius:9999px;
          border:2px solid rgba(212,165,68,.12);
          animation:ringPulse 4s ease-in-out infinite;
        }

        .lx-particle{
          position:absolute;
          width:3px;
          height:3px;
          border-radius:9999px;
          background:#d4a544;
          opacity:0;
          animation:particleRise 6s ease-in-out infinite;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#080808] font-['Tenor_Sans']">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[220, 340, 460, 580, 700, 820, 940].map((size, index) => (
            <div
              key={index}
              className="lx-ring"
              style={{
                width: size,
                height: size,
                animationDelay: `${index * 0.6}s`,
              }}
            />
          ))}
        </div>

        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="lx-particle"
            style={{
              left: `${8 + ((index * 6) % 85)}%`,
              bottom: `${(index * 7) % 28}%`,
              animationDelay: `${(index * 0.45).toFixed(1)}s`,
              animationDuration: `${5 + (index % 4)}s`,
            }}
          />
        ))}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(8,8,8,0.72) 0%,rgba(8,8,8,0.5) 50%,rgba(8,8,8,0.78) 100%)",
          }}
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center px-[8%]">
          <div className="hidden md:flex py-10 items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-['Cormorant_Garamond'] text-[60px] font-light uppercase tracking-[0.2em] leading-none text-[#d4a544]">
                Luxe Step
              </h1>

              <p className="mt-2 text-[15px] uppercase tracking-[0.3em] text-[#555]">
                Premium Footwear
              </p>

              <p className="mt-5 font-['Cormorant_Garamond'] text-[17px] italic font-light leading-[1.6] text-[#7a6a50]">
                "Where every step tells a story."
              </p>
            </div>
          </div>

          <div className="w-full max-w-5xl rounded-2xl border border-[#1e1e1e] bg-[rgba(19,19,19,0.2)] px-7 py-8 backdrop-blur-sm flex flex-col justify-center text-center">
            <div className="mb-6">
              <h2 className="mt-4 text-[28px] font-['Cormorant_Garamond'] uppercase tracking-[0.18em] font-light leading-[1.2] text-[#f0ead8]">
                {title}
              </h2>

              {description ? (
                <p className="mt-4 text-[11px] leading-[1.5] text-[#868282]">
                  {description}
                </p>
              ) : null}
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
