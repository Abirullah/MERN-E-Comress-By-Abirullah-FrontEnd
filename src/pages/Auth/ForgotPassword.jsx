import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter the email associated with your account");
      return;
    }
    

    toast.success("OTP code sent to your email");

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
      description="Enter your email address and we’ll move you into the verification flow."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-[9px] text-start uppercase tracking-[0.18em] text-[#666262]">
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08]"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#d4a544] p-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808] transition-opacity hover:opacity-90"
        >
          Send OTP Code
        </button>
      </form>

      <p className="mt-6 text-sm text-[#c3b591]">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-[#d4a544] hover:text-[#f5db8f]">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;

