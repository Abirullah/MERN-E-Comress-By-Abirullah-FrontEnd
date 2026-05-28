const products = [
  {
    name: "Professional plan",
    desc: "Monthly subscription",
    price: "$15.00",
  },
  {
    name: "Dedicated support",
    desc: "Included in the Professional plan",
    price: "Free",
  },
  {
    name: "Hardware",
    desc: "Devices needed for development",
    price: "$69.99",
  },
  {
    name: "Landing page template",
    desc: "License",
    price: "$49.99",
  },
];

export default function Info({ totalPrice }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPrice}</p>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.name} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">{product.desc}</p>
            </div>
            <p className="text-sm font-medium text-slate-900">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
