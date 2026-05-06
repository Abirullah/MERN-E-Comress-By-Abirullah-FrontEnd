import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../../redux/api/usersApiSlice";
import { useLogoutAdminMutation } from "../../redux/api/adminApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const [logoutAdmin] = useLogoutAdminMutation();

  const logoutHandler = async () => {
    try {
      if (userInfo?.isAdmin) {
        await logoutAdmin().unwrap();
      } else {
        await logoutUser().unwrap();
      }
    } catch {
      // The current backend logout handlers are inconsistent, so we always
      // clear the local client session even if the server request fails.
    } finally {
      dispatch(logout());
      navigate(userInfo?.isAdmin ? "/admin/login" : "/login");
    }
  };

  const linkClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-extrabold uppercase tracking-[0.22em] text-white">
              MS
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                MERN Store
              </p>
              <p className="text-base font-bold text-slate-900">
                Local preview frontend
              </p>
            </div>
          </Link>

          {userInfo ? (
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white lg:hidden">
              {userInfo.username}
            </div>
          ) : null}
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={linkClassName}>
            Overview
          </NavLink>

          {!userInfo && (
            <>
              <NavLink to="/login" className={linkClassName}>
                User sign in
              </NavLink>
              <NavLink to="/register" className={linkClassName}>
                Register
              </NavLink>
              <NavLink to="/admin/login" className={linkClassName}>
                Admin
              </NavLink>
            </>
          )}

          {userInfo && !userInfo.isAdmin && (
            <>
              <NavLink to="/shop" className={linkClassName}>
                Shop
              </NavLink>
              <NavLink to="/profile" className={linkClassName}>
                Profile
              </NavLink>
            </>
          )}

          {userInfo?.isAdmin && (
            <NavLink to="/admin/users" className={linkClassName}>
              Manage users
            </NavLink>
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {userInfo ? (
            <>
              <div className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white lg:block">
                {userInfo.username}
                {userInfo.isAdmin ? " · admin" : ""}
              </div>
              <button
                type="button"
                onClick={logoutHandler}
                className="secondary-button"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="primary-button">
              Start here
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
