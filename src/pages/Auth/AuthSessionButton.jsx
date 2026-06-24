import { Apple, Globe } from "lucide-react";

const buttons = [
  { label: "Google",   icon: Globe  },
  { label: "Facebook", icon: Globe  },
  { label: "Apple",    icon: Apple  },
];

const AuthSocialButtons = () => (
  <div className="grid gap-2 grid-cols-3">
    {buttons.map(({ label, icon: Icon }) => (
      <button
        key={label}
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] px-3 py-3 text-[11px] font-semibold text-[#6b6666] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
      >
        <Icon size={15} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    ))}
  </div>
);

export default AuthSocialButtons;