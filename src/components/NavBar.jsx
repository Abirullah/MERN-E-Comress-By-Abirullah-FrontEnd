import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  Bell,
  Package,
  ChevronDown,
  X,
  Menu,
  LogOut,
  Settings,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../ReduxSetUp/Feature/Auth/AuthSlice";

const navItems = [
  {
    title: "Sale",
    to: "/shop?sale=true",
    dropdown: [
      { label: "Women Shoes", params: { sale: "true", gender: "women" } },
      { label: "Men Shoes", params: { sale: "true", gender: "men" } },
      { label: "Kids Shoes", params: { sale: "true", gender: "kids" } },
    ],
  },
  {
    title: "Men",
    to: "/shop?gender=men",
    dropdown: [
      { label: "Football Shoes", params: { gender: "men", category: "football shoes" } },
      { label: "Street Wear", params: { gender: "men", category: "street wear" } },
      { label: "Formal Leather Shoes", params: { gender: "men", category: "formal leather shoes" } },
      { label: "Jordan", params: { gender: "men", category: "jordan" } },
      { label: "Sneakers", params: { gender: "men", category: "sneakers" } },
      { label: "Running", params: { gender: "men", category: "running" } },
    ],
  },
  {
    title: "Women",
    to: "/shop?gender=women",
    dropdown: [
      { label: "Heels", params: { gender: "women", category: "heels" } },
      { label: "Sneakers", params: { gender: "women", category: "sneakers" } },
      { label: "Sports Wear", params: { gender: "women", category: "sports wear" } },
      { label: "Leather Shoes", params: { gender: "women", category: "leather shoes" } },
      { label: "Street Wear", params: { gender: "women", category: "street wear" } },
    ],
  },
  {
    title: "New Arrival",
    to: "/shop?sort=newest",
    dropdown: [
      { label: "Men", params: { sort: "newest", gender: "men" } },
      { label: "Women", params: { sort: "newest", gender: "women" } },
      { label: "Kids", params: { sort: "newest", gender: "kids" } },
    ],
  },
  {
    title: "Premium",
    to: "/shop?category=premium",
    dropdown: [
      { label: "Luxury Collection", params: { category: "luxury collection" } },
      { label: "Limited Edition", params: { category: "limited edition" } },
      { label: "Exclusive", params: { category: "exclusive" } },
    ],
  },
];

