import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import {
  clearAuthMessages,
  fetchUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const emptyProfile = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  accountDetails: "",
  profilePicture: "",
  preferences: "",
};

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

const trimProfileFields = (fields) =>
  Object.entries(fields).reduce((acc, [k, v]) => {
    const t = v.trim();
    if (t) acc[k] = t;
    return acc;
  }, {});

/* ─────────────────────────────────────────────
   Main Profile Component
───────────────────────────────────────────── */
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, profileLoading, updateLoading, profileError } = useSelector((s) => s.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileFields, setProfileFields] = useState(emptyProfile);
  const [showDetails, setShowDetails] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
    return () => dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) return;
    setUsername(userInfo.username || "");
    setEmail(userInfo.email || "");
    setProfileFields({ ...emptyProfile, ...(userInfo.Profile || {}) });
  }, [userInfo]);

  const initials = useMemo(() => getInitials(username || email || "User"), [username, email]);
  const totalSpent = userInfo?.totalSpent ?? 0;
  const totalOrders = userInfo?.totalOrders ?? 0;
  const wishlistCount = userInfo?.wishlistCount ?? 0;

  const handleFieldChange = (field, value) =>
    setProfileFields((prev) => ({ ...prev, [field]: value }));

  const handlePhotoChange = (file) => {
    if (!file) {
      setProfileFields((prev) => ({ ...prev, profilePicture: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileFields((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(updateUserProfile({ password })).unwrap();
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update password");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = { username: username.trim(), email: email.trim() };
    const trimmed = trimProfileFields(profileFields);
    if (Object.keys(trimmed).length > 0) payload.Profile = trimmed;
    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Profile update failed");
    }
  };

  // const handleLogout = () => {
  //   dispatch(logoutUser());
  //   navigate("/login");
  // };

  if (profileLoading && !userInfo) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const inputCls =
    "bg-white border border-[rgba(15,23,42,0.12)] rounded-xl px-4 py-3 text-[#0f172a] text-sm outline-none transition-colors w-full focus:border-[rgba(212,175,55,0.5)] placeholder:text-[#94a3b8] box-border";

  const textareaCls =
    "bg-white border border-[rgba(15,23,42,0.12)] rounded-xl px-4 py-3 text-[#0f172a] text-sm outline-none transition-colors w-full focus:border-[rgba(212,175,55,0.5)] placeholder:text-[#94a3b8] resize-y min-h-[100px] box-border";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-16 relative">
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800&display=swap'); * { font-family: 'DM Sans', 'Segoe UI', sans-serif; }`}</style>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-8 mt-20">

        {/* Two-column layout */}


          {/* ── Left Sidebar ── */}
          <aside>
            {/* Avatar card */}
            <div className="bg-white border border-[rgba(15,23,42,0.08)] rounded-3xl p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] mb-4 text-center">
              <div className="flex justify-center mb-3">
                <div
                  className="w-[88px] h-[88px] rounded-full p-[3px]"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060, #b8922a)" }}
                >
                  {profileFields.profilePicture ? (
                    <img
                      src={profileFields.profilePicture}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#111118] flex items-center justify-center text-[1.6rem] font-extrabold text-[#d4af37] tracking-tight">
                      {initials || "U"}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xl font-bold text-[#0f172a] mb-0.5">
                {username || "Your Name"}
              </div>
              <div className="text-xs text-[#6b6b80] tracking-wide">
                {email || "your@email.com"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { value: `$${totalSpent.toLocaleString()}`, label: "Spent" },
                { value: totalOrders, label: "Orders" },
                { value: wishlistCount, label: "Saved" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 text-center"
                >
                  <div className="text-lg font-extrabold text-[#d4af37] tabular-nums">{value}</div>
                  <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#55556a] mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Nav */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: "📦", label: "My Orders", sub: "Track & manage", path: "/ordersplaced" },
                { icon: "♡", label: "Wishlist", sub: "Saved items", path: "/wishlist" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 bg-[rgba(15,23,42,0.03)] border border-[rgba(15,23,42,0.08)] rounded-[0.9rem] px-4 py-3 text-[#334155] text-sm font-medium cursor-pointer transition-all text-left w-full hover:border-[rgba(15,23,42,0.2)] hover:bg-[rgba(15,23,42,0.08)] hover:text-[#0f172a]"
                >
                  <span className="w-8 h-8 rounded-xl bg-[rgba(15,23,42,0.08)] flex items-center justify-center text-base flex-shrink-0">
                    {item.icon}
                  </span>
                  <span>
                    <div className="font-semibold text-sm text-[#d0d0e0]">{item.label}</div>
                    <div className="text-[0.72rem] text-[#55556a]">{item.sub}</div>
                  </span>
                  <span className="ml-auto opacity-35 text-sm">›</span>
                </button>
              ))}

              {/* Change Password */}
              <button
                onClick={() => {
                  setShowDetails(true);
                  setShowPasswordFields(true);
                }}
                className="flex items-center gap-3 bg-[rgba(15,23,42,0.05)] border border-[rgba(15,23,42,0.1)] rounded-[0.9rem] px-4 py-3 text-[#0f172a] text-sm font-semibold cursor-pointer w-full text-left transition-all hover:bg-[rgba(15,23,42,0.1)] tracking-wide"
              >
                <span className="w-8 h-8 rounded-xl bg-[rgba(15,23,42,0.1)] flex items-center justify-center text-base flex-shrink-0">
                  🔑
                </span>
                <span className="font-semibold text-sm text-[#0f172a]">Change Password</span>
                <span className="ml-auto opacity-35 text-sm">›</span>
              </button>
            </div>
          </aside>

          {/* ── Right: Profile Info ── */}
          <section className="bg-white border border-[rgba(15,23,42,0.08)] rounded-3xl p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-1">Your account overview</div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  View your current profile details and click Update Info to edit everything in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="rounded-full border border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.05)] px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[rgba(15,23,42,0.1)]"
              >
                {showDetails ? "Hide update form" : "Update info"}
              </button>
            </div>

            {profileError && (
              <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-[0.82rem] mb-5">
                {profileError}
              </div>
            )}

            {!showDetails ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-3xl border border-[rgba(15,23,42,0.08)] p-6 bg-[rgba(248,250,252,0.95)]">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-[0.85rem] uppercase tracking-[0.18em] text-[#334155] mb-2">Username</div>
                      <div className="text-base font-semibold text-[#0f172a]">{username || "Your Name"}</div>
                    </div>
                    <div>
                      <div className="text-[0.85rem] uppercase tracking-[0.18em] text-[#334155] mb-2">Email</div>
                      <div className="text-base font-semibold text-[#0f172a]">{email || "your@email.com"}</div>
                    </div>
                    <div>
                      <div className="text-[0.85rem] uppercase tracking-[0.18em] text-[#334155] mb-2">Phone</div>
                      <div className="text-base font-semibold text-[#0f172a]">{profileFields.phoneNumber || "Not set"}</div>
                    </div>
                    <div>
                      <div className="text-[0.85rem] uppercase tracking-[0.18em] text-[#334155] mb-2">Address</div>
                      <div className="text-base font-semibold text-[#0f172a]">{profileFields.address || "Not set"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[rgba(15,23,42,0.08)] p-6 bg-[rgba(248,250,252,0.95)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-[0.85rem] uppercase tracking-[0.18em] text-[#334155] mb-2">Preferences</div>
                      <div className="text-base font-semibold text-[#0f172a]">{profileFields.preferences || "Not added yet"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDetails(true);
                        setShowPasswordFields(false);
                      }}
                      className="rounded-full border border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.05)] px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:bg-[rgba(15,23,42,0.1)]"
                    >
                      Update details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">Username</label>
                    <input type="text" className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">Email</label>
                    <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "firstName", label: "First Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "phoneNumber", label: "Phone Number" },
                    { key: "address", label: "Address" },
                    { key: "accountDetails", label: "Account Details" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">{label}</label>
                      <input type="text" className={inputCls} value={profileFields[key]} onChange={(e) => handleFieldChange(key, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition-colors file:mr-4 file:border-0 file:bg-[#f8fafc] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0f172a] file:cursor-pointer"
                      onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                    />
                    {profileFields.profilePicture && (
                      <div className="mt-3 w-28 h-28 overflow-hidden rounded-3xl border border-[rgba(15,23,42,0.12)]">
                        <img src={profileFields.profilePicture} alt="Profile preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">Preferences</label>
                  <textarea rows={4} className={textareaCls} value={profileFields.preferences} onChange={(e) => handleFieldChange("preferences", e.target.value)} />
                </div>

                <div className="rounded-3xl border border-[rgba(15,23,42,0.08)] bg-[rgba(248,250,252,0.95)] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#0f172a]">Password</div>
                      <div className="text-sm text-[#475569]">Update your password as part of this flow.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields((prev) => !prev)}
                      className="rounded-full border border-[rgba(15,23,42,0.1)] bg-[rgba(15,23,42,0.05)] px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:bg-[rgba(15,23,42,0.1)]"
                    >
                      {showPasswordFields ? "Hide password" : "Update password"}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="mt-5 grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">New Password</label>
                          <input
                            type="password"
                            className={inputCls}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.7rem] font-semibold tracking-widest uppercase text-[#55556a]">Confirm Password</label>
                          <input
                            type="password"
                            className={inputCls}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handlePasswordSubmit}
                        className="w-full max-w-[220px] rounded-full bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Save password
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`w-full py-3.5 bg-[#0f172a] border-none rounded-xl text-white text-sm font-extrabold tracking-widest uppercase cursor-pointer transition-opacity ${
                    updateLoading ? "opacity-60 cursor-not-allowed" : "hover:opacity-85"
                  }`}
                >
                  {updateLoading ? "Saving…" : "✦ Save Changes"}
                </button>
              </form>
            )}
          </section>
      
      </div>
    </div>
  );
};

export default Profile;