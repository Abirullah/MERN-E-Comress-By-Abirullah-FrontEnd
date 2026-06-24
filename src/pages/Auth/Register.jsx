import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAuthMessages,
  registerUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";
import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import AuthButton from "../../components/AuthButton";
import AuthInputField from "../../components/AuthInputField";

const Register = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { loading, userInfo } = useSelector((s) => s.auth);
  const redirectPath = location.state?.from || "/";

  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: "",
  });
  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  useEffect(() => { dispatch(clearAuthMessages()); }, [dispatch]);
  useEffect(() => {
    if (userInfo) navigate(redirectPath, { replace: true });
  }, [navigate, redirectPath, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await dispatch(registerUser({
        username: form.username,
        email:    form.email,
        password: form.password,
      })).unwrap();
      toast.success("Account created successfully");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      description="Register once and keep your order history, wishlist, and checkout details in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputField
          label="Username" icon="UserRound" type="text"
          placeholder="Choose a username"
          value={form.username} onChange={handleChange("username")}
          autoComplete="username"
        />

        <AuthInputField
          label="Email" icon="Mail" type="email"
          placeholder="you@example.com"
          value={form.email} onChange={handleChange("email")}
          autoComplete="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInputField
            label="Password" icon="LockKeyhole" type="password"
            placeholder="Create password"
            value={form.password} onChange={handleChange("password")}
            autoComplete="new-password"
          />
          <AuthInputField
            label="Confirm Password" icon="LockKeyhole" type="password"
            placeholder="Repeat password"
            value={form.confirmPassword} onChange={handleChange("confirmPassword")}
            autoComplete="new-password"
          />
        </div>

        <AuthButton type="submit" loading={loading}>Create account</AuthButton>
      </form>

      <p className="mt-5 text-[12px] text-[#6b6666]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#d4a544] hover:text-[#f5db8f] transition-colors">
          Sign in
        </Link>
      </p>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1e1e1e]" />
        <span className="text-[9px] uppercase tracking-[0.18em] text-[#4a4a4a]">
          Or register with
        </span>
        <div className="h-px flex-1 bg-[#1e1e1e]" />
      </div>

      <AuthSocialButtons />
    </AuthLayout>
  );
};

export default Register;