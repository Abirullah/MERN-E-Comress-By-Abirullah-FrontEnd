import { useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import Review from "./Review";
import SitemarkIcon from "./SitemarkIcon";

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      return null;
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white shadow-lg shadow-slate-900/10">
                <SitemarkIcon />
              </div>
              <div className="max-w-2xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Checkout
                </h1>
                <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
                  Complete your order with a clean, fast checkout experience. All page sections are styled in Tailwind CSS and the layout uses a white page surface.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
              <p className="font-semibold text-slate-900">Order summary</p>
              <p className="mt-1">{activeStep >= 2 ? "$144.97" : "$134.98"}</p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 sm:p-5 md:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {steps.map((label, index) => {
                const isActive = activeStep === index;
                const isComplete = activeStep > index;
                return (
                  <div
                    key={label}
                    className={`rounded-[1.75rem] border p-4 transition ${
                      isActive
                        ? "border-slate-900 bg-white shadow-sm"
                        : "border-slate-200 bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                          isActive || isComplete
                            ? "bg-slate-900 text-white"
                            : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:block">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Order details</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {activeStep >= 2 ? "$144.97" : "$134.98"}
                </p>
              </div>
              <Info totalPrice={activeStep >= 2 ? "$144.97" : "$134.98"} />
            </div>
          </aside>

          <main className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Step {activeStep + 1}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">{steps[activeStep]}</h2>
                </div>
                <div className="sm:hidden">
                  <InfoMobile totalPrice={activeStep >= 2 ? "$144.97" : "$134.98"} />
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-50 p-6">{getStepContent(activeStep)}</div>

              {activeStep === steps.length ? (
                <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-6xl">📦</p>
                  <h3 className="text-3xl font-semibold text-slate-900">Thank you for your order!</h3>
                  <p className="text-sm text-slate-600">
                    Your order number is <span className="font-semibold">#140396</span>. We will email your confirmation and update shipping status soon.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Go to my orders
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                    disabled={activeStep === 0}
                    className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length))}
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
