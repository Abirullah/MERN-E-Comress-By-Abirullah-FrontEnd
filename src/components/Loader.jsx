import { useLocation } from "react-router-dom";
import {
  Package,
  Heart,
  ShoppingBag,
  LogIn,
  Send,
  CheckCircle2,
  Home,
  Bell,
  FileText,
  Truck,
  RotateCcw,
  HelpCircle,
  Info,
} from "lucide-react";

const getIconForPath = (pathname) => {
  if (pathname.includes("/orders")) return Package;
  if (pathname.includes("/washinglist") || pathname.includes("/wishlist")) return Heart;
  if (pathname.includes("/shop") || pathname.includes("/products")) return ShoppingBag;
  if (pathname.includes("/login") || pathname.includes("/register")) return LogIn;
  if (pathname.includes("/contact")) return Send;
  if (pathname.includes("/notifications")) return Bell;
  if (pathname.includes("/shipping")) return Truck;
  if (pathname.includes("/returns")) return RotateCcw;
  if (pathname.includes("/faq")) return HelpCircle;
  if (
    pathname.includes("/about") ||
    pathname.includes("/privacy") ||
    pathname.includes("/terms") ||
    pathname.includes("/accessibility") ||
    pathname.includes("/cookies") ||
    pathname.includes("/careers")
  )
    return FileText;
  if (pathname.includes("/checkout")) return CheckCircle2;
  if (pathname.includes("/profile")) return Info;
  return Home; // default
};

const getTextForPath = (pathname) => {
  if (pathname.includes("/orders")) return "Loading your orders...";
  if (pathname.includes("/washinglist") || pathname.includes("/wishlist")) return "Loading your wishlist...";
  if (pathname.includes("/shop")) return "Loading products...";
  if (pathname.includes("/products")) return "Loading product...";
  if (pathname.includes("/login")) return "Signing you in...";
  if (pathname.includes("/contact")) return "Loading...";
  if (pathname.includes("/notifications")) return "Loading notifications...";
  if (pathname.includes("/shipping")) return "Loading shipping details...";
  if (pathname.includes("/returns")) return "Loading returns policy...";
  if (pathname.includes("/faq")) return "Loading answers...";
  if (
    pathname.includes("/about") ||
    pathname.includes("/privacy") ||
    pathname.includes("/terms") ||
    pathname.includes("/accessibility") ||
    pathname.includes("/cookies") ||
    pathname.includes("/careers")
  )
    return "Loading page...";
  if (pathname.includes("/checkout")) return "Processing...";
  if (pathname.includes("/profile")) return "Loading profile...";
  return "Loading...";
};

const Loader = ({ icon, text, fullScreen = false }) => {
  const location = useLocation();
  const Icon = icon || getIconForPath(location.pathname);
  const displayText = text || getTextForPath(location.pathname);

  return (
    <div
      className={`flex items-center justify-center bg-[#080808] px-4 ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16">
          <div
            className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#1e1e1e] border-t-[#d4a544]"
            style={{ animationDuration: "1.8s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {Icon && (
              <Icon
                size={20}
                className="text-[#d4a544] drop-shadow-[0_0_10px_rgba(212,165,68,0.35)]"
              />
            )}
          </div>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#6b6666] animate-pulse">
          {displayText}
        </p>
      </div>
    </div>
  );
};

export default Loader;
