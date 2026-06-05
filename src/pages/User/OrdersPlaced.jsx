import { useEffect, useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  CreditCard,
  Eye,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";
import { Orders } from "../../ReduxSetUp/Feature/Products/ProductSlice";

const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";

const parseAmount = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeCurrency = (value) => {
  const currency = String(value || "USD").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : "USD";
};

const formatCurrency = (amount, currency) => {
  const numericAmount = parseAmount(amount);

  if (numericAmount === null) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizeCurrency(currency),
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(numericAmount);
  }
};

const formatTitleCase = (value) =>
  String(value || "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const formatDate = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatOrderId = (value) => {
  if (!value) {
    return "N/A";
  }

  const raw = String(value).trim();
  return raw.length > 10 ? `#${raw.slice(-8).toUpperCase()}` : `#${raw.toUpperCase()}`;
};

const getStatusMeta = (status) => {
  const normalized = String(status || "pending").trim().toLowerCase();

  if (
    ["delivered", "completed", "complete", "fulfilled", "paid", "success", "succeeded"].includes(
      normalized
    )
  ) {
    return {
      label: "Delivered",
      icon: PackageCheck,
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (
    ["shipping", "shipped", "in transit", "out for delivery", "dispatched"].includes(normalized)
  ) {
    return {
      label: "Shipping",
      icon: Truck,
      className: "bg-sky-100 text-sky-700",
    };
  }

  if (
    ["cancelled", "canceled", "failed", "refunded", "returned"].includes(normalized)
  ) {
    return {
      label: formatTitleCase(status) || "Cancelled",
      icon: XCircle,
      className: "bg-rose-100 text-rose-700",
    };
  }

  return {
    label: formatTitleCase(status) || "Pending",
    icon: Clock3,
    className: "bg-amber-100 text-amber-700",
  };
};

const getOrderItems = (order) => {
  const candidates = [
    order?.items,
    order?.orderItems,
    order?.products,
    order?.cartItems,
    order?.lineItems,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }

  return [];
};

const getItemName = (item) =>
  item?.name ||
  item?.title ||
  item?.product?.name ||
  item?.product?.title ||
  item?.productName ||
  item?.description ||
  "Order item";

const getItemBrand = (item, order) =>
  item?.brand || item?.product?.brand || order?.brand || order?.storeName || "";

const getItemImage = (item, order) =>
  item?.img ||
  item?.image ||
  item?.thumbnail ||
  item?.picture ||
  item?.product?.img ||
  item?.product?.image ||
  item?.product?.images?.[0] ||
  order?.image ||
  order?.thumbnail ||
  FALLBACK_IMAGE;

const getShippingSummary = (shippingAddress) => {
  if (!shippingAddress) {
    return "Shipping details unavailable";
  }

  if (typeof shippingAddress === "string") {
    return shippingAddress;
  }

  const parts = [];
  const name = [shippingAddress.firstName, shippingAddress.lastName]
    .filter(Boolean)
    .join(" ");

  if (name) {
    parts.push(name);
  }

  const line1 =
    shippingAddress.address1 ||
    shippingAddress.line1 ||
    shippingAddress.street ||
    shippingAddress.address ||
    "";

  if (line1) {
    parts.push(line1);
  }

  const line2 = shippingAddress.address2 || shippingAddress.line2 || "";
  if (line2) {
    parts.push(line2);
  }

  const cityLine = [shippingAddress.city, shippingAddress.state, shippingAddress.zip || shippingAddress.postalCode]
    .filter(Boolean)
    .join(", ");

  if (cityLine) {
    parts.push(cityLine);
  }

  const country = shippingAddress.country || shippingAddress.countryName || "";
  if (country) {
    parts.push(country);
  }

  return parts.length > 0 ? parts.join(", ") : "Shipping details unavailable";
};

const resolveOrderQuantity = (order, items) => {
  if (items.length > 0) {
    return items.reduce((sum, item) => {
      const quantity = Number(item?.quantity ?? item?.qty ?? 1);
      return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
    }, 0);
  }

  const quantityCandidates = [
    order?.quantity,
    order?.qty,
    order?.itemCount,
    order?.itemsCount,
    order?.totalItems,
  ];

  for (const candidate of quantityCandidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  return 1;
};

const resolveOrderTotal = (order, items) => {
  const candidates = [
    order?.totalPrice,
    order?.total,
    order?.amount,
    order?.grandTotal,
    order?.grand_total,
    order?.subtotal,
    order?.subtotalPrice,
    order?.totalAmount,
    order?.price,
  ];

  for (const candidate of candidates) {
    const parsed = parseAmount(candidate);
    if (parsed !== null) {
      return parsed;
    }
  }

  const sourceItems = items.length > 0 ? items : [order];

  return sourceItems.reduce((sum, item) => {
    const unitPrice = parseAmount(
      item?.price ?? item?.unitPrice ?? item?.amount ?? item?.total ?? item?.subtotal
    );
    const quantity = Number(item?.quantity ?? item?.qty ?? 1);
    const normalizedQuantity =
      Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

    return sum + (unitPrice !== null ? unitPrice * normalizedQuantity : 0);
  }, 0);
};

const normalizeOrder = (order) => {
  if (!order || typeof order !== "object") {
    return null;
  }

  const items = getOrderItems(order);
  const primaryItem = items[0] || order;
  const itemNames = (items.length > 0 ? items : [primaryItem])
    .map((item) => getItemName(item))
    .filter(Boolean);
  const orderId =
    order?._id ||
    order?.id ||
    order?.orderId ||
    order?.sessionId ||
    order?.stripeSessionId ||
    order?.checkoutSessionId ||
    null;
  const currency = normalizeCurrency(order?.currency || order?.currencyCode);
  const totalAmount = resolveOrderTotal(order, items);
  const quantity = resolveOrderQuantity(order, items);
  const status = order?.status || order?.orderStatus || order?.deliveryStatus || order?.fulfillmentStatus || order?.paymentStatus || order?.state || "Pending";
  const statusMeta = getStatusMeta(status);
  const placedAt = order?.createdAt || order?.orderedAt || order?.orderDate || order?.updatedAt || null;
  const productId =
    primaryItem?.product?._id ||
    primaryItem?.productId ||
    primaryItem?.product?.id ||
    order?.productId ||
    null;
  const paymentMethod = formatTitleCase(
    order?.paymentMethod ||
      order?.paymentType ||
      order?.payment?.method ||
      order?.payment?.type ||
      order?.stripePaymentMethodType ||
      "Stripe checkout"
  );
  const shippingSummary = getShippingSummary(
    order?.shippingAddress || order?.shippingDetails || order?.address || order?.shipping || null
  );
  const brand = getItemBrand(primaryItem, order);

  return {
    orderId,
    orderNumber: formatOrderId(orderId),
    title: getItemName(primaryItem),
    brand,
    image: getItemImage(primaryItem, order),
    status,
    statusMeta,
    quantity,
    quantityLabel: `${quantity} item${quantity === 1 ? "" : "s"}`,
    itemCount: items.length > 0 ? items.length : 1,
    itemNames,
    totalAmount,
    totalLabel: formatCurrency(totalAmount, currency),
    placedAt,
    placedAtLabel: formatDate(placedAt),
    productId,
    paymentMethod,
    shippingSummary,
    currency,
  };
};

function StatCard({ label, value, description, icon: Icon }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
        {Icon ? (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
        {Icon ? <Icon size={14} className="text-slate-400" /> : null}
      </div>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</p>
    </div>
  );
}

function OrderCard({ order }) {
  const StatusIcon = order.statusMeta.icon;
  const primaryActionLabel = order.productId ? "View product" : "Continue shopping";
  const primaryActionHref = order.productId ? `/products/${order.productId}` : "/shop";
  const extraItems = order.itemNames.length > 1 ? order.itemNames.slice(1) : [];

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="relative min-h-[260px] overflow-hidden bg-slate-100">
          <img
            src={order.image}
            alt={order.title}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />

          <div
            className={`
              absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5
              text-xs font-semibold shadow-sm backdrop-blur
              ${order.statusMeta.className}
            `}
          >
            <StatusIcon size={14} />
            <span>{order.statusMeta.label}</span>
          </div>

          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur">
            {order.itemCount} line item{order.itemCount === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-7">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Order {order.orderNumber}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {order.title}
                </h2>
                {order.brand ? (
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500">
                    {order.brand}
                  </p>
                ) : null}
                {extraItems.length > 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    +{extraItems.length} more item{extraItems.length === 1 ? "" : "s"}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={14} />
                  <p className="text-[10px] uppercase tracking-[0.24em]">Placed</p>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {order.placedAtLabel}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                label="Quantity"
                value={order.quantityLabel}
                icon={ShoppingBag}
              />
              <InfoRow
                label="Total"
                value={order.totalLabel}
                icon={CreditCard}
              />
              <InfoRow
                label="Payment"
                value={order.paymentMethod}
                icon={CreditCard}
              />
              <InfoRow
                label="Ship to"
                value={order.shippingSummary}
                icon={MapPin}
              />
            </div>

            {extraItems.length > 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Items
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {order.itemNames.join(" • ")}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {order.status ? `Current status: ${formatTitleCase(order.status)}` : "Order status unavailable"}
            </p>

            <Link
              to={primaryActionHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Eye size={16} />
              {primaryActionLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-8 py-20 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <ShoppingBag size={28} />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-slate-900">No orders yet</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Your completed purchases will show up here after the backend confirms the payment.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Browse products
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function OrdersPlaced() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { orders = [], ordersLoading, ordersError } = useSelector(
    (state) => state.products
  );

  const userId = userInfo?._id || userInfo?.id || null;

  useEffect(() => {
    if (!userId) {
      return;
    }

    dispatch(Orders(userId));
  }, [dispatch, userId]);

  const normalizedOrders = useMemo(
    () => orders.map(normalizeOrder).filter(Boolean),
    [orders]
  );

  const stats = useMemo(() => {
    return normalizedOrders.reduce(
      (accumulator, order) => {
        accumulator.totalSpent += Number(order.totalAmount || 0);

        const normalizedStatus = String(order.status || "").toLowerCase();
        if (
          ["delivered", "completed", "complete", "fulfilled", "paid", "success", "succeeded"].includes(
            normalizedStatus
          )
        ) {
          accumulator.delivered += 1;
        }

        if (
          [
            "shipping",
            "shipped",
            "in transit",
            "out for delivery",
            "dispatched",
            "processing",
            "pending",
            "created",
            "placed",
            "confirmed",
          ].includes(normalizedStatus)
        ) {
          accumulator.inTransit += 1;
        }

        return accumulator;
      },
      {
        totalSpent: 0,
        delivered: 0,
        inTransit: 0,
      }
    );
  }, [normalizedOrders]);

  const handleRefresh = () => {
    if (!userId) {
      return;
    }

    dispatch(Orders(userId));
  };

  if (ordersLoading && normalizedOrders.length === 0) {
    return (
      
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
       
            <Loader />
        </div>
      
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#f4f1eb_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 pt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Purchase history
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                My Orders
                <span className="ml-3 text-2xl font-normal text-slate-400">
                  ({normalizedOrders.length})
                </span>
              </h1>
            </div>
          </div>

        {ordersError ? (
          <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-rose-800">
                  We could not load your orders
                </p>
                <p className="mt-1 text-rose-700">{ordersError}</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={!userId || ordersLoading}
                className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Try again
              </button>
            </div>
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Orders"
            value={normalizedOrders.length}
            description="All finalized purchases"
            icon={ShoppingBag}
          />
          <StatCard
            label="Total spent"
            value={formatCurrency(stats.totalSpent)}
            description="Across every completed order"
            icon={CreditCard}
          />
          <StatCard
            label="Delivered"
            value={stats.delivered}
            description="Orders that reached the customer"
            icon={PackageCheck}
          />
          <StatCard
            label="In transit"
            value={stats.inTransit}
            description="Orders still moving through fulfillment"
            icon={Truck}
          />
        </section>

        {normalizedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="grid gap-6">
            {normalizedOrders.map((order) => (
              <OrderCard
                key={order.orderId || order.productId || `${order.title}-${order.placedAtLabel}`}
                order={order}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