const buildSearchLink = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, String(value).trim());
    }
  });

  const query = searchParams.toString();
  return query ? `/shop?${query}` : "/shop";
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 180,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 180,
    },
  },
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const searchInputRef = useRef(null);
  const location = useLocation();
  const { userInfo, logoutLoading } = useSelector(
    (state) => state.auth
  );

  const isLoggedIn = Boolean(userInfo);
  const displayName =
    userInfo?.username ||
    userInfo?.Profile?.firstName ||
    "Guest";
  const displayEmail = userInfo?.email || "Sign in to continue";
  const avatarLabel = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setMobileMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="z-60">
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/95 backdrop-blur-[30px] border-b border-[#d4a544]/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-[#080808]/90 backdrop-blur-[14px] border-b border-[#1e1e1e]"
        }`}
      >
        <nav className="relative h-[85px] w-full px-6 xl:px-12 flex items-center justify-between text-[#ddd4be]">
          
          {/* LEFT SIDE */}
          <div
            className={`flex items-center transition-all duration-500 ${
              searchOpen ? "w-full lg:w-[70%]" : "w-auto"
            }`}
          >
            {/* SEARCH BUTTON */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-11 h-11 rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] flex items-center justify-center hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all duration-300 shrink-0"
            >
              {searchOpen ? <X size={18} className="z-20" /> : <Search size={18} />}
            </button>

            {/* SEARCH MODE */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] lg:w-[70%] flex items-center justify-center"
                >
                  <div className="w-full flex items-center justify-between px-5 py-2 overflow-hidden">
                    
                    <div className="hidden lg:block w-[100px]"></div>

                    <div className="relative flex-1 max-w-md mx-auto">
                      <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5a5a] z-10"
                      />

                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search premium shoes..."
                        className="w-full h-[50px] bg-transparent pl-11 pr-4 text-[#ddd4be] placeholder:text-[#5a5a5a] outline-none border-none focus:outline-none focus:ring-0"
                      />
                      
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-[#d4a544] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="hidden lg:flex items-center justify-end pr-9 w-[100px]">
                      <NavLink
                        to="/"
                        className="text-2xl font-black tracking-[8px] text-[#ddd4be] whitespace-nowrap hover:text-[#d4a544] transition-all duration-500"
                      >
                        LUXE
                      </NavLink>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="hidden xl:flex items-center gap-10 ml-8 mr-32">
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <NavLink
                        to={item.to || "/shop"}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-bold text-[#6b6666] hover:text-[#d4a544] transition-all duration-300"
                      >
                        <span>{item.title}</span>
                        <motion.div
                          animate={{
                            rotate: activeDropdown === item.title ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </NavLink>

                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-[45px] left-0 w-[260px] rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] backdrop-blur-xl shadow-2xl overflow-hidden"
                          >
                            <div className="p-3">
                              {item.dropdown.map((subItem, idx) => (
                                <NavLink
                                  key={idx}
                                  to={buildSearchLink(subItem.params)}
                                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-[#6b6666] hover:bg-[#d4a544]/5 hover:text-[#d4a544] transition-all duration-300"
                                >
                                  {subItem.label}
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
            </AnimatePresence>
          </div>

          {/* CENTER LOGO */}
          {!searchOpen && (
            <div className="absolute left-1/2 -translate-x-1/2">
              <NavLink
                to="/"
                className="text-[30px] font-black tracking-[10px] text-[#ddd4be] hover:text-[#d4a544] transition-all duration-500 flex items-center gap-2"
              >
                LUXE
                <Sparkles size={20} className="text-[#d4a544]" />
              </NavLink>
            </div>
          )}

          {/* RIGHT SIDE - Desktop Icons & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Desktop Icons - Hidden on mobile */}
            {!searchOpen && (
              <div className="hidden xl:flex items-center gap-3">
                {/* NOTIFICATION */}
                <button className="relative w-11 h-11 rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] flex items-center justify-center hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all duration-300">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d4a544]" />
                </button>

                {/* WISHLIST */}
                {isLoggedIn ? (
                  <>
                    <NavLink to="/washinglist">
                      <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]">
                        <Heart size={18} />
                      </button>
                    </NavLink>

                    <NavLink to="/ordersplaced">
                      <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]">
                        <Package size={18} />
                      </button>
                    </NavLink>

                    <NavLink to="/profile">
                      <div className="relative group">
                        {userInfo?.Profile?.profilePicture ? (
                          <img
                            src={userInfo.Profile.profilePicture}
                            alt={displayName}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#d4a544]/30 shadow-md"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4a544]/10 text-sm font-bold text-[#d4a544] ring-2 ring-[#d4a544]/30 shadow-md">
                            {avatarLabel}
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <NavLink
                      to="/login"
                      className="rounded-lg border border-[#1e1e1e] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ddd4be] bg-[#0e0e0e] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="rounded-lg bg-[#d4a544] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 shadow-lg shadow-[#d4a544]/10"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            {!searchOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden w-11 h-11 rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] flex items-center justify-center hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all duration-300"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 xl:hidden"
            />

            {/* MENU */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-[85%] sm:w-[400px] bg-gradient-to-br from-[#0a0a0a] to-[#0e0e0e] z-50 shadow-2xl xl:hidden overflow-y-auto border-l border-[#1e1e1e]"
            >
              <div className="p-6">
                {/* TOP */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e1e1e]">
                  <span className="text-2xl font-black tracking-[6px] text-[#ddd4be]">
                    LUXE
                  </span>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-lg border border-[#1e1e1e] text-[#6b6666] bg-[#0e0e0e] flex items-center justify-center hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* USER PROFILE SECTION */}
                <div className="mb-8 p-4 rounded-2xl bg-[#0e0e0e] border border-[#1e1e1e]">
                  <div className="flex items-center gap-4">
                    {userInfo?.Profile?.profilePicture ? (
                      <img
                        src={userInfo.Profile.profilePicture}
                        alt={displayName}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#d4a544]/30"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a544]/10 text-lg font-bold text-[#d4a544] ring-2 ring-[#d4a544]/30">
                        {avatarLabel}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-[#ddd4be] text-lg">
                        {displayName}
                      </h4>
                      <p className="text-sm text-[#6b6666]">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NAVIGATION ITEMS WITH DROPDOWNS */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item, idx) => (
                    <div key={idx} className="border-b border-[#1e1e1e]">
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === idx ? null : idx)}
                        className="flex items-center justify-between w-full py-4 text-[#6b6666] hover:text-[#d4a544] transition-colors"
                      >
                        <span className="flex items-center gap-3 text-[15px] font-medium">
                          {item.title}
                        </span>
                        <motion.div
                          animate={{ rotate: mobileDropdownOpen === idx ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {mobileDropdownOpen === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-8 pb-3 flex flex-col gap-2">
                              {item.dropdown.map((subItem, subIdx) => (
                                <NavLink
                                  key={subIdx}
                                  to={buildSearchLink(subItem.params)}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="py-2 text-[#6b6666] hover:text-[#d4a544] transition-colors text-sm"
                                >
                                  {subItem.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-8 pt-6 border-t border-[#1e1e1e]">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <NavLink
                      to={isLoggedIn ? "/washinglist" : "/login"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0e0e0e] border border-[#1e1e1e] py-3 text-[#6b6666] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                    >
                      <Heart size={16} />
                      Wishlist
                    </NavLink>
                    <NavLink
                      to={isLoggedIn ? "/ordersplaced" : "/login"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0e0e0e] border border-[#1e1e1e] py-3 text-[#6b6666] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                    >
                      <Package size={16} />
                      Orders
                    </NavLink>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0e0e0e] border border-[#1e1e1e] text-[#6b6666] hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all duration-300">
                      <Bell size={16} />
                      Notifications
                    </button>
                    <NavLink
                      to={isLoggedIn ? "/profile" : "/register"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0e0e0e] border border-[#1e1e1e] py-3 text-[#6b6666] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544]"
                    >
                      <Settings size={16} />
                      {isLoggedIn ? "Profile" : "Register"}
                    </NavLink>
                  </div>

                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2e1a1a] border border-[#4a2d2d] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e57373] transition-all duration-300 hover:bg-[#4a2d2d] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <LogOut size={16} />
                      {logoutLoading ? "Logging out..." : "Logout"}
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4a544] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] shadow-lg shadow-[#d4a544]/10"
                    >
                      <UserCircle size={16} />
                      Login to continue
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}