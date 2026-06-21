import { CheckCircle2, ArrowRight, Banknote, Package } from "lucide-react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Orders } from "../ReduxSetUp/Feature/Products/ProductSlice";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const location = useLocation();
  const paymentType = location.state?.paymentType || null;
  const order = location.state?.order || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  const formatPaymentMethod = (value) => {
    if (value === "bankTransfer") return "Bank transfer";
    if (value === "cod") return "Cash on delivery";
    if (value === "creditCard") return "Card";
    return value || "bankTransfer";
  };

  useEffect(() => {
    if (!sessionId || !userInfo) return;

    let attempts = 0;
    const maxAttempts = 8;
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

  const title =
    paymentType === "cod"
      ? "Cash on delivery order confirmed"
      : paymentType === "bankTransfer"
      ? "Bank transfer order saved"
      : sessionId
      ? "Payment successful"
      : "Order confirmed";

  const description =
    paymentType === "cod"
      ? "Your order is waiting for delivery. Pay the courier in cash when the package arrives."
      : paymentType === "bankTransfer"
      ? "We saved your order and payment screenshot. The team will verify the transfer and move it to fulfillment."
      : sessionId
      ? "Stripe has completed the payment and your order will be finalized by the backend webhook."
      : "Your order has been saved and is waiting for the next fulfillment step.";

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-16 pt-28">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] border border-[#2d4a2d] bg-gradient-to-b from-[#0e0e0e] to-[#111a11] p-8 text-center shadow-2xl sm:p-10">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1a2e1a] border border-[#2d4a2d]">
          <CheckCircle2 size={36} className="text-[#8fbc8f]" />
        </div>

        {/* Status Label */}
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8fbc8f]">
          Order status
        </p>

        {/* Title */}
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#ddd4be]">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-6 text-[#6b6666] max-w-md mx-auto">
          {description}
        </p>

        {/* Order Details Card */}
        {order ? (
          <div className="mt-6 rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] px-5 py-4 text-left">
            <div className="flex items-center gap-3 text-[#8fbc8f]">
              <Package size={18} />
              <p className="text-sm font-semibold">Order saved</p>
            </div>
            <p className="mt-2 text-sm text-[#6b6666]">
              {order.productName || order.product?.name || "Your item"}
              {order.quantity ? ` · Qty ${order.quantity}` : ""}
            </p>
            <p className="mt-1 text-sm text-[#6b6666]">
              Payment: {formatPaymentMethod(order.paymentMethod || paymentType)}
            </p>
          </div>
        ) : null}

        {/* Session ID */}
        {sessionId ? (
          <p className="mt-4 break-all rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] px-5 py-3 text-xs text-[#5a5a5a] font-mono">
            Session ID: {sessionId}
          </p>
        ) : null}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
          <Link
            to="/ordersplaced"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4a544] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20"
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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ddd4be] transition-all duration-300 hover:border-[#d4a544]/30 hover:text-[#d4a544] hover:-translate-y-0.5"
          >
            <Banknote size={16} />
            Sync orders
          </button>
          
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ddd4be] transition-all duration-300 hover:border-[#d4a544]/30 hover:text-[#d4a544] hover:-translate-y-0.5"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}