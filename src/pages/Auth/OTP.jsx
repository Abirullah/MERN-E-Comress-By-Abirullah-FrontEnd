import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "./AuthLayout";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const contact = location.state?.contact || "you@example.com";

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleContinue = () => {
    const filledCode = code.join("");

    if (filledCode.length < 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }

    toast.success("Verification step completed");
    navigate("/");
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);

    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }


    const otp = next.join("");

    if (
      digit &&
      index === code.length - 1 &&
      otp.length === 4
    ) {
      setTimeout(() => {
        toast.success("Verification step completed");
        navigate("/");
      }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pastedData) return;

    const newCode = ["", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      if (index < 4) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    const lastFilledIndex = Math.min(
      pastedData.length - 1,
      3
    );

    inputRefs.current[lastFilledIndex]?.focus();

    if (pastedData.length === 4) {
      setTimeout(() => {
        toast.success("Verification step completed");
        navigate("/");
      }, 100);
    }
  };

  return (
    <AuthLayout
      badge="Verification"
      title="Enter your OTP code"
      description={`We sent a verification code to ${contact}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
        className="space-y-6"
      >
        <div className="flex justify-center gap-3">
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={value}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e) =>
                handleKeyDown(index, e)
              }
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="h-16 w-16 rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] text-center text-2xl font-semibold text-[#ddd4be] outline-none transition-all focus:border-[#d4a544] focus:bg-[#100e08] focus:ring-0"
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] py-4 text-sm font-semibold text-[#ddd4be] transition hover:border-[#d4a544] hover:text-[#f7e3a5]"
        >
          <RotateCcw className="h-4 w-4" />
          Resend code
        </button>
      </form>
    </AuthLayout>
  );
};

export default OTP;

