import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import { UserRound, Mail, LockKeyhole } from "lucide-react";
import {
  clearAuthMessages,
  registerUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector(
    (state) => state.auth
  );
  const redirectPath = location.state?.from || "/";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
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

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        registerUser({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      ).unwrap();

      toast.success("Account created successfully");
      navigate(redirectPath, { replace: true });
    } catch (registrationError) {
      toast.error(
        registrationError?.message || "Registration failed"
      );
    }
  };

  return (
    <AuthLayout
      badge="Create account"
      title="Sign Up"
    >


      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <div>
          <label className="field-label">Username</label>

          <div className="relative">
            <UserRound className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange("username")}
              className="field-input pl-12"
            />
          </div>
        </div>

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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Password</label>

            <div className="relative">
              <LockKeyhole className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange("password")}
                className="field-input pl-12"
              />
            </div>
          </div>

          <div>
            <label className="field-label">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className="field-input pl-12"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-semibold text-slate-900 hover:text-amber-700"
        >
          Sign in
        </Link>
      </p>

            

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Or register with email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <AuthSocialButtons />

    </AuthLayout>
  );
};

export default Register;
