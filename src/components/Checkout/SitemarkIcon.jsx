export default function SitemarkIcon() {
  return (
    <div className="inline-flex items-center gap-3 rounded-[2rem] bg-slate-900 px-5 py-4 text-white shadow-lg shadow-black/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 font-bold">
        ✓
      </div>
      <div className="space-y-1 text-left">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Order</p>
        <p className="text-sm font-semibold">Checkout</p>
      </div>
    </div>
  );
}
