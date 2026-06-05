const formatVariantLabel = (variant) => {
  if (!variant) {
    return "Standard";
  }

  const parts = [variant.color, variant.size]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => String(value));

  return parts.length > 0 ? parts.join(" · ") : "Standard";
};

const formatAddress = (shippingDetails) => {
  const parts = [
    [shippingDetails.firstName, shippingDetails.lastName]
      .filter(Boolean)
      .join(" "),
    shippingDetails.address1,
    shippingDetails.address2,
    [shippingDetails.city, shippingDetails.state, shippingDetails.zip]
      .filter(Boolean)
      .join(", "),
    shippingDetails.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts : ["No shipping details saved yet"];
};

const maskCardNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (digits.length <= 4) {
    return digits || "Not provided";
  }

  return `**** **** **** ${digits.slice(-4)}`;
};

export default function Review({
  product,
  selectedVariant,
  quantity,
  subtotalPrice,
  totalPrice,
  shippingDetails,
  paymentDetails,
}) {
  const shippingLines = formatAddress(shippingDetails || {});
  const paymentType =
    paymentDetails?.paymentType === "bankTransfer" ? "Bank account" : "Card";

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Products</p>
            <p className="text-sm text-slate-500">{quantity} item(s) selected</p>
          </div>
          <p className="font-semibold text-slate-900">{subtotalPrice}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Shipping</p>
            <p className="text-sm text-slate-500">Handled in the Stripe checkout session.</p>
          </div>
          <p className="text-sm text-slate-900">Free</p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-900">Total</p>
          <p className="text-lg font-bold text-slate-900">{totalPrice}</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Shipment details</p>
            <p className="mt-2 text-base text-slate-700">
              {[shippingDetails?.firstName, shippingDetails?.lastName]
                .filter(Boolean)
                .join(" ") || "Shipping details not completed yet"}
            </p>
            <p className="text-sm text-slate-500">
              {shippingLines.map((line) => line).join(", ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Payment details</p>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between gap-4 text-sm text-slate-700">
                <span className="text-slate-500">Method:</span>
                <span className="font-medium text-slate-900">{paymentType}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-slate-700">
                <span className="text-slate-500">Card number:</span>
                <span className="font-medium text-slate-900">
                  {maskCardNumber(paymentDetails?.cardNumber)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-slate-700">
                <span className="text-slate-500">Expiration:</span>
                <span className="font-medium text-slate-900">
                  {paymentDetails?.expirationDate || "Not provided"}
                </span>
              </div>
              {product && (
                <div className="flex justify-between gap-4 text-sm text-slate-700">
                  <span className="text-slate-500">Variant:</span>
                  <span className="font-medium text-slate-900">
                    {formatVariantLabel(selectedVariant)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
