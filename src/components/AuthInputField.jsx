import { Mail, LockKeyhole, UserRound } from "lucide-react";

const ICONS = {
  Mail,
  LockKeyhole,
  UserRound,
};

const AuthInputField = ({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  className = "",
  ...rest
}) => {
  const Icon = icon ? ICONS[icon] : null;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[9px] uppercase tracking-[0.18em] text-[#666262]">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#706d6d]" />
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-[10px] pl-[13px] pr-[38px] text-[18px] text-[#ddd4be] outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-[#333] focus-visible:outline-none focus-visible:ring-0 focus:border-[#d4a544] focus:bg-[#100e08] ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
};

export default AuthInputField;
