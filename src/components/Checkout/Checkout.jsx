import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import Review from "./Review";
import Loader from "../Loader";
import {
  createOrder,
  fetchProductById,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

const steps = ["Shipping address", "Payment details", "Review your order"];

const FALLBACK_COUNTRY = "United States";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const getCheckoutUnitPrice = (product) => {
  const basePrice = Number(product?.price || 0);
  const discountPrice = Number(product?.discountPrice || 0);

  if (discountPrice > 0 && discountPrice < basePrice) {
    return discountPrice;
  }

  return basePrice;
};

const getVariantLabel = (variant) => {
  if (!variant) {
    return "Standard";
  }

  const parts = [variant.color, variant.size]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map((value) => String(value));

  return parts.length > 0 ? parts.join(" · ") : "Standard";
};

const getShippingDefaults = (userInfo) => {
  const profile = userInfo?.Profile || {};

  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    address1: profile.address || "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: FALLBACK_COUNTRY,
    usePaymentAddress: true,
  };
};

const readShippingDetails = (formData) => ({
  firstName: String(formData.get("first-name") || ""),
  lastName: String(formData.get("last-name") || ""),
  address1: String(formData.get("address1") || ""),
  address2: String(formData.get("address2") || ""),
  city: String(formData.get("city") || ""),
  state: String(formData.get("state") || ""),
  zip: String(formData.get("zip") || ""),
  country: String(formData.get("country") || ""),
  usePaymentAddress: Boolean(formData.get("usePaymentAddress")),
});

const readPaymentDetails = (formData) => ({
  paymentType: String(formData.get("paymentType") || "creditCard"),
  cardNumber: String(formData.get("card-number") || ""),
  cvv: String(formData.get("cvv") || ""),
  cardName: String(formData.get("card-name") || ""),
  expirationDate: String(formData.get("card-expiration") || ""),
  rememberCard: Boolean(formData.get("remember-card")),
});

