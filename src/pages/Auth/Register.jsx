import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import {
  clearAuthMessages,
  registerUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, userInfo } = useSelector((state) => state.auth);
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
    dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath, userInfo]);

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
      toast.error(registrationError?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      badge="Create account"
      title="Build your account"
      description="Register once and keep your order history, wishlist, and checkout details in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-[9px] text-start uppercase tracking-[0.18em] text-[#666262]">
            Username
          </label>

          <div className="relative">
            <UserRound className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />

            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange("username")}
              className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08]"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[9px] text-start uppercase tracking-[0.18em] text-[#666262]">
            Email
          </label>

          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08]"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[9px] text-start uppercase tracking-[0.18em] text-[#666262]">
              Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />

              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange("password")}
                className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08]"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[9px] text-start  uppercase tracking-[0.18em] text-[#666262]">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />

              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08]"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-0 w-full rounded-lg bg-[#d4a544] p-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808] transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#c3b591]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#d4a544] hover:text-[#f5db8f]">
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

