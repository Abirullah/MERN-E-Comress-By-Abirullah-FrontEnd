import { motion } from "framer-motion";
import Pic from "../../../public/Pictures/Air Jordan 1 Retro High OG (2025) - Black Toe Reimagined.jpg";

const AuthLayout = ({ badge, title, children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f7f4] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full flex items-center justify-center max-w-6xl min-h-[90vh] overflow-hidden border border-white/50 shadow-[0_30px_100px_rgba(0,0,0,0.08)] rounded-3xl"
      >
        {/* ── Background Image ── */}
        <div className="absolute inset-0 z-0">
          <img
            src={Pic}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* ── Form Panel ── */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 bg-white/20 backdrop-blur-xl border border-white/30 m-6 rounded-2xl w-[90%] lg:w-auto">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
              {badge}
            </span>

            <h1 className="mt-6 text-4xl font-light leading-tight text-white drop-shadow">
              {title}
            </h1>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;