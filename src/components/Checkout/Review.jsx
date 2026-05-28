const addresses = ["1 MUI Drive", "Reactville", "Anytown", "99999", "USA"];
const payments = [
  { name: "Card type:", detail: "Visa" },
  { name: "Card holder:", detail: "Mr. John Smith" },
  { name: "Card number:", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date:", detail: "04/2024" },
];

export default function Review() {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Products</p>
            <p className="text-sm text-slate-500">4 selected</p>
          </div>
          <p className="font-semibold text-slate-900">$134.98</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Shipping</p>
            <p className="text-sm text-slate-500">Plus taxes</p>
          </div>
          <p className="text-sm text-slate-900">$9.99</p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-900">Total</p>
          <p className="text-lg font-bold text-slate-900">$144.97</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Shipment details</p>
            <p className="mt-2 text-base text-slate-700">John Smith</p>
            <p className="text-sm text-slate-500">{addresses.join(", ")}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Payment details</p>
            <div className="mt-3 space-y-3">
              {payments.map((payment) => (
                <div key={payment.name} className="flex justify-between gap-4 text-sm text-slate-700">
                  <span className="text-slate-500">{payment.name}</span>
                  <span className="font-medium text-slate-900">{payment.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
