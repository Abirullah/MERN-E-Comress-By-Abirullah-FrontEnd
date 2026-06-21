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

/* ── Helpers ── */
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
  value.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");

const trimProfileFields = (fields) =>
  Object.entries(fields).reduce((acc, [k, v]) => {
    const t = v.trim();
    if (t) acc[k] = t;
    return acc;
  }, {});

/* ── Icons ── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  box:      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  heart:    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  chevron:  "M9 18l6-6-6-6",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  lock:     "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  map:      "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  x:        "M18 6L6 18M6 6l12 12",
};

/* ── Styled Input ── */
const Field = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase text-[#5a5a5a]">
        {icon && <span className="text-[#d4a544]"><Icon d={ICONS[icon]} size={11} /></span>}
        {label}
      </label>
    )}
    {children}
  </div>
);

const inputCls =
  "w-full bg-[#0c0c0c] border border-[#242424] rounded-lg px-4 py-2.5 text-[#ddd4be] text-sm outline-none transition-all placeholder:text-[#2e2e2e] focus:border-[#d4a544] focus:bg-[#0f0d08] focus:shadow-[0_0_0_3px_rgba(212,165,68,0.08)]";

/* ── Profile View Row ── */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-[#161616] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[rgba(212,165,68,0.08)] border border-[#1e1e1e] flex items-center justify-center text-[#d4a544] flex-shrink-0 mt-0.5">
      <Icon d={ICONS[icon]} size={14} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[9px] tracking-[0.2em] uppercase text-[#444] mb-1">{label}</div>
      <div className="text-sm text-[#c8bea8] font-medium truncate">{value || <span className="text-[#3a3a3a] italic text-xs">Not set</span>}</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════ */
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, profileLoading, updateLoading, profileError } = useSelector((s) => s.auth);

  const [username, setUsername]         = useState("");
  const [email, setEmail]               = useState("");
  const [profileFields, setProfileFields] = useState(emptyProfile);
  const [activeTab, setActiveTab]       = useState("info");   // "info" | "edit" | "password"
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]         = useState(false);

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
  const totalSpent   = userInfo?.totalSpent   ?? 0;
  const totalOrders  = userInfo?.totalOrders  ?? 0;
  const wishlistCount = userInfo?.wishlistCount ?? 0;

  const handleFieldChange = (field, value) =>
    setProfileFields((prev) => ({ ...prev, [field]: value }));

  const handlePhotoChange = (file) => {
    if (!file) { setProfileFields((p) => ({ ...p, profilePicture: "" })); return; }
    const reader = new FileReader();
    reader.onload = () => setProfileFields((p) => ({ ...p, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim())           { toast.error("Enter a new password"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      await dispatch(updateUserProfile({ password })).unwrap();
      toast.success("Password updated");
      setPassword(""); setConfirmPassword(""); setActiveTab("info");
    } catch (err) { toast.error(err?.message || "Failed to update password"); }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = { username: username.trim(), email: email.trim() };
    const trimmed = trimProfileFields(profileFields);
    if (Object.keys(trimmed).length) payload.Profile = trimmed;
    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      toast.success("Profile saved");
      setActiveTab("info");
    } catch (err) { toast.error(err?.message || "Update failed"); }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) { toast.error(err?.message || "Logout failed"); }
  };

  if (profileLoading && !userInfo) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080808] overflow-hidden" style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Tenor+Sans&display=swap');
        @keyframes ringPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(1.04)}}
        @keyframes particleRise{0%{opacity:0;transform:translateY(0)}15%{opacity:0.7}85%{opacity:0.1}100%{opacity:0;transform:translateY(-300px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .lx-ring{position:absolute;border-radius:9999px;border:1px solid var(--hover-bg);animation:ringPulse 4s ease-in-out infinite}
        .lx-particle{position:absolute;width:2px;height:2px;border-radius:9999px;background:var(--accent);opacity:0;animation:particleRise 6s ease-in-out infinite}
        .fade-up{animation:fadeUp 0.35s ease both}
        .stat-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px 12px;text-align:center;transition:border-color 0.2s}
        .stat-card:hover{border-color:var(--accent)}
      `}</style>
      
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="lx-particle" style={{
          left: `${8 + ((i * 6) % 85)}%`,
          bottom: `${(i * 7) % 30}%`,
          animationDelay: `${(i * 0.45).toFixed(1)}s`,
          animationDuration: `${5 + (i % 4)}s`,
        }} />
      ))}
      
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(8,8,8,0.6) 0%,rgba(8,8,8,0.45) 50%,rgba(8,8,8,0.7) 100%)" }} />

      {/* ── Page ── */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-up mt-7">

        {/* Page header */}
        <div className="my-8 flex flex-col items-center justify-center gap-2">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4a544] mb-2">Account</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 300, color: "#f0ead8", letterSpacing: "0.05em", lineHeight: 1 }}>
            My Profile
          </h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr] items-start">

          {/* ══ LEFT SIDEBAR ══ */}
          <aside className="flex flex-col gap-4">

            {/* Avatar + identity */}
            <div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div
                    className="w-[120px] h-[120px] rounded-2xl overflow-hidden p-[2.5px] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#d4a544,#f0d060,#b8922a)" }}
                  >
                    {profileFields.profilePicture ? (
                      <img src={profileFields.profilePicture} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-[#0e0e0e] flex items-center justify-center text-2xl font-bold text-[#d4a544]">
                        {initials || "U"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#f0ead8", letterSpacing: "0.03em" }}>
                    {username || "Your Name"}
                  </div>
                  <div className="text-[11px] text-[#555] mt-0.5 tracking-wide">{email}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: `$${totalSpent.toLocaleString()}`, label: "Spent" },
                { value: totalOrders,    label: "Orders" },
                { value: wishlistCount,  label: "Saved" },
              ].map(({ value, label }) => (
                <div key={label} className="stat-card">
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#d4a544", letterSpacing: "0.02em" }}>
                    {value}
                  </div>
                  <div className="text-[9px] tracking-[0.15em] uppercase text-[#444] mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/ordersplaced")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] text-[#6b6666] text-xs cursor-pointer transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544] hover:bg-[#d4a544]/5 text-left">
                <span className="w-8 h-8 rounded-lg bg-[rgba(212,165,68,0.08)] border border-[#1e1e1e] flex items-center justify-center text-[#d4a544] flex-shrink-0">
                  <Icon d={ICONS.box} size={14} />
                </span>
                <span className="flex-1">
                  <div className="text-xs font-medium text-[#bbb]">My Orders</div>
                  <div className="text-[10px] text-[#444] mt-0.5">Track & manage</div>
                </span>
                <span className="text-[#333]"><Icon d={ICONS.chevron} size={14} /></span>
              </button>
              
              <button onClick={() => navigate("/washinglist")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] text-[#6b6666] text-xs cursor-pointer transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544] hover:bg-[#d4a544]/5 text-left">
                <span className="w-8 h-8 rounded-lg bg-[rgba(212,165,68,0.08)] border border-[#1e1e1e] flex items-center justify-center text-[#d4a544] flex-shrink-0">
                  <Icon d={ICONS.heart} size={14} />
                </span>
                <span className="flex-1">
                  <div className="text-xs font-medium text-[#bbb]">Wishlist</div>
                  <div className="text-[10px] text-[#444] mt-0.5">Saved items</div>
                </span>
                <span className="text-[#333]"><Icon d={ICONS.chevron} size={14} /></span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-[#e57373] text-[11px] tracking-[0.15em] uppercase border border-[#4a2d2d] bg-[rgba(220,80,80,0.04)] cursor-pointer transition-all hover:border-[#e57373]/50 hover:bg-[rgba(220,80,80,0.08)]"
            >
              <Icon d={ICONS.logout} size={14} />
              Sign out
            </button>
          </aside>

          {/* ══ RIGHT PANEL ══ */}
          <div style={{ background: "rgba(12,12,12,0.85)", border: "1px solid #1e1e1e", borderRadius: 16, backdropFilter: "blur(8px)", overflow: "hidden" }}>
            <div className="p-6">
              {/* Error banner */}
              {profileError && (
                <div className="flex items-center gap-3 bg-[rgba(220,80,80,0.06)] border border-[#3a1515] rounded-lg px-4 py-3 text-[#e57373] text-xs mb-5">
                  <Icon d={ICONS.x} size={14} />
                  {profileError}
                </div>
              )}

              {/* ── TAB: Overview ── */}
              {activeTab === "info" && (
                <div className="fade-up">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "#e8e0cc" }}>
                        Account details
                      </div>
                      <div className="text-[10px] text-[#444] mt-1">Your personal information</div>
                    </div>
                  </div>

                  <div style={{ overflow: "hidden" }}>
                    <InfoRow icon="user"  label="Username" value={username} />
                    <InfoRow icon="mail"  label="Email address" value={email} />
                    <InfoRow icon="phone" label="Phone number" value={profileFields.phoneNumber} />
                    <InfoRow icon="map"   label="Address" value={profileFields.address} />
                    <InfoRow icon="user"  label="First name" value={profileFields.firstName} />
                    <InfoRow icon="user"  label="Last name" value={profileFields.lastName} />
                  </div>

                  {/* Quick action */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveTab("edit")} className="w-full p-3 bg-[#d4a544] border-none rounded-lg text-[#080808] text-[10px] tracking-[0.22em] uppercase font-bold cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5">
                      Update details
                    </button>
                    <button onClick={() => setActiveTab("password")} className="w-full p-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#6b6666] text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544] flex items-center justify-center gap-2">
                      <Icon d={ICONS.lock} size={12} />
                      Change password
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB: Edit Profile ── */}
              {activeTab === "edit" && (
                <form onSubmit={submitHandler} className="fade-up">
                  <div className="mb-6">
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "#e8e0cc" }}>
                      Edit profile
                    </div>
                    <div className="text-[10px] text-[#444] mt-1">Changes are saved immediately</div>
                  </div>

                  {/* Account section */}
                  <div className="mb-5">
                    <div className="text-[9px] tracking-[0.25em] uppercase text-[#d4a544] mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                      Account
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Username" icon="user">
                        <input type="text" className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                      </Field>
                      <Field label="Email" icon="mail">
                        <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                      </Field>
                    </div>
                  </div>

                  {/* Personal section */}
                  <div className="mb-5">
                    <div className="text-[9px] tracking-[0.25em] uppercase text-[#d4a544] mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                      Personal
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: "firstName",     label: "First name",      icon: "user"  },
                        { key: "lastName",      label: "Last name",       icon: "user"  },
                        { key: "phoneNumber",   label: "Phone number",    icon: "phone" },
                        { key: "address",       label: "Address",         icon: "map"   },
                      ].map(({ key, label, icon }) => (
                        <Field key={key} label={label} icon={icon}>
                          <input
                            type="text"
                            className={inputCls}
                            value={profileFields[key]}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            placeholder={label}
                          />
                        </Field>
                      ))}
                    </div>
                  </div>

                  {/* Photo section */}
                  <div className="mb-6">
                    <div className="text-[9px] tracking-[0.25em] uppercase text-[#d4a544] mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                      Profile photo
                      <div className="h-px flex-1 bg-[#d4a544] opacity-20" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold text-[#d4a544]"
                        style={{ border: "2px solid #242424", background: "#0e0e0e" }}
                      >
                        {profileFields.profilePicture
                          ? <img src={profileFields.profilePicture} alt="preview" className="w-full h-full rounded-full object-cover" />
                          : initials || "U"
                        }
                      </div>
                      <label className="cursor-pointer flex-1">
                        <div className="border border-dashed border-[#2a2a2a] rounded-lg px-4 py-3 text-center hover:border-[#d4a544] transition-colors">
                          <div className="text-[#555] text-xs">Click to upload photo</div>
                          <div className="text-[#333] text-[10px] mt-0.5">JPG, PNG up to 5MB</div>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e.target.files?.[0])} />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={updateLoading} className="w-full p-3 bg-[#d4a544] border-none rounded-lg text-[#080808] text-[10px] tracking-[0.22em] uppercase font-bold cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" style={{ flex: 2 }}>
                      {updateLoading ? "Saving…" : "Save changes"}
                    </button>
                    <button type="button" onClick={() => setActiveTab("info")} className="p-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#6b6666] text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544]" style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* ── TAB: Password ── */}
              {activeTab === "password" && (
                <div className="fade-up max-w-md">
                  <div className="mb-6">
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "#e8e0cc" }}>
                      Update password
                    </div>
                    <div className="text-[10px] text-[#444] mt-1">Choose a strong, unique password</div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Field label="New password" icon="lock">
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          className={inputCls + " pr-10"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
                        >
                          <Icon d={ICONS.eye} size={14} />
                        </button>
                      </div>
                    </Field>

                    <Field label="Confirm password" icon="lock">
                      <input
                        type={showPass ? "text" : "password"}
                        className={inputCls}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </Field>

                    {/* Strength hint */}
                    {password && (
                      <div className="flex gap-1.5">
                        {[1,2,3,4].map((n) => (
                          <div
                            key={n}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{ background: password.length >= n * 3 ? "#d4a544" : "#1e1e1e" }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button onClick={handlePasswordSubmit} disabled={updateLoading} className="w-full p-3 bg-[#d4a544] border-none rounded-lg text-[#080808] text-[10px] tracking-[0.22em] uppercase font-bold cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" style={{ flex: 2 }}>
                        {updateLoading ? "Saving…" : "Update password"}
                      </button>
                      <button onClick={() => setActiveTab("info")} className="p-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#6b6666] text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-all hover:border-[#d4a544]/50 hover:text-[#d4a544]" style={{ flex: 1 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;