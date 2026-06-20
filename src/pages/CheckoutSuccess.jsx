import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Orders } from "../ReduxSetUp/Feature/Products/ProductSlice";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  // Try to refresh orders a few times after returning from Stripe (helps local testing without webhooks)
  useEffect(() => {
    if (!sessionId || !userInfo) return;

    let attempts = 0;
    const maxAttempts = 8; // ~24 seconds
    const userId = userInfo._id || userInfo.id || null;
    if (!userId) return;

    const id = setInterval(() => {
      attempts += 1;
      dispatch(Orders(userId));
      if (attempts >= maxAttempts) {
        clearInterval(id);
      }
    }, 3000);

    return () => clearInterval(id);
  }, [sessionId, userInfo, dispatch]);

  return (
    <div className="min-h-screen px-4 py-16 pt-28">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={32} />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-emerald-600">
          Payment successful
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Your order is confirmed
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Stripe has completed the payment and your order will be finalized by
          the backend webhook.
        </p>

        {sessionId ? (
          <p className="mt-4 break-all rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs text-slate-500">
            Session ID: {sessionId}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/ordersplaced"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View orders
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => {
              const userId = userInfo?._id || userInfo?.id || null;
              if (userId) dispatch(Orders(userId));
              navigate("/ordersplaced");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Sync orders
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
