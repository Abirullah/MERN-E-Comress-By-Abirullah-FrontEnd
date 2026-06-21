import { ArrowLeft, ShoppingBag, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-[#080808] px-4 py-16 pt-28">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] border border-[#4a2d2d] bg-gradient-to-b from-[#0e0e0e] to-[#1a1111] p-8 text-center shadow-2xl sm:p-10">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2e1a1a] border border-[#4a2d2d]">
          <XCircle size={36} className="text-[#e57373]" />
        </div>

        {/* Content */}
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#e57373]">
          Payment cancelled
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#ddd4be]">
          Checkout was not completed
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#6b6666] max-w-md mx-auto">
          No payment was taken. You can return to the store and try again when
          you&apos;re ready.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4a544] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20"
          >
            <ShoppingBag size={16} />
            Back to shop
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ddd4be] transition-all duration-300 hover:border-[#d4a544]/30 hover:text-[#d4a544] hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}