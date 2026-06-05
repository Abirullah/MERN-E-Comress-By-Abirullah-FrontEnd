import { ArrowLeft, ShoppingBag, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen px-4 py-16 pt-28">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <XCircle size={32} />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-rose-600">
          Payment cancelled
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Checkout was not completed
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          No payment was taken. You can return to the store and try again when
          you&apos;re ready.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ShoppingBag size={16} />
            Back to shop
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            <ArrowLeft size={16} />
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
