import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import {
    clearAuthMessages,
  fetchUserProfile,
  updateUserProfile,
  logoutUser

} from "../../ReduxSetUp/Feature/Auth/AuthSlice"

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
   Inline Styles
───────────────────────────────────────────── */
const styles = {
  /* Page shell */
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0d0d14 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e8e8f0",
    paddingBottom: "4rem",
  },
  /* Subtle grid texture overlay */
  gridOverlay: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  /* Header bar */
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
  },
  brandText: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#d4af37",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "2rem",
    padding: "0.5rem 1.25rem",
    color: "#d4af37",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  /* Avatar ring */
  avatarWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },
  avatarRing: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d4af37, #f0d060, #b8922a)",
    padding: "3px",
    marginBottom: "1rem",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#111118",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#d4af37",
    letterSpacing: "-0.02em",
  },
  userName: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#f0ece0",
    marginBottom: "0.2rem",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "#6b6b80",
    letterSpacing: "0.03em",
  },
  /* Stat cards row */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.75rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "1rem",
    padding: "1rem",
    textAlign: "center",
  },
  statValue: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#d4af37",
    fontVariantNumeric: "tabular-nums",
  },
  statLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#55556a",
    marginTop: "0.2rem",
  },
  /* Quick-nav pills */
  navPills: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    marginBottom: "2rem",
  },
  navPill: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "0.9rem",
    padding: "0.8rem 1rem",
    color: "#a0a0b8",
    fontSize: "0.85rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%",
  },
  navPillIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "0.6rem",
    background: "rgba(212,175,55,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    flexShrink: 0,
  },
  navPillArrow: {
    marginLeft: "auto",
    opacity: 0.35,
    fontSize: "0.8rem",
  },
  /* Change password link */
  changePwLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "0.9rem",
    padding: "0.8rem 1rem",
    color: "#d4af37",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    letterSpacing: "0.02em",
    transition: "all 0.2s",
  },
  /* Main card */
  card: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
    padding: "2rem",
    backdropFilter: "blur(20px)",
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#f0ece0",
    letterSpacing: "-0.02em",
    marginBottom: "0.4rem",
  },
  cardSub: {
    fontSize: "0.8rem",
    color: "#55556a",
    marginBottom: "1.8rem",
    lineHeight: 1.6,
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "1.5rem 0",
  },
  sectionTitle: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#d4af37",
    marginBottom: "1rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  grid2Full: {
    gridColumn: "1 / -1",
  },
  /* Field */
  fieldWrap: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#55556a",
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#e8e8f0",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#e8e8f0",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",
  },
  primaryBtn: {
    width: "100%",
    padding: "0.9rem",
    background: "linear-gradient(135deg, #d4af37, #f0d060)",
    border: "none",
    borderRadius: "0.9rem",
    color: "#0a0a0f",
    fontSize: "0.9rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: "1.5rem",
    transition: "opacity 0.2s",
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#f87171",
    fontSize: "0.82rem",
    marginBottom: "1.2rem",
  },
  /* Layout grid */
  layout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },

  /* ── Change-password page ── */
  pwPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0d0d14 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e8e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  pwCard: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    backdropFilter: "blur(20px)",
  },
  pwIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "1rem",
    background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))",
    border: "1px solid rgba(212,175,55,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    marginBottom: "1.2rem",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#55556a",
    fontSize: "0.82rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0",
    marginBottom: "1.5rem",
    letterSpacing: "0.03em",
  },
};

