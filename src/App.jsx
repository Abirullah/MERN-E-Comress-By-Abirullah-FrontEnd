import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/NavBar";

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#ffffff_55%,#edf4ff_100%)] text-slate-900">
      
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_58%)]" />

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
