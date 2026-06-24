const AuthLayout = ({ title, description, children }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Tenor+Sans&display=swap');

        @keyframes ringPulse {
          0%,100% { opacity: 1;   transform: scale(1);    }
          50%      { opacity: 0.3; transform: scale(1.05); }
        }

        @keyframes particleRise {
          0%   { opacity: 0;   transform: translateY(0);      }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.1; }
          100% { opacity: 0;   transform: translateY(-220px); }
        }

        .lx-ring {
          position: absolute;
          border-radius: 9999px;
          border: 1.5px solid rgba(212,165,68,.1);
          animation: ringPulse 4s ease-in-out infinite;
        }

        .lx-particle {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          border-radius: 9999px;
          background: #d4a544;
          opacity: 0;
          animation: particleRise 6s ease-in-out infinite;
        }

        /* fewer rings on small screens */
        @media (max-width: 640px) {
          .lx-ring-hide { display: none; }
        }
      `}</style>

      <div
        className="relative min-h-screen [min-height:100dvh] overflow-hidden font-['Tenor_Sans']"
        style={{ background: "var(--auth-bg, #080808)" }}
      >
        {/* rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[180, 280, 380, 480, 580, 680, 780].map((size, i) => (
            <div
              key={i}
              className={`lx-ring${i > 3 ? " lx-ring-hide" : ""}`}
              style={{
                width:  size,
                height: size,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </div>

        {/* particles — fewer on mobile via JS slice */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="lx-particle"
            style={{
              left:              `${8 + ((i * 6) % 85)}%`,
              bottom:            `${(i * 7) % 28}%`,
              animationDelay:    `${(i * 0.45).toFixed(1)}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}

        {/* gradient veil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,rgba(8,8,8,0.72) 0%,rgba(8,8,8,0.5) 50%,rgba(8,8,8,0.78) 100%)",
          }}
        />

        {/* content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-8 overflow-y-auto">

          {/* brand — visible md+ */}
          <div className="hidden md:flex mb-8 flex-col items-center text-center">
            <h1 className="font-['Cormorant_Garamond'] text-[52px] lg:text-[60px] font-light uppercase tracking-[0.2em] leading-none text-[#d4a544]">
              Luxe Step
            </h1>
            <p className="mt-2 text-[13px] uppercase tracking-[0.3em] text-[#555]">
              Premium Footwear
            </p>
            <p className="mt-4 font-['Cormorant_Garamond'] text-[16px] italic font-light leading-[1.6] text-[#7a6a50]">
              "Where every step tells a story."
            </p>
          </div>

          {/* mobile brand — compact */}
          <div className="md:hidden mb-6 text-center">
            <h1 className="font-['Cormorant_Garamond'] text-[36px] font-light uppercase tracking-[0.2em] leading-none text-[#d4a544]">
              Luxe Step
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#555]">
              Premium Footwear
            </p>
          </div>

          {/* card */}
          <div
            className="w-full max-w-lg rounded-2xl border border-[#1e1e1e] px-5 sm:px-8 py-7 sm:py-9 backdrop-blur-sm text-left"
            style={{ background: "rgba(19,19,19,0.6)" }}
          >
            {/* card heading */}
            <div className="mb-6">
              <h2 className="text-[22px] sm:text-[26px] font-['Cormorant_Garamond'] uppercase tracking-[0.15em] font-light leading-[1.2] text-[#f0ead8]">
                {title}
              </h2>
              {description && (
                <p className="mt-2 text-[11px] leading-[1.6] text-[#868282]">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;