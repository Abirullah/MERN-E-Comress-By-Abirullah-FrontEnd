import { useState } from "react";
import Info from "./Info";

export default function InfoMobile({
  product,
  selectedVariant,
  quantity,
  subtotalPrice,
  shippingPriceLabel,
  totalPrice,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-between w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300"
      >
        <span>View details</span>
        <span className="text-lg">▾</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4 sm:p-6">
          <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Order details</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-500 transition hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <Info
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              subtotalPrice={subtotalPrice}
              shippingPriceLabel={shippingPriceLabel}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      )}
    </div>
  );
}
