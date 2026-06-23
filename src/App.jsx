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

  const { userInfo, sessionChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userInfo && !sessionChecked) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, sessionChecked, userInfo]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // Routes where navbar should hide
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
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
      <div style={{ position: "fixed", right: "1rem", bottom: "1rem", zIndex: "5000000000000000000" }}>
        <ThemeToggle />
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(212,165,68,0.18),_transparent_58%)]" />

      {/* Hide Navbar on Auth Pages */}
      {!shouldHideNavbar && <Navbar />}

      <main className="w-full">
        <Outlet />
      </main>

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
