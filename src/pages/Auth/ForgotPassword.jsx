import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "./AuthLayout";
import AuthButton from "../../components/AuthButton";
import AuthInputField from "../../components/AuthInputField";

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
    navigate("/otp", { state: { flow: "forgot-password", contact: email } });
  };

  return (
    <AuthLayout
      title="Recover your account"
      description="Enter your email address and we'll send you a verification code."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          label="Email address" icon="Mail" type="email"
          placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <AuthButton type="submit">Send OTP Code</AuthButton>
      </form>

      <p className="mt-5 text-[12px] text-[#6b6666]">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold text-[#d4a544] hover:text-[#f5db8f] transition-colors">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;