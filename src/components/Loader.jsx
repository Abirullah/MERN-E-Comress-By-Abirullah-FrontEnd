import { useLocation } from "react-router-dom";
import {
  Package,
  Heart,
  ShoppingBag,
  LogIn,
  Send,
  CheckCircle2,
  Home,
} from "lucide-react";

const getIconForPath = (pathname) => {
  if (pathname.includes("/orders")) return Package;
  if (pathname.includes("/wishlist")) return Heart;
  if (pathname.includes("/shop") || pathname.includes("/products")) return ShoppingBag;
  if (pathname.includes("/login") || pathname.includes("/register")) return LogIn;
  if (pathname.includes("/contact")) return Send;
  if (pathname.includes("/checkout")) return CheckCircle2;
  return Home; // default
};

const getTextForPath = (pathname) => {
  if (pathname.includes("/orders")) return "Loading your orders...";
  if (pathname.includes("/wishlist")) return "Loading your wishlist...";
  if (pathname.includes("/shop")) return "Loading products...";
  if (pathname.includes("/products")) return "Loading product...";
  if (pathname.includes("/login")) return "Signing you in...";
  if (pathname.includes("/contact")) return "Loading...";
  if (pathname.includes("/checkout")) return "Processing...";
  return "Loading...";
};

const Loader = ({ icon, text }) => {
  const location = useLocation();
  const Icon = icon || getIconForPath(location.pathname);
  const displayText = text || getTextForPath(location.pathname);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#080808]">
      <div className="text-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1e1e1e] border-t-[#d4a544] mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            {Icon && <Icon size={20} className="text-[#d4a544]" />}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-[#6b6666] uppercase tracking-[0.18em]">
          {displayText}
        </p>
      </div>
    </div>
  );
};

export default Loader;