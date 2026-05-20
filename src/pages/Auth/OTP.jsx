import { useNavigate , useLocation } from "react-router-dom";

import AuthLayout from "./AuthLayout";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const contact = location.state?.contact || "you@example.com";

  const handleContinue = () => {
    navigate("/shop");
  };

  return (
    <AuthLayout
      badge="Verification"
      title="Enter your OTP code"
      description={`We sent a verification code to ${contact}`}
    >
      <div className="space-y-6">
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4].map((item) => (
            <input
              key={item}
              maxLength={1}
              className="h-16 w-16 rounded-2xl border border-slate-200 bg-white text-center text-2xl font-semibold outline-none transition-all focus:border-black"
            />
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="primary-button w-full"
        >
          Verify & Continue
        </button>

        <button className="w-full rounded-2xl border border-slate-200 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          Resend code
        </button>
      </div>
    </AuthLayout>
  );
};

export default OTP;
