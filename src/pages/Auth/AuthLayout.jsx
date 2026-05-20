import { motion } from "framer-motion";

const AuthLayout = ({
  badge,
  title,
  children,
}) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f7f4] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/50 bg-white/70 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:grid-cols-2"
      >
        <div className="hidden bg-black p-10 text-white lg:flex lg:flex-col lg:justify-between">
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
              {badge}
            </span>

            <h1 className="mt-6 text-4xl font-light leading-tight text-slate-900">
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