/* ─────────────────────────────────────────────
   Change‑Password Sub‑Page
───────────────────────────────────────────── */
const ChangePasswordPage = ({ onBack, onSuccess, updateLoading, dispatch, updateUserProfile }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { toast.error("Please enter a new password"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      await dispatch(updateUserProfile({ password })).unwrap();
      toast.success("Password updated successfully!");
      onSuccess();
    } catch (err) {
      toast.error(err?.message || "Failed to update password");
    }
  };

  return (
    <div style={styles.pwPage}>
      <div style={styles.gridOverlay} />
      <div style={{ ...styles.pwCard, position: "relative", zIndex: 1 }}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back to profile
        </button>
        <div style={styles.pwIcon}>🔐</div>
        <div style={{ ...styles.cardTitle, marginBottom: "0.4rem" }}>Change Password</div>
        <p style={{ ...styles.cardSub, marginBottom: "1.8rem" }}>
          Choose a strong password you haven't used before.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updateLoading}
            style={{ ...styles.primaryBtn, opacity: updateLoading ? 0.6 : 1 }}
          >
            {updateLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

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
  const [view, setView] = useState("profile"); // 'profile' | 'changePassword'
  const [inputFocus, setInputFocus] = useState(null);

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

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  /* Input focus style helper */
  const inp = (id) => ({
    ...styles.input,
    borderColor: inputFocus === id ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.08)",
  });
  const ta = (id) => ({
    ...styles.textarea,
    borderColor: inputFocus === id ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.08)",
  });

  if (view === "changePassword") {
    return (
      <ChangePasswordPage
        onBack={() => setView("profile")}
        onSuccess={() => setView("profile")}
        updateLoading={updateLoading}
        dispatch={dispatch}
        updateUserProfile={updateUserProfile}
      />
    );
  }

  if (profileLoading && !userInfo) {
    return (
      <div style={{ ...styles.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.gridOverlay} />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.brandText}>✦ My Account</span>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.15)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.08)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; }}
          >
            <span>⎋</span> Logout
          </button>
        </div>

        {/* Two-column layout */}
        <div style={styles.layout}>

          {/* ── Left Sidebar ── */}
          <aside>
            {/* Avatar */}
            <div style={{ ...styles.card, marginBottom: "1rem", textAlign: "center", padding: "1.5rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.8rem" }}>
                <div style={styles.avatarRing}>
                  {profileFields.profilePicture ? (
                    <img
                      src={profileFields.profilePicture}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div style={styles.avatarInner}>{initials || "U"}</div>
                  )}
                </div>
              </div>
              <div style={styles.userName}>{username || "Your Name"}</div>
              <div style={styles.userEmail}>{email || "your@email.com"}</div>
            </div>

            {/* Stats */}
            <div style={{ ...styles.statsRow, marginBottom: "1rem" }}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>${totalSpent.toLocaleString()}</div>
                <div style={styles.statLabel}>Spent</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{totalOrders}</div>
                <div style={styles.statLabel}>Orders</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{wishlistCount}</div>
                <div style={styles.statLabel}>Saved</div>
              </div>
            </div>

            {/* Quick Nav */}
            <div style={styles.navPills}>
              {[
                { icon: "📦", label: "My Orders", sub: "Track & manage", path: "/ordersplaced" },
                { icon: "♡", label: "Wishlist", sub: "Saved items", path: "/wishlist" },
              ].map((item) => (
                <button
                  key={item.path}
                  style={styles.navPill}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; e.currentTarget.style.background = "rgba(212,175,55,0.05)"; e.currentTarget.style.color = "#e8e8f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#a0a0b8"; }}
                >
                  <span style={styles.navPillIcon}>{item.icon}</span>
                  <span>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#d0d0e0" }}>{item.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#55556a" }}>{item.sub}</div>
                  </span>
                  <span style={styles.navPillArrow}>›</span>
                </button>
              ))}

              {/* Change Password */}
              <button
                style={styles.changePwLink}
                onClick={() => setView("changePassword")}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; }}
              >
                <span style={{ ...styles.navPillIcon, background: "rgba(212,175,55,0.15)" }}>🔑</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Change Password</span>
                <span style={styles.navPillArrow}>›</span>
              </button>
            </div>
          </aside>

          {/* ── Right: Profile Form ── */}
          <section style={styles.card}>
            <div style={styles.cardTitle}>Edit Profile</div>
            <p style={styles.cardSub}>
              Update your account information. Changes are saved to your profile.
            </p>

            {profileError && <div style={styles.errorBox}>{profileError}</div>}

            <form onSubmit={submitHandler}>
              {/* Account Info */}
              <div style={styles.sectionTitle}>Account Info</div>
              <div style={styles.grid2}>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Username</label>
                  <input type="text" style={inp("username")} value={username}
                    onFocus={() => setInputFocus("username")} onBlur={() => setInputFocus(null)}
                    onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Email</label>
                  <input type="email" style={inp("email")} value={email}
                    onFocus={() => setInputFocus("email")} onBlur={() => setInputFocus(null)}
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={styles.divider} />

              {/* Profile Details */}
              <div style={styles.sectionTitle}>Profile Details</div>
              <div style={styles.grid2}>
                {[
                  { key: "firstName", label: "First Name", type: "text" },
                  { key: "lastName", label: "Last Name", type: "text" },
                  { key: "phoneNumber", label: "Phone Number", type: "text" },
                  { key: "address", label: "Address", type: "text" },
                  { key: "accountDetails", label: "Account Details", type: "text" },
                  { key: "profilePicture", label: "Profile Picture URL", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key} style={styles.fieldWrap}>
                    <label style={styles.label}>{label}</label>
                    <input type={type} style={inp(key)} value={profileFields[key]}
                      onFocus={() => setInputFocus(key)} onBlur={() => setInputFocus(null)}
                      onChange={(e) => handleFieldChange(key, e.target.value)} />
                  </div>
                ))}

                <div style={{ ...styles.fieldWrap, ...styles.grid2Full }}>
                  <label style={styles.label}>Preferences</label>
                  <textarea style={ta("preferences")} rows={4} value={profileFields.preferences}
                    onFocus={() => setInputFocus("preferences")} onBlur={() => setInputFocus(null)}
                    onChange={(e) => handleFieldChange("preferences", e.target.value)} />
                </div>
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                style={{ ...styles.primaryBtn, opacity: updateLoading ? 0.6 : 1 }}
                onMouseEnter={(e) => { if (!updateLoading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = updateLoading ? "0.6" : "1"; }}
              >
                {updateLoading ? "Saving…" : "✦ Save Changes"}
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Responsive tweaks via a tiny injected style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 760px) {
          .profile-layout { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: repeat(3, 1fr) !important; }
          .grid2 { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { color: #3a3a52; }
        input:focus, textarea:focus { border-color: rgba(212,175,55,0.5) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default Profile;
