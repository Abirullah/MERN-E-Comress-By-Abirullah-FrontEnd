import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Mail } from "lucide-react";

import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/otp", {
      state: {
        flow: "forgot-password",
        contact: email,
      },
    });
  };

  return (
    <AuthLayout
      badge="Reset password"
      title="Recover your account"
      description="Enter your email and we’ll send you an OTP code to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="field-label">Email address</label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input pl-12"
            />
          </div>
        </div>

        <button type="submit" className="primary-button w-full">
          Send OTP Code
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-slate-900 hover:text-amber-700"
        >
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;