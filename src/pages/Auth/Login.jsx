import { LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import {
  clearAuthMessages,
  loginUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector(
    (state) => state.auth
  );
  const redirectPath = location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const handleChange = (field) => (event) => {
    const value =
      field === "rememberMe"
        ? event.target.checked
        : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath, userInfo]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        loginUser({
          email: form.email,
          password: form.password,
        })
      ).unwrap();

      toast.success("Signed in successfully");
      navigate(redirectPath, { replace: true });
    } catch (authError) {
      toast.error(authError?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      badge="Welcome back"
      title="Sign in"
    >
  

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <div>
          <label className="field-label">Email</label>

          <div className="relative">
            <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              className="field-input pl-12"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange("password")}
              className="field-input pl-12"
            />
          </div>
        </div>

        <label className="flex items-center gap-3  px-4 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={handleChange("rememberMe")}
            className="h-4 w-4 rounded border-slate-300"
          />

          Keep me signed in
        </label>

        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Don’t have an account?{" "}

        <Link
          to="/register"
          className="font-semibold text-slate-900 hover:text-amber-700"
        >
          Create account
        </Link>
      </p>
       <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

          <AuthSocialButtons />

     
    </AuthLayout>
  );
};

export default Login;