function getStepContent({
  activeStep,
  shippingDetails,
  paymentDetails,
  product,
  selectedVariant,
  quantity,
  subtotalPrice,
  totalPrice,
}) {
  switch (activeStep) {
    case 0:
      return <AddressForm defaultValues={shippingDetails} />;
    case 1:
      return <PaymentForm initialValues={paymentDetails} />;
    case 2:
      return (
        <Review
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          subtotalPrice={subtotalPrice}
          totalPrice={totalPrice}
          shippingDetails={shippingDetails}
          paymentDetails={paymentDetails}
        />
      );
    default:
      return null;
  }
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: productId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    selectedProduct,
    detailsLoading,
    detailsError,
    checkoutLoading,
  } = useSelector((state) => state.products);

  const routeProduct = location.state?.product;
  const routeVariant = location.state?.selectedVariant || null;
  const routeQuantity = Number(location.state?.quantity || 1);

  const [activeStep, setActiveStep] = useState(0);
  const [quantity, setQuantity] = useState(
    Number.isFinite(routeQuantity) && routeQuantity > 0 ? routeQuantity : 1
  );
  const [shippingDetails, setShippingDetails] = useState(() =>
    getShippingDefaults(userInfo)
  );
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: "creditCard",
    cardNumber: "",
    cvv: "",
    cardName: "",
    expirationDate: "",
    rememberCard: false,
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    setShippingDetails((current) => {
      const hasTypedData = [
        current.firstName,
        current.lastName,
        current.address1,
        current.address2,
        current.city,
        current.state,
        current.zip,
      ].some((value) => value !== "");

      return hasTypedData ? current : getShippingDefaults(userInfo);
    });
  }, [userInfo]);

  const product = useMemo(() => {
    const currentProductId = selectedProduct?._id || selectedProduct?.id;

    if (selectedProduct && String(currentProductId) === String(productId)) {
      return selectedProduct;
    }

    const routeProductId = routeProduct?._id || routeProduct?.id;

    if (routeProduct && String(routeProductId) === String(productId)) {
      return routeProduct;
    }

    return selectedProduct || routeProduct || null;
  }, [productId, routeProduct, selectedProduct]);

  const selectedVariant = useMemo(() => {
    if (routeVariant) {
      return routeVariant;
    }

    const variants = Array.isArray(product?.variants) ? product.variants : [];
    return (
      variants.find((variant) => Number(variant.stock) > 0) ||
      variants[0] ||
      null
    );
  }, [product, routeVariant]);

  const checkoutUnitPrice = useMemo(
    () => getCheckoutUnitPrice(product),
    [product]
  );

  const availableStock = Number(
    selectedVariant?.stock ?? product?.countInStock ?? 0
  );
  const canCheckout = availableStock > 0;

  useEffect(() => {
    if (!productId) {
      return;
    }

    const currentProductId = product?._id || product?.id;
    if (currentProductId && String(currentProductId) === String(productId)) {
      return;
    }

    dispatch(fetchProductById(productId));
  }, [dispatch, product, productId]);

  useEffect(() => {
    if (availableStock > 0) {
      setQuantity((current) =>
        Math.min(Math.max(current, 1), availableStock)
      );
    }
  }, [availableStock]);

  const subtotalAmount = checkoutUnitPrice * quantity;
  const subtotalPrice = formatCurrency(subtotalAmount);
  const totalPrice = subtotalPrice;

  const handleQuantityChange = (direction) => {
    setQuantity((current) => {
      if (direction === "decrease") {
        return Math.max(1, current - 1);
      }

      return Math.min(Math.max(availableStock, 1), current + 1);
    });
  };

  const handlePlaceOrder = async () => {
    if (!productId || !product) {
      toast.error("We could not find this product.");
      return;
    }

    if (!canCheckout) {
      toast.error("This product is currently out of stock.");
      return;
    }

    try {
      const response = await dispatch(
        createOrder({ productId, quantity })
      ).unwrap();

      if (response?.url) {
        window.location.assign(response.url);
        return;
      }

      throw new Error("Stripe did not return a checkout URL.");
    } catch (error) {
      toast.error(error?.message || "We could not start checkout right now.");
    }
  };

  const handleStepSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (activeStep === 0) {
      setShippingDetails(readShippingDetails(formData));
      setActiveStep(1);
      return;
    }

    if (activeStep === 1) {
      setPaymentDetails(readPaymentDetails(formData));
      setActiveStep(2);
      return;
    }

    await handlePlaceOrder();
  };

  if (!product && detailsLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 mt-20">
        <div className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <Loader />
        </div>
      </div>
    );
  }

  if (detailsError && !product) {
    return (
      <div className="min-h-screen bg-white text-slate-900 mt-20">
        <div className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-2xl rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-8 text-center text-rose-700 shadow-sm">
            <p className="text-sm uppercase tracking-[0.26em] text-rose-500">
              Checkout unavailable
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-rose-800">
              We could not load this product
            </h1>
            <p className="mt-3 text-sm text-rose-700">{detailsError}</p>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-6 inline-flex items-center justify-center rounded-3xl bg-rose-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Back to shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productImage = product?.images?.[0] || "/Pictures/pexels-ian-panelo-7716266.jpg";

  return (
    <div className="min-h-screen bg-white text-slate-900 mt-20">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 md:p-6">
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
                      <span className="text-sm font-semibold text-slate-900">
                        {label}
                      </span>
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
              <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <img
                  src={productImage}
                  alt={product?.name || "Product"}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
                    Order details
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {product?.name || "Loading product"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {getVariantLabel(selectedVariant)}
                  </p>
                </div>
              </div>

              <Info
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                subtotalPrice={subtotalPrice}
                shippingPriceLabel="Free"
                totalPrice={totalPrice}
              />
            </div>
          </aside>

          <main className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
                    Step {activeStep + 1}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                    {steps[activeStep]}
                  </h2>
                </div>
                <div className="sm:hidden">
                  <InfoMobile
                    product={product}
                    selectedVariant={selectedVariant}
                    quantity={quantity}
                    subtotalPrice={subtotalPrice}
                    shippingPriceLabel="Free"
                    totalPrice={totalPrice}
                  />
                </div>
              </div>

              {!canCheckout && product ? (
                <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
                  This item is currently out of stock. Checkout will stay
                  disabled until inventory is available again.
                </div>
              ) : null}

              <form onSubmit={handleStepSubmit} className="space-y-6">
                <div className="rounded-[2rem] bg-slate-50 p-6">
                  {getStepContent({
                    activeStep,
                    shippingDetails,
                    paymentDetails,
                    product,
                    selectedVariant,
                    quantity,
                    subtotalPrice,
                    totalPrice,
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                    disabled={activeStep === 0 || checkoutLoading}
                    className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={checkoutLoading || (activeStep === 2 && !canCheckout)}
                      className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkoutLoading
                        ? "Redirecting to Stripe..."
                        : activeStep === steps.length - 1
                        ? "Place order"
                        : "Next"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
