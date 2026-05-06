import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return userInfo.isAdmin ? (
    <Navigate to="/admin/users" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
