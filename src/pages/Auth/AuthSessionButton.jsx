import { Apple, Globe } from "lucide-react";
const buttons = [
  {
    label: "Google",
    icon: Globe, 
  },
  {
    label: "Facebook",
    icon: Globe, 
  },
  {
    label: "Apple",
    icon: Apple,
  },
];
const AuthSocialButtons = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {buttons.map((button) => {
        const Icon = button.icon;

        return (
          <button
            key={button.label}
            className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg"
          >
            <Icon className="h-5 w-5" />
            {button.label}
          </button>
        );
      })}
    </div>
  );
};

export default AuthSocialButtons;
