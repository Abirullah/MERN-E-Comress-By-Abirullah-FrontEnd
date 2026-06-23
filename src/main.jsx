import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import WishlistPage from "./pages/User/WashingList.jsx";
import { Provider } from "react-redux";
import { store } from "./ReduxSetUp/Store.js";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import Otp from "./pages/Auth/OTP.jsx";
import Profile from "./pages/User/Profile.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import LacosteProductPage from "./pages/Shop/ProductDetails.jsx";
import OrdersPlaced from "./pages/User/OrdersPlaced.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import CheckoutCancel from "./pages/CheckoutCancel.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import {
  AboutPage,
  AccessibilityPage,
  CareersPage,
  ContactPage,
  CookiesPage,
  FaqPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  TermsPage,
} from "./pages/SitePages.jsx";
import NotificationsPage from "./pages/User/Notifications.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="otp" element={<Otp />} />
      <Route path="success" element={<CheckoutSuccess />} />
      <Route path="cancel" element={<CheckoutCancel />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="shipping" element={<ShippingPage />} />
      <Route path="returns" element={<ReturnsPage />} />
      <Route path="privacy-policy" element={<PrivacyPage />} />
      <Route path="terms" element={<TermsPage />} />
      <Route path="accessibility" element={<AccessibilityPage />} />
      <Route path="cookies" element={<CookiesPage />} />
      <Route path="faq" element={<FaqPage />} />
      <Route path="careers" element={<CareersPage />} />

      
      <Route path="shop" element={<Shop />} />
      <Route
          path="products/:id"
          element={<LacosteProductPage />}
        />

      <Route element={<RequireAuth />}>
        <Route path="checkout/:id" element={<CheckoutPage />} />
        <Route
          path="washinglist"
          element={<WishlistPage />}
        />
        <Route path="wishlist" element={<WishlistPage />} />
        
        <Route path="profile" element={<Profile />} />
        <Route
          path="ordersplaced"
          element={<OrdersPlaced />}
        />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
