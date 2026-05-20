import { useNavigate , Link} from "react-router";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import { UserRound, Mail, LockKeyhole } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
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

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/otp", {
      state: {
        flow: "register",
        contact: form.email,
      },
    });
  };

  return (
    <AuthLayout
      badge="Create account"
      title="Build your premium shopping profile"
      description="Modern register flow UI with smooth spacing and luxury visuals."
    >
      <AuthSocialButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Or register with email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="field-label">Full Name</label>

          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              className="field-input pl-12"
            />
          </div>
        </div>

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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Password</label>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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

        <button type="submit" className="primary-button w-full">
          Create account
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
    </AuthLayout>
  );
};

export default Register;