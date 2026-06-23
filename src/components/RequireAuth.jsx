import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const RequireAuth = () => {
  const location = useLocation();
  const { userInfo, sessionChecked } = useSelector((state) => state.auth);

  if (userInfo && !sessionChecked) {
    return <Loader fullScreen />;
  }

  if (!userInfo) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, checkoutState: location.state }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
