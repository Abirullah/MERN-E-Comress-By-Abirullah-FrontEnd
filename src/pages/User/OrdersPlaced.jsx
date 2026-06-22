import { useEffect, useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  PackageCheck,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Orders } from "../../ReduxSetUp/Feature/Products/ProductSlice";


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
      className: "bg-[#1a2e1a] text-[#8fbc8f] border-[#2d4a2d]",
      dotColor: "bg-[#8fbc8f]",
      gradientFrom: "from-[#8fbc8f]",
      gradientTo: "to-[#6b9e6b]",
    };
  }

  if (
    ["shipping", "shipped", "in transit", "out for delivery", "dispatched"].includes(normalized)
  ) {
    return {
      label: "In Transit",
      icon: Truck,
      className: "bg-[#1a2436] text-[#87ceeb] border-[#2a3a52]",
      dotColor: "bg-[#87ceeb]",
      gradientFrom: "from-[#87ceeb]",
      gradientTo: "to-[#6bb5d8]",
    };
  }

  if (
    ["cancelled", "canceled", "failed", "refunded", "returned"].includes(normalized)
  ) {
    return {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-[#2e1a1a] text-[#e57373] border-[#4a2d2d]",
      dotColor: "bg-[#e57373]",
      gradientFrom: "from-[#e57373]",
      gradientTo: "to-[#d35f5f]",
    };
  }

  return {
    label: "Processing",
    icon: Clock3,
    className: "bg-[#2e2a1a] text-[#d4a544] border-[#4a3d2d]",
    dotColor: "bg-[#d4a544]",
    gradientFrom: "from-[#d4a544]",
    gradientTo: "to-[#c19a3e]",
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
  const itemCount = items.length > 0 ? items.length : 1;
  const brand = getItemBrand(primaryItem, order);

  const itemNames = (items.length > 0 ? items : [primaryItem])
    .map((item) => getItemName(item))
    .filter(Boolean);
  
  let displayName;
  if (itemNames.length === 1) {
    displayName = itemNames[0];
  } else if (itemNames.length === 2) {
    displayName = `${itemNames[0]} & ${itemNames[1]}`;
  } else if (itemNames.length > 2) {
    displayName = `${itemNames[0]} & ${itemNames.length - 1} more item${itemNames.length - 1 === 1 ? '' : 's'}`;
  } else {
    displayName = `Order ${formatOrderId(orderId)}`;
  }

  return {
    orderId,
    orderNumber: formatOrderId(orderId),
    displayName,
    brand,
    status,
    statusMeta,
    quantity,
    quantityLabel: `${quantity} item${quantity === 1 ? "" : "s"}`,
    itemCount,
    totalAmount,
    totalLabel: formatCurrency(totalAmount, currency),
    placedAt,
    placedAtLabel: formatDate(placedAt),
    currency,
  };
};

function StatCard({ label, value, description, icon: Icon }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#0e0e0e] p-6 border border-[#1e1e1e] transition-all duration-300 hover:border-[#d4a544]/30 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4a544]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5a5a5a]">
            {label}
          </p>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#1e1e1e] transition-all duration-300 group-hover:border-[#d4a544]/30 group-hover:scale-110">
              <Icon size={20} className="text-[#d4a544]" />
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-4xl font-bold tracking-tight text-[#ddd4be]">
            {value}
          </p>
          {description && (
            <p className="mt-2 text-[11px] text-[#5a5a5a]">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const StatusIcon = order.statusMeta.icon;
  const detailsPath = `/orders/${order.orderId}`;

  return (
    <Link
      to={detailsPath}
      className="group relative block overflow-hidden rounded-2xl bg-[#0e0e0e] border border-[#1e1e1e] transition-all duration-500 hover:border-[#d4a544]/30 hover:-translate-y-2"
    >
      {/* Status Gradient Bar */}
      <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${order.statusMeta.gradientFrom} ${order.statusMeta.gradientTo} transition-all duration-300 group-hover:w-2`} />
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Section - Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-bold text-[#ddd4be] bg-[#1a1a1a] px-3 py-1 rounded-lg border border-[#1e1e1e]">
                {order.orderNumber}
              </span>
              <div className={`
                inline-flex items-center gap-2 rounded-full border px-3 py-1
                text-[10px] font-semibold uppercase tracking-[0.15em]
                ${order.statusMeta.className}
              `}>
                <span className={`h-2 w-2 rounded-full ${order.statusMeta.dotColor} animate-pulse`} />
                <StatusIcon size={12} />
                <span>{order.statusMeta.label}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold tracking-tight text-[#ddd4be] line-clamp-2 group-hover:text-[#d4a544] transition-colors">
              {order.displayName}
            </h3>
            
            {order.brand && (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5a5a5a]">
                {order.brand}
              </p>
            )}
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-[#6b6666]">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[#5a5a5a]" />
                <span>{order.placedAtLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package size={14} className="text-[#5a5a5a]" />
                <span>{order.quantityLabel}</span>
              </div>
              {order.itemCount > 1 && (
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-[#5a5a5a]" />
                  <span>{order.itemCount} different items</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Price & Action */}
          <div className="flex flex-col items-start sm:items-end gap-4">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5a5a5a] mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold tracking-tight text-[#ddd4be]">
                {order.totalLabel}
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#d4a544] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 group-hover:bg-[#c19a3e] group-hover:gap-3">
              View Details
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0e0e0e] p-12 text-center border border-[#1e1e1e]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4a544]/5 via-transparent to-transparent" />
      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1a1a1a] border border-[#1e1e1e]">
          <ShoppingBag size={32} className="text-[#d4a544]" />
        </div>
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-[#ddd4be]">
          No orders yet
        </h2>
        <p className="mt-4 text-[11px] leading-7 text-[#6b6666] max-w-md mx-auto">
          Your completed purchases will appear here once the payment is confirmed. Start exploring our collection!
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4a544] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5"
        >
          Browse products
          <ArrowRight size={16} />
        </Link>
      </div>
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
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1e1e1e] border-t-[#d4a544] mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={20} className="text-[#d4a544]" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#6b6666] uppercase tracking-[0.18em]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 bg-[#080808]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#ddd4be] sm:text-6xl">
                My Orders
                <span className="ml-4 text-3xl font-normal text-[#333]">
                  {normalizedOrders.length}
                </span>
              </h1>
            </div>
            
            {ordersLoading && (
              <button
                onClick={handleRefresh}
                disabled={!userId}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-4 py-2 text-[11px] font-medium text-[#6b6666] transition-all hover:border-[#d4a544]/30 hover:text-[#d4a544]"
              >
                <RefreshCw size={14} className="animate-spin" />
                Refreshing...
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {ordersError && (
          <div className="mb-8 rounded-2xl border border-[#4a2d2d] bg-gradient-to-r from-[#2e1a1a] to-[#0e0e0e] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4a2d2d]">
                  <XCircle size={20} className="text-[#e57373]" />
                </div>
                <div>
                  <p className="font-semibold text-[#e57373] uppercase tracking-[0.15em] text-[10px]">Failed to load orders</p>
                  <p className="mt-1 text-[11px] text-[#8b7070]">{ordersError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={!userId || ordersLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#4a2d2d] bg-[#1a1a1a] px-5 py-2.5 text-[11px] font-semibold text-[#e57373] transition-all hover:border-[#e57373]/50 hover:bg-[#2e1a1a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={14} className={ordersLoading ? "animate-spin" : ""} />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={normalizedOrders.length}
            description="All purchases"
            icon={ShoppingBag}
          />
          <StatCard
            label="Total Spent"
            value={formatCurrency(stats.totalSpent)}
            description="Lifetime spending"
            icon={CreditCard}
          />
          <StatCard
            label="Delivered"
            value={stats.delivered}
            description="Completed"
            icon={PackageCheck}
          />
          <StatCard
            label="In Transit"
            value={stats.inTransit}
            description="Shipping now"
            icon={Truck}
          />
        </div>

        {/* Orders List */}
        {normalizedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {normalizedOrders.map((order, index) => (
              <div
                key={order.orderId || `${order.displayName}-${order.placedAtLabel}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}