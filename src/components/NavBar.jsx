import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Heart, Bell, Package, ChevronDown,
  X, Menu, LogOut, Settings, UserCircle, Sparkles,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../ReduxSetUp/Feature/Auth/AuthSlice";

/* ── nav data ── */
const navItems = [
  {
    title: "Sale",
    to: "/shop?sale=true",
    dropdown: [
      { label: "Women Shoes", params: { sale: "true", gender: "women" } },
      { label: "Men Shoes",   params: { sale: "true", gender: "men"   } },
      { label: "Kids Shoes",  params: { sale: "true", gender: "kids"  } },
    ],
  },
  {
    title: "Men",
    to: "/shop?gender=men",
    dropdown: [
      { label: "Football Shoes",       params: { gender: "men", category: "football shoes"       } },
      { label: "Street Wear",          params: { gender: "men", category: "street wear"           } },
      { label: "Formal Leather Shoes", params: { gender: "men", category: "formal leather shoes" } },
      { label: "Jordan",               params: { gender: "men", category: "jordan"               } },
      { label: "Sneakers",             params: { gender: "men", category: "sneakers"             } },
      { label: "Running",              params: { gender: "men", category: "running"              } },
    ],
  },
  {
    title: "Women",
    to: "/shop?gender=women",
    dropdown: [
      { label: "Heels",         params: { gender: "women", category: "heels"        } },
      { label: "Sneakers",      params: { gender: "women", category: "sneakers"     } },
      { label: "Sports Wear",   params: { gender: "women", category: "sports wear"  } },
      { label: "Leather Shoes", params: { gender: "women", category: "leather shoes"} },
      { label: "Street Wear",   params: { gender: "women", category: "street wear"  } },
    ],
  },
  {
    title: "New Arrival",
    to: "/shop?sort=newest",
    dropdown: [
      { label: "Men",   params: { sort: "newest", gender: "men"   } },
      { label: "Women", params: { sort: "newest", gender: "women" } },
      { label: "Kids",  params: { sort: "newest", gender: "kids"  } },
    ],
  },
  {
    title: "Premium",
    to: "/shop?category=premium",
    dropdown: [
      { label: "Luxury Collection", params: { category: "luxury collection" } },
      { label: "Limited Edition",   params: { category: "limited edition"   } },
      { label: "Exclusive",         params: { category: "exclusive"         } },
    ],
  },
];

const buildSearchLink = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && String(v).trim()) q.set(k, String(v).trim());
  });
  const s = q.toString();
  return s ? `/shop?${s}` : "/shop";
};

/* ── animation variants ── */
const dropdownVariants = {
  hidden:  { opacity: 0, y: 10, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, y: 6,  scale: 0.97, transition: { duration: 0.15 } },
};

const drawerVariants = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { type: "spring", damping: 28, stiffness: 220 } },
  exit:    { x: "100%", transition: { type: "spring", damping: 28, stiffness: 220 } },
};

