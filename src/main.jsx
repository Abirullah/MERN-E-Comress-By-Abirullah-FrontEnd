import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";

//Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import ProductDetails from "./pages/Shop/ProductDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="admin/login" element={<AdminLogin />} />

      <Route element={<PrivateRoute />}>
        <Route path="shop" element={<Shop />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UserList />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
