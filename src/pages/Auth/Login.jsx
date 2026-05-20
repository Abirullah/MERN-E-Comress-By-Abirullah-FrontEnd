import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";

const Login = () => {
  const navigate = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/otp", {
      state: {
        flow: "login",
        contact: form.email,
      },
    });
  };

  return (
    <AuthLayout
      badge="Welcome back"
      title="Sign in to continue shopping"
      description="Clean luxury auth UI with modern glassmorphism styling and premium interaction states."
    >
  

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="field-label">Email</label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
            <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange("password")}
              className="field-input pl-12"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={handleChange("rememberMe")}
            className="h-4 w-4 rounded border-slate-300"
          />

          Keep me signed in
        </label>

        <button type="submit" className="primary-button w-full">
          Continue to OTP
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

          <AuthSocialButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </AuthLayout>
  );
};

export default Login;