const searchVariants = {
  hidden:  { opacity: 0, scaleX: 0.95 },
  visible: { opacity: 1, scaleX: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, scaleX: 0.95, transition: { duration: 0.15 } },
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen,       setSearchOpen]       = useState(false);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [activeDropdown,   setActiveDropdown]   = useState(null);
  const [mobileDropdown,   setMobileDropdown]   = useState(null);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [scrolled,         setScrolled]         = useState(false);

  const searchInputRef = useRef(null);

  const { userInfo, logoutLoading } = useSelector((s) => s.auth);
  const isLoggedIn          = Boolean(userInfo);
  const unreadNotifications = Number(userInfo?.notifications?.unreadCount || 0);
  const notificationsTo     = isLoggedIn ? "/notifications" : "/login";
  const displayName         = userInfo?.username || userInfo?.Profile?.firstName || "Guest";
  const displayEmail        = userInfo?.email || "Sign in to continue";
  const avatarLabel         = displayName.charAt(0).toUpperCase();

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* focus search input when opened */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  /* sync search query with URL */
  useEffect(() => {
    if (!searchOpen) return;
    const term = location.pathname === "/shop"
      ? new URLSearchParams(location.search).get("search") || ""
      : "";
    setSearchQuery(term);
  }, [location, searchOpen]);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(buildSearchLink(q ? { search: q } : {}));
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setMobileMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Logout failed");
    }
  }, [dispatch, navigate]);

  /* shared icon button class — uses CSS vars for theme */
  const iconBtn = "w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-[var(--border)] text-[var(--icon)] bg-[var(--surface)] flex items-center justify-center hover:border-[#d4a544]/60 hover:text-[#d4a544] transition-all duration-300 shrink-0";

  return (
    <>
      <style>{`
        /* ── CSS variable bridge so navbar respects ThemeToggle ── */
        :root {
          --nav-bg:   rgba(8,8,8,0.95);
          --surface:  #0e0e0e;
          --border:   #1e1e1e;
          --text:     #ddd4be;
          --muted:    #6b6666;
          --icon:     #6b6666;
          --dropdown-bg: #0e0e0e;
          --drawer-bg:   #0a0a0a;
        }
        /* Light theme overrides — adjust these to match your ThemeToggle classes */
        [data-theme="light"], .light {
          --nav-bg:      rgba(255,255,255,0.97);
          --surface:     #f5f5f5;
          --border:      #e0e0e0;
          --text:        #111111;
          --muted:       #666666;
          --icon:        #555555;
          --dropdown-bg: #ffffff;
          --drawer-bg:   #fafafa;
        }
      `}</style>

      <div className="z-50">
        {/* ── HEADER ── */}
        <header
          className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
            scrolled
              ? "shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-b border-[#d4a544]/10"
              : "border-b border-[var(--border)]"
          }`}
          style={{ background: "var(--nav-bg)", backdropFilter: "blur(20px)" }}
        >
          <nav className="relative h-[64px] sm:h-[72px] xl:h-[85px] w-full px-4 sm:px-6 xl:px-12 flex items-center justify-between"
            style={{ color: "var(--text)" }}>

            {/* ── LEFT: search toggle + desktop nav ── */}
            <div className="flex items-center gap-2 xl:gap-0">
              <button
                onClick={() => setSearchOpen((o) => !o)}
                className={iconBtn}
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                {searchOpen ? <X size={17} /> : <Search size={17} />}
              </button>

              {/* desktop nav items */}
              {!searchOpen && (
                <div className="hidden xl:flex items-center gap-8 ml-8">
                  {navItems.map((item) => (
                    <div
                      key={item.title}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <NavLink
                        to={item.to}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-bold transition-colors duration-200"
                        style={{ color: activeDropdown === item.title ? "#d4a544" : "var(--muted)" }}
                      >
                        {item.title}
                        <ChevronDown
                          size={13}
                          style={{
                            transform: activeDropdown === item.title ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s",
                          }}
                        />
                      </NavLink>

                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="absolute top-[42px] left-0 w-[240px] rounded-2xl border shadow-2xl overflow-hidden"
                            style={{
                              background: "var(--dropdown-bg)",
                              borderColor: "var(--border)",
                            }}
                          >
                            <div className="p-2">
                              {item.dropdown.map((sub) => (
                                <NavLink
                                  key={sub.label}
                                  to={buildSearchLink(sub.params)}
                                  className="flex items-center px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:text-[#d4a544]"
                                  style={{ color: "var(--muted)" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212,165,68,0.06)"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                  {sub.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── CENTER: logo or search bar ── */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search"
                  variants={searchVariants}
                  initial="hidden" animate="visible" exit="exit"
                  onSubmit={handleSearchSubmit}
                  className="absolute left-14 right-16 sm:left-16 sm:right-20 xl:left-1/2 xl:-translate-x-1/2 xl:w-[50%] flex items-center gap-2 rounded-xl border px-3 py-0"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <Search size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 h-10 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                    style={{ color: "var(--text)" }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")}
                      className="shrink-0 transition-colors hover:text-[#d4a544]"
                      style={{ color: "var(--muted)" }}>
                      <X size={14} />
                    </button>
                  )}
                  <button type="submit"
                    className="shrink-0 rounded-lg bg-[#d4a544] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#080808] hover:bg-[#c19a3e] transition-colors">
                    Go
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2"
                >
                  <NavLink to="/"
                    className="flex items-center gap-1.5 text-[22px] sm:text-[26px] xl:text-[30px] font-black tracking-[8px] sm:tracking-[10px] hover:text-[#d4a544] transition-colors duration-300"
                    style={{ color: "var(--text)" }}>
                    LUXE
                    <Sparkles size={16} className="text-[#d4a544]" />
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── RIGHT: desktop icons + hamburger ── */}
            <div className="flex items-center gap-2">
              {/* desktop only */}
              {!searchOpen && (
                <div className="hidden xl:flex items-center gap-2">
                  <NavLink to={notificationsTo} aria-label="Notifications" className={`${iconBtn} relative`}>
                    <Bell size={17} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#d4a544] px-1 py-0.5 text-[8px] font-bold text-[#080808]">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </NavLink>

                  {isLoggedIn ? (
                    <>
                      <NavLink to="/wishlist"     className={iconBtn} aria-label="Wishlist"><Heart   size={17} /></NavLink>
                      <NavLink to="/ordersplaced" className={iconBtn} aria-label="Orders">  <Package size={17} /></NavLink>
                      <NavLink to="/profile">
                        {userInfo?.Profile?.profilePicture ? (
                          <img src={userInfo.Profile.profilePicture} alt={displayName}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-[#d4a544]/30" />
                        ) : (
                          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#d4a544]/10 text-sm font-bold text-[#d4a544] ring-2 ring-[#d4a544]/30">
                            {avatarLabel}
                          </div>
                        )}
                      </NavLink>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <NavLink to="/login"
                        className="rounded-lg border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                        style={{ borderColor: "var(--border)", color: "var(--text)", background: "var(--surface)" }}>
                        Login
                      </NavLink>
                      <NavLink to="/register"
                        className="rounded-lg bg-[#d4a544] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10">
                        Register
                      </NavLink>
                    </div>
                  )}
                </div>
              )}

              {/* hamburger — mobile + tablet */}
              {!searchOpen && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`${iconBtn} xl:hidden`}
                  aria-label="Open menu"
                >
                  <Menu size={19} />
                </button>
              )}
            </div>
          </nav>
        </header>

        {/* ── MOBILE DRAWER ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* overlay */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm xl:hidden"
              />

              {/* drawer panel */}
              <motion.aside
                variants={drawerVariants}
                initial="hidden" animate="visible" exit="exit"
                className="fixed right-0 top-0 z-[70] h-full w-[82%] max-w-[360px] xl:hidden overflow-y-auto border-l"
                style={{
                  background: "var(--drawer-bg)",
                  borderColor: "var(--border)",
                  paddingBottom: "env(safe-area-inset-bottom)",
                }}
              >
                <div className="flex flex-col h-full">
                  {/* drawer header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                    style={{ borderColor: "var(--border)" }}>
                    <span className="text-xl font-black tracking-[6px]" style={{ color: "var(--text)" }}>
                      LUXE
                    </span>
                    <button onClick={() => setMobileMenuOpen(false)} className={iconBtn} aria-label="Close menu">
                      <X size={17} />
                    </button>
                  </div>

                  {/* scrollable body */}
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

                    {/* user card */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl border"
                      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      {userInfo?.Profile?.profilePicture ? (
                        <img src={userInfo.Profile.profilePicture} alt={displayName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#d4a544]/30 shrink-0" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d4a544]/10 text-base font-bold text-[#d4a544] ring-2 ring-[#d4a544]/30">
                          {avatarLabel}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-[15px] truncate" style={{ color: "var(--text)" }}>
                          {displayName}
                        </p>
                        <p className="text-[12px] truncate" style={{ color: "var(--muted)" }}>
                          {displayEmail}
                        </p>
                      </div>
                    </div>

                    {/* nav items */}
                    <div className="rounded-2xl border overflow-hidden"
                      style={{ borderColor: "var(--border)" }}>
                      {navItems.map((item, idx) => (
                        <div key={item.title} className="border-b last:border-0"
                          style={{ borderColor: "var(--border)" }}>
                          <button
                            onClick={() => setMobileDropdown(mobileDropdown === idx ? null : idx)}
                            className="flex items-center justify-between w-full px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors"
                            style={{ color: mobileDropdown === idx ? "#d4a544" : "var(--muted)" }}
                          >
                            {item.title}
                            <ChevronDown
                              size={15}
                              style={{
                                transform: mobileDropdown === idx ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.25s",
                                color: "var(--muted)",
                              }}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {mobileDropdown === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                                style={{ background: "var(--surface)" }}
                              >
                                <div className="flex flex-col px-4 pb-3 pt-1 gap-0.5">
                                  {item.dropdown.map((sub) => (
                                    <NavLink
                                      key={sub.label}
                                      to={buildSearchLink(sub.params)}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="py-2.5 pl-3 text-[13px] border-l-2 border-transparent hover:border-[#d4a544] hover:text-[#d4a544] transition-all duration-200"
                                      style={{ color: "var(--muted)" }}
                                    >
                                      {sub.label}
                                    </NavLink>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* quick actions grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { to: isLoggedIn ? "/wishlist"      : "/login",    icon: <Heart   size={15}/>, label: "Wishlist"      },
                        { to: isLoggedIn ? "/ordersplaced"  : "/login",    icon: <Package size={15}/>, label: "Orders"        },
                        { to: notificationsTo,                             icon: <Bell    size={15}/>, label: "Notifications", badge: unreadNotifications },
                        { to: isLoggedIn ? "/profile"       : "/register", icon: <Settings size={15}/>,label: isLoggedIn ? "Profile" : "Register" },
                      ].map(({ to, icon, label, badge }) => (
                        <NavLink key={label} to={to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="relative flex items-center justify-center gap-2 rounded-xl border py-3 text-[12px] font-semibold transition-all duration-200 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--muted)" }}
                        >
                          {icon} {label}
                          {badge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#d4a544] px-1 text-[8px] font-bold text-[#080808]">
                              {badge > 99 ? "99+" : badge}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  {/* drawer footer — auth action */}
                  <div className="px-5 py-4 border-t shrink-0"
                    style={{ borderColor: "var(--border)" }}>
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e57373] transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4a2d2d] bg-[#2e1a1a]"
                      >
                        <LogOut size={15} />
                        {logoutLoading ? "Logging out…" : "Logout"}
                      </button>
                    ) : (
                      <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4a544] py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#080808] hover:bg-[#c19a3e] transition-colors shadow-lg shadow-[#d4a544]/15">
                        <UserCircle size={15} />
                        Login to continue
                      </NavLink>
                    )}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}