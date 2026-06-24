import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/NavBar";
import ThemeToggle from "./components/ThemeToggle";
import { fetchUserProfile } from "./ReduxSetUp/Feature/Auth/AuthSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo, sessionChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && !sessionChecked) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, sessionChecked, userInfo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/otp",
    "/success",
    "/cancel",
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div
      className="
        min-h-screen
        bg-[var(--bg-page)]
        text-[var(--text-primary)]
        transition-colors
        duration-300
        w-full
        overflow-x-hidden
        md:overflow-x-visible
      "
    >
      {/* Ambient gold glow — top */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed inset-x-0 top-0
          h-72
          z-0
          bg-[radial-gradient(circle_at_top,_rgba(212,165,68,0.12),_transparent_60%)]
        "
      />

      {/* Navbar */}
      {!shouldHideNavbar && <Navbar />}

      {/* Page content */}
      <main className="relative z-10 w-full">
        <Outlet />
      </main>

      {/* Theme toggle — mobile-safe bottom-right, clears iOS home indicator */}
      <div
        className="
          fixed
          right-4
          bottom-[calc(1rem+env(safe-area-inset-bottom))]
          z-[2147483647]
        "
      >
        <ThemeToggle />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
      />
    </div>
  );
}

export default App;