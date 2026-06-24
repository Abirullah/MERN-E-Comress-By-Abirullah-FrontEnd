import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "./AuthLayout";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contact  = location.state?.contact || "you@example.com";

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleContinue = () => {
    if (code.join("").length < 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }
    toast.success("Verification step completed");
    navigate("/");
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next  = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
    if (digit && index === 3 && next.join("").length === 4) {
      setTimeout(() => { toast.success("Verification step completed"); navigate("/"); }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const newCode = ["", "", "", ""];
    pasted.split("").forEach((d, i) => { if (i < 4) newCode[i] = d; });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length - 1, 3)]?.focus();
    if (pasted.length === 4) {
      setTimeout(() => { toast.success("Verification step completed"); navigate("/"); }, 100);
    }
  };

  return (
    <AuthLayout
      title="Enter your OTP"
      description={`We sent a 4-digit code to ${contact}`}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-5">

        {/* OTP inputs — responsive sizing */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {code.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] text-center text-xl sm:text-2xl font-semibold text-[#ddd4be] outline-none transition-all duration-200 focus:border-[#d4a544] focus:bg-[#100e08]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#d4a544] p-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808] transition-opacity hover:opacity-90"
        >
          Verify & Continue
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] py-3.5 text-[12px] font-semibold text-[#6b6666] transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544]"
        >
          <RotateCcw size={14} />
          Resend code
        </button>
      </form>
    </AuthLayout>
  );
};

export default OTP;