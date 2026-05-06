import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { normalizeUserSession } from "../../utils/session";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/shop";

  useEffect(() => {
    if (userInfo?.isAdmin) {
      navigate("/admin/users");
    } else if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials(normalizeUserSession(res)));
      toast.success("Signed in successfully");
      navigate(redirect);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Sign in request failed"
      );
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="app-card p-8 sm:p-10">
        <span className="muted-chip">User session</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to browse products
        </h1>
        <p className="mt-4 section-copy">
          This preview flow uses local storage instead of the backend, so you
          can keep shaping the storefront without waiting on API integration.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Any email can open an existing preview user or create a new one.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="field-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={isLoading} type="submit" className="primary-button w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          {isLoading && <Loader />}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="font-semibold text-amber-700 hover:text-amber-800"
          >
            Create your account
          </Link>
        </p>
      </div>

      <div className="app-card overflow-hidden bg-slate-900 text-white">
        <div className="h-full p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            Included after login
          </p>
          <div className="mt-8 space-y-5">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">Mock catalog</p>
              <p className="mt-2 text-sm text-slate-200">
                Product cards and details are loaded from seeded local preview
                data.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">Wishlist toggles</p>
              <p className="mt-2 text-sm text-slate-200">
                Wishlist changes are saved locally so you can test interactions
                quickly.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">Review submission</p>
              <p className="mt-2 text-sm text-slate-200">
                Review forms write back to the local mock store for UI
                iteration.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-300">
            Need the admin flow instead?{" "}
            <Link
              to="/admin/login"
              className="font-semibold text-amber-300 hover:text-amber-200"
            >
              Open admin login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
