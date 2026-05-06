import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useLoginAdminMutation } from "../../redux/api/adminApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { normalizeAdminSession } from "../../utils/session";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  useEffect(() => {
    if (userInfo?.isAdmin) {
      navigate("/admin/users");
    } else if (userInfo) {
      navigate("/shop");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginAdmin({ email, password }).unwrap();
      dispatch(setCredentials(normalizeAdminSession(response)));
      toast.success("Admin session is ready");
      navigate("/admin/users");
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Admin login failed");
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="app-card p-8 sm:p-10">
        <span className="muted-chip">Admin access</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to the admin workflow
        </h1>
        <p className="mt-4 section-copy">
          This preview flow uses local storage for admin access so you can build
          out the management UI before wiring the real backend.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Leave the fields as-is or use any admin email you want during UI
          development.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="field-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="field-input"
              placeholder="admin@store.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="field-label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="field-input"
              placeholder="Enter your admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit" className="primary-button w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in as admin"}
          </button>
          {isLoading && <Loader />}
        </form>
      </div>

      <div className="app-card overflow-hidden bg-slate-900 text-white">
        <div className="h-full p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            What this area does
          </p>
          <div className="mt-8 space-y-5">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">User directory</p>
              <p className="mt-2 text-sm text-slate-200">
                Loads seeded preview users and keeps changes in local storage.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">Activation actions</p>
              <p className="mt-2 text-sm text-slate-200">
                Activate and deactivate buttons update local mock data
                immediately.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">Separate from shoppers</p>
              <p className="mt-2 text-sm text-slate-200">
                Admin and shopper preview flows stay separate so you can design
                them independently.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-300">
            Need the shopper side instead?{" "}
            <Link to="/login" className="font-semibold text-amber-300 hover:text-amber-200">
              Use the user login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
