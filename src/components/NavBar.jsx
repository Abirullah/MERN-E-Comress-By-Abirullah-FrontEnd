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
  History,
  ShoppingBag,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    title: "Sale",
    dropdown: ["Women Shoes", "Men Shoes", "Kids Shoes"],
    icon: "🔥",
  },
  {
    title: "Men",
    dropdown: [
      "Football Shoes",
      "Street Wear",
      "Formal Leather Shoes",
      "Jordan",
      "Sneakers",
      "Running",
    ],
    icon: "👔",
  },
  {
    title: "Women",
    dropdown: [
      "Heels",
      "Sneakers",
      "Sports Wear",
      "Leather Shoes",
      "Street Wear",
    ],
    icon: "👠",
  },
  {
    title: "New Arrival",
    dropdown: ["Men", "Women", "Kids"],
    icon: "✨",
  },
  {
    title: "Most Sell",
    dropdown: ["Trending", "Top Rated", "Best Sneakers"],
    icon: "🏆",
  },
  {
    title: "Premium",
    dropdown: ["Luxury Collection", "Limited Edition", "Exclusive"],
    icon: "💎",
  },
];

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const searchInputRef = useRef(null);
  const location = useLocation();

  // auth state
  const isLoggedIn = true;

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
            ? "bg-black/30 backdrop-blur-[30px] border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] "
            : "bg-black/10 backdrop-blur-[14px] border-b border-white/5"
        }`}
      >
        <nav className="relative h-[85px] w-full px-6 xl:px-12 flex items-center justify-between text-white">
          
          {/* LEFT SIDE */}
          <div
            className={`flex items-center transition-all duration-500 ${
              searchOpen ? "w-full lg:w-[70%]" : "w-auto"
            }`}
          >
            {/* SEARCH BUTTON */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shrink-0"
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
                  className="
                    absolute 
                    left-1/2 
                    -translate-x-1/2 
                    w-[90%] 
                    md:w-[80%] 
                    lg:w-[70%] 
                    flex 
                    items-center 
                    justify-center
                  "
                >
                  {/* SEARCH CONTAINER */}
                  <div className="w-full flex items-center justify-between  backdrop-blur-2xl  shadow-[0_8px_32px_rgba(0,0,0,0.25)]  px-5 py-2 overflow-hidden">
                    
                    {/* EMPTY DIV FOR BALANCE - hidden on mobile */}
                    <div className="hidden lg:block w-[100px]"></div>

                    {/* SEARCH INPUT - CENTERED */}
                    <div className="relative flex-1 max-w-md mx-auto">
                      <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10"
                      />

                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search premium shoes..."
                        className="
                          w-full
                          h-[50px]
                          bg-transparent
                          pl-11
                          pr-4
                          text-white
                          placeholder:text-gray-300
                          outline-none
                          border-none
                          focus:outline-none
                          focus:ring-0
                        "
                      />
                      
                      {/* CROSS BUTTON */}
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* RIGHT LOGO - RIGHTMOST POSITION */}
                    <div className="hidden lg:flex items-center justify-end pr-9 w-[100px]">
                      <NavLink
                        to="/"
                        className="text-2xl font-black tracking-[8px] text-white whitespace-nowrap hover:tracking-[12px] transition-all duration-500"
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
                      <button className="flex items-center gap-1 text-[13px] uppercase tracking-[1px] font-semibold text-white/80 hover:text-white transition-all duration-300">
                        {item.title}

                        <motion.div
                          animate={{
                            rotate: activeDropdown === item.title ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-[45px] left-0 w-[260px] rounded-3xl border border-black/10 bg-white/80 backdrop-blur-5xl shadow-2xl overflow-hidden "
                          >
                            <div className="p-4">
                              {item.dropdown.map((subItem, idx) => (
                                <NavLink
                                  key={idx}
                                  to="/shop"
                                  className="flex items-center px-4 py-3 rounded-2xl text-[14px] font-medium text-black/70 hover:bg-black/5 hover:text-black transition-all duration-300"
                                >
                                  {subItem}
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
                className="text-[30px] font-black tracking-[10px] text-white hover:tracking-[12px] transition-all duration-500"
              >
                LUXE
              </NavLink>
            </div>
          )}

          {/* RIGHT SIDE - Desktop Icons & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Desktop Icons - Hidden on mobile */}
            {!searchOpen && (
              <div className="hidden xl:flex items-center gap-3">
                {/* NOTIFICATION */}
                <button className="relative w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                </button>

                {/* WISHLIST */}
                <NavLink to="/washinglist">
                <button className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                  <Heart size={18} />
                </button>
                </NavLink>

                {/* ORDERS */}
                <NavLink to="/ordersplaced">
                <button className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                  <Package size={18} />
                </button>
                </NavLink>

                {/* USER */}
                <NavLink to="/profile">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                    alt="user"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer ring-2 ring-white/20 shadow-md"
                  />
                </div>
                </NavLink>
              </div>
            )}

            {/* MOBILE MENU BUTTON - Rightmost position */}
            {!searchOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 xl:hidden"
            />

            {/* MENU */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-[85%] sm:w-[400px] bg-gradient-to-br from-gray-900 to-black z-50 shadow-2xl xl:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* TOP */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <span className="text-2xl font-black tracking-[6px] text-white">
                    LUXE
                  </span>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* USER PROFILE SECTION */}
                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                      alt="user"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20"
                    />
                    <div>
                      <h4 className="font-semibold text-white text-lg">Abir Afridi</h4>
                      <p className="text-sm text-white/60">abir@example.com</p>
                    </div>
                  </div>
                </div>

                {/* NAVIGATION ITEMS WITH DROPDOWNS */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item, idx) => (
                    <div key={idx} className="border-b border-white/10">
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === idx ? null : idx)}
                        className="flex items-center justify-between w-full py-4 text-white/80 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-3 text-[15px] font-medium">
                          <span className="text-xl">{item.icon}</span>
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
                                  to="/shop"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="py-2 text-white/60 hover:text-white transition-colors text-sm"
                                >
                                  {subItem}
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
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                      <Heart size={16} />
                      Wishlist
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                      <Package size={16} />
                      Orders
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                      <Bell size={16} />
                      Notifications
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}