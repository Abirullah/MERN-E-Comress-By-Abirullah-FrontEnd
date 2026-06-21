import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "site-theme";

const getPreferredTheme = () => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove(theme === "dark" ? "light" : "dark");
  root.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getPreferredTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event?.detail?.theme ?? getPreferredTheme();
      setTheme(nextTheme);
    };

    const handleStorage = () => {
      setTheme(getPreferredTheme());
    };

    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border px-2 transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
        isDark
          ? "border-slate-700 bg-slate-950 text-slate-100"
          : "border-slate-300 bg-white text-slate-900 shadow-sm"
      }`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
