
import { LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAuthMessages,
  loginUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import AuthButton from "../../components/AuthButton";
import AuthInputField from "../../components/AuthInputField";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, userInfo } = useSelector((state) => state.auth);

  const redirectPath = location.state?.from || "/";
  const redirectState = location.state?.checkoutState || null;

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "rememberMe" ? e.target.checked : e.target.value,
    }));
  };

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirectPath, {
        replace: true,
        state: redirectState,
      });
    }
  }, [navigate, redirectPath, redirectState, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: form.email,
          password: form.password,
        })
      ).unwrap();

      toast.success("Signed in successfully");

      navigate(redirectPath, {
        replace: true,
        state: redirectState,
      });
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Access your orders, wishlist & profile"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInputField
          label="Email Address"
          icon="Mail"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
          autoComplete="email"
        />

        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[9px] self-start uppercase tracking-[0.18em] text-[#5a5a5a]">
            Password
          </label>

          <Link to="/forgot-password" className="text-[11px] text-[#7a6030]">
            Forgot password?
          </Link>
        </div>

        <AuthInputField
          label="Password"
          icon="LockKeyhole"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange("password")}
          autoComplete="current-password"
        />

        <label className="mb-5 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={handleChange("rememberMe")}
            className="h-3 w-3 accent-[#d4a544]"
          />

          <span className="text-[11px] text-[#4a4a4a]">Keep me signed in</span>
        </label>

        <AuthButton type="submit" loading={loading} className="mb-4">
          Sign In
        </AuthButton>
      </form>

      <p className="mb-4 py-5 text-center text-[11px] text-[#5e5a5a]">
        No account? <Link to="/register" className="text-[#d4a544]">Create one</Link>
      </p>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#181818]" />
        <span className="text-[9px] uppercase tracking-[0.18em] text-[#6b6666]">Or continue with</span>
        <div className="h-px flex-1 bg-[#181818]" />
      </div>

      <AuthSocialButtons />
    </AuthLayout>
  );
};

export default Login;

