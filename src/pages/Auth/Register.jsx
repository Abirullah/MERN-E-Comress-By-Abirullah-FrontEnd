import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import AuthLayout from "./AuthLayout";
import AuthSocialButtons from "./AuthSessionButton";
import {
  clearAuthMessages,
  registerUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";
import AuthButton from "../../components/AuthButton";
import AuthInputField from "../../components/AuthInputField";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, userInfo } = useSelector((state) => state.auth);
  const redirectPath = location.state?.from || "/";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath, userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        registerUser({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      ).unwrap();

      toast.success("Account created successfully");
      navigate(redirectPath, { replace: true });
    } catch (registrationError) {
      toast.error(registrationError?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      badge="Create account"
      title="Build your account"
      description="Register once and keep your order history, wishlist, and checkout details in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInputField
          label="Username"
          icon="UserRound"
          type="text"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange("username")}
          autoComplete="username"
        />

        <AuthInputField
          label="Email"
          icon="Mail"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
          autoComplete="email"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthInputField
            label="Password"
            icon="LockKeyhole"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
          />

          <AuthInputField
            label="Confirm Password"
            icon="LockKeyhole"
            type="password"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            autoComplete="new-password"
          />
        </div>

        <AuthButton type="submit" loading={loading}>
          Create account
        </AuthButton>
      </form>

      <p className="mt-6 text-sm text-[#c3b591]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#d4a544] hover:text-[#f5db8f]">
          Sign in
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Or register with email
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <AuthSocialButtons />
    </AuthLayout>
  );
};

export default Register;

