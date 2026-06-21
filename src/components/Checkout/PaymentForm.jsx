import { useMemo, useState } from "react";

const BANK_DETAILS = [
  { label: "Bank", value: "Mastercredit" },
  { label: "Account holder", value: "Mastercredit Commerce" },
  { label: "Account number", value: "123456789" },
  { label: "Routing number", value: "987654321" },
];

const paymentOptions = [
  {
    id: "bankTransfer",
    title: "Bank transfer",
    subtitle: "Send payment directly to our account and upload the screenshot",
  },
  {
    id: "cod",
    title: "Cash on delivery",
    subtitle: "Pay the courier when the order arrives",
  },
];

export default function PaymentForm({ initialValues = {} }) {
  const [paymentType, setPaymentType] = useState(
    initialValues.paymentType || "bankTransfer"
  );
  const [paymentSlipName, setPaymentSlipName] = useState(
    initialValues.paymentSlipName || ""
  );

  const paymentInstructions = useMemo(() => {
    if (paymentType === "cod") {
      return "Your order will be marked as cash on delivery and the delivery team will collect payment when the package arrives.";
    }

    return "Transfer the amount to the bank account below, then upload a clear screenshot of the payment slip so the team can verify it.";
  }, [paymentType]);

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0] || null;
    setPaymentSlipName(file ? file.name : "");
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="paymentType" value={paymentType} />

      <div className="grid gap-4 md:grid-cols-2">
        {paymentOptions.map((option) => {
          const active = paymentType === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPaymentType(option.id)}
              className={`rounded-[1.75rem] border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-slate-900 bg-slate-100 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{option.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {option.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Payment instructions
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {paymentInstructions}
        </p>

        {paymentType === "bankTransfer" ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Bank details</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {BANK_DETAILS.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {detail.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4">
              <label
                htmlFor="payment-slip"
                className="block text-sm font-semibold text-slate-800"
              >
                Upload payment screenshot
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Upload an image of the transfer receipt. Clear screenshots help us verify the payment faster.
              </p>
              <input
                id="payment-slip"
                type="file"
                name="payment-slip"
                accept="image/*"
                onChange={handleSlipChange}
                required
                className="mt-4 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition-colors file:mr-4 file:border-0 file:bg-[#f8fafc] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0f172a] file:cursor-pointer"
              />
              {paymentSlipName ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                  Uploaded: {paymentSlipName}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Cash on delivery</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your phone reachable. The courier will collect payment at delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

