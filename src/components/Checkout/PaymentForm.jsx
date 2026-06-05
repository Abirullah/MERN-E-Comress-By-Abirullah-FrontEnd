import { useState } from "react";

const paymentOptions = [
  { id: "creditCard", title: "Card", subtitle: "Pay with credit card" },
  { id: "bankTransfer", title: "Bank account", subtitle: "Transfer funds directly" },
];

export default function PaymentForm({ initialValues = {} }) {
  const [paymentType, setPaymentType] = useState(
    initialValues.paymentType || "creditCard"
  );
  const [cardNumber, setCardNumber] = useState(initialValues.cardNumber || "");
  const [cvv, setCvv] = useState(initialValues.cvv || "");
  const [expirationDate, setExpirationDate] = useState(
    initialValues.expirationDate || ""
  );

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleExpirationDateChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, "$1/");
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="paymentType" value={paymentType} />

      <div className="grid gap-4 sm:grid-cols-2">
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
              <p className="mt-2 text-sm text-slate-500">{option.subtitle}</p>
            </button>
          );
        })}
      </div>

      {paymentType === "creditCard" ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Credit card</p>
              <p className="text-sm text-slate-500">Secure payment details</p>
            </div>
            <div className="rounded-3xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              Card
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="card-number" className="text-sm font-semibold text-slate-800">
                Card number
              </label>
              <input
                id="card-number"
                name="card-number"
                type="text"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                className="field-input"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cvv" className="text-sm font-semibold text-slate-800">
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                autoComplete="cc-csc"
                placeholder="123"
                className="field-input"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="card-name" className="text-sm font-semibold text-slate-800">
                Name
              </label>
              <input
                id="card-name"
                name="card-name"
                type="text"
                autoComplete="cc-name"
                placeholder="John Smith"
                defaultValue={initialValues.cardName || ""}
                className="field-input"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="card-expiration" className="text-sm font-semibold text-slate-800">
                Expiration date
              </label>
              <input
                id="card-expiration"
                name="card-expiration"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="field-input"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                required
              />
            </div>
          </div>

          <label className="mt-6 inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="remember-card"
              defaultChecked={initialValues.rememberCard ?? false}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            Remember credit card details for next time
          </label>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Bank transfer</p>
            <p className="mt-1 text-sm text-slate-500">Your order will be processed once we receive the funds.</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4">
              <span className="text-sm text-slate-500">Bank:</span>
              <span className="font-medium text-slate-900">Mastercredit</span>
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4">
              <span className="text-sm text-slate-500">Account number:</span>
              <span className="font-medium text-slate-900">123456789</span>
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4">
              <span className="text-sm text-slate-500">Routing number:</span>
              <span className="font-medium text-slate-900">987654321</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
