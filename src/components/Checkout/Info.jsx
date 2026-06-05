const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const formatVariantLabel = (variant) => {
  if (!variant) {
    return "Standard";
  }

  const parts = [variant.color, variant.size]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => String(value));

  return parts.length > 0 ? parts.join(" · ") : "Standard";
};

export default function Info({
  product,
  selectedVariant,
  quantity,
  subtotalPrice,
  shippingPriceLabel = "Free",
  totalPrice,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPrice}</p>
      </div>

      {product && (
        <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={product.images?.[0] || FALLBACK_IMAGE}
            alt={product.name}
            className="h-20 w-20 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">
                {formatVariantLabel(selectedVariant)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
              <span>Quantity</span>
              <span className="font-medium text-slate-900">{quantity}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">Subtotal</p>
            <p className="text-sm text-slate-500">Product price before checkout.</p>
          </div>
          <p className="text-sm font-medium text-slate-900">{subtotalPrice}</p>
        </div>
        <div className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">Shipping</p>
            <p className="text-sm text-slate-500">Calculated and handled separately.</p>
          </div>
          <p className="text-sm font-medium text-slate-900">{shippingPriceLabel}</p>
        </div>
      </div>
    </div>
  );
}
