import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Mail,
  Package,
  RefreshCw,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import {
  fetchNotificationsAPI,
  markAllNotificationsAsReadAPI,
  markNotificationAsReadAPI,
} from "../../Service/notificationApi";

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

// ─── Format Helper ─────────────────────────────────────────────────────────────
const formatRelativeTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

// ─── Icon Mapper ───────────────────────────────────────────────────────────────
const getNotificationIcon = (notification) => {
  const text = `${notification?.title || ""} ${notification?.message || ""}`.toLowerCase();
  if (text.includes("order") || text.includes("checkout")) return Package;
  if (text.includes("delivery") || text.includes("shipping") || text.includes("shipped")) return Truck;
  if (text.includes("stock") || text.includes("restock") || text.includes("back in")) return Sparkles;
  if (text.includes("wishlist") || text.includes("saved")) return Heart;
  if (text.includes("payment") || text.includes("receipt")) return Mail;
  return Bell;
};

const PAGE_LIMIT = 12;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    limit: PAGE_LIMIT,
    total: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [loadingActionId, setLoadingActionId] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadNotifications = useCallback(async (requestedPage = 1) => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchNotificationsAPI({ page: requestedPage, limit: PAGE_LIMIT });
      const list = Array.isArray(data?.notifications) ? data.notifications : [];

      setNotifications(list);
      setUnreadCount(Number(data?.unreadCount || 0));
      setPagination({
        page: data?.pagination?.page || requestedPage,
        pages: data?.pagination?.pages || 0,
        limit: data?.pagination?.limit || PAGE_LIMIT,
        total: data?.pagination?.total || list.length,
      });
      setPage(data?.pagination?.page || requestedPage);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page);
  }, [loadNotifications, page]);

  const handleMarkRead = async (notification) => {
    if (!notification?._id || notification.isRead) return;

    try {
      setLoadingActionId(notification._id);
      const response = await markNotificationAsReadAPI(notification._id);
      const updatedNotification = response?.notification || notification;

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, ...updatedNotification, isRead: true } : item
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      toast.success("Marked as read");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Could not update");
    } finally {
      setLoadingActionId("");
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      setBulkLoading(true);
      await markAllNotificationsAsReadAPI();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Could not update");
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading && notifications.length === 0) return <Loader fullScreen />;

  return (
    <div className="bg-[#080808] text-[#ddd4be]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,165,68,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Hero Section - 100vh */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-2xl w-full"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-[#d4a544]/10 border border-[#d4a544]/20">
              <Bell size={28} className="text-[#d4a544]" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="text-[42px] sm:text-[56px] lg:text-[72px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#ede5d0] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Notifications
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-[14px] leading-relaxed text-[#5a5450] mb-4"
          >
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
              : "You're all caught up"}
          </motion.p>

          {!loading && notifications.length === 0 && !error && (
            <motion.p 
              variants={fadeUp}
              className="text-[13px] text-[#5a5450] italic"
            >
              Updates about your orders and store announcements will appear here.
            </motion.p>
          )}

          {error && (
            <motion.p 
              variants={fadeUp}
              className="text-[13px] text-red-400"
            >
              {error}
            </motion.p>
          )}

          {unreadCount > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <button
                onClick={handleMarkAllRead}
                disabled={bulkLoading}
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full bg-[#d4a544] text-[#080808] hover:bg-[#c49538] transition-all duration-200 disabled:opacity-50"
              >
                {bulkLoading ? "Saving..." : "Mark all read"}
              </button>
            </motion.div>
          )}

          {/* Scroll indicator */}
          {notifications.length > 0 && (
            <motion.div 
              variants={fadeUp}
              className="mt-12"
            >
              <div className="w-5 h-8 rounded-full border border-[#d4a544]/30 flex items-start justify-center p-1">
                <motion.div 
                  className="w-1 h-2 rounded-full bg-[#d4a544]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Notifications List - Below the fold */}
      {notifications.length > 0 && (
        <section className="relative z-10 pb-16 px-6 mx-auto w-full max-w-2xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            {/* Refresh button */}
            <motion.div variants={fadeUp} className="flex justify-end mb-6">
              <button
                onClick={() => loadNotifications(page)}
                disabled={loading}
                className="inline-flex items-center gap-2 p-2.5 rounded-full border border-[#1e1e1e] text-[#6b6666] hover:text-[#d4a544] hover:border-[#d4a544]/30 transition-all duration-200"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span className="text-[10px] font-medium">Refresh</span>
              </button>
            </motion.div>

            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification);
              const isRead = Boolean(notification?.isRead);
              const hasLink = Boolean(notification?.link);

              return (
                <motion.article
                  key={notification._id}
                  variants={fadeUp}
                  className={`
                    group relative flex gap-4 p-4 rounded-2xl transition-all duration-300 cursor-default
                    ${isRead 
                      ? 'hover:bg-[#0c0c0c]' 
                      : 'bg-[#d4a544]/[0.03] border border-[#d4a544]/10 hover:border-[#d4a544]/20'}
                  `}
                >
                  {/* Unread dot */}
                  {!isRead && (
                    <div className="absolute top-5 right-5">
                      <div className="w-2 h-2 rounded-full bg-[#d4a544] shadow-[0_0_6px_rgba(212,165,68,0.4)]" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`
                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
                    ${isRead 
                      ? 'bg-[#0e0e0e] text-[#5a5450]' 
                      : 'bg-[#d4a544]/10 text-[#d4a544]'}
                  `}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`text-[14px] font-semibold ${isRead ? 'text-[#9a8f7a]' : 'text-[#ede5d0]'}`}>
                        {notification?.title || "Notification"}
                      </h3>
                      <span className="text-[10px] text-[#5a5450] shrink-0 mt-0.5">
                        {formatRelativeTime(notification?.createdAt)}
                      </span>
                    </div>
                    
                    <p className={`text-[12px] leading-relaxed mb-3 ${isRead ? 'text-[#5a5450]' : 'text-[#7a7060]'}`}>
                      {notification?.message || "You have a new update."}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!isRead && (
                        <button
                          onClick={() => handleMarkRead(notification)}
                          disabled={loadingActionId === notification?._id}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4a544] hover:text-[#e0b54e] transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={12} />
                          {loadingActionId === notification?._id ? "Saving..." : "Mark read"}
                        </button>
                      )}
                      
                      {hasLink && (
                        <Link
                          to={notification.link}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b6666] hover:text-[#d4a544] transition-colors ml-3"
                        >
                          View
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 flex items-center justify-between"
            >
              <span className="text-[11px] text-[#5a5450]">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((c) => Math.max(1, c - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium text-[#6b6666] hover:text-[#d4a544] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={13} />
                  Prev
                </button>
                
                <button
                  onClick={() => setPage((c) => Math.min(pagination.pages, c + 1))}
                  disabled={page >= pagination.pages || loading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium text-[#6b6666] hover:text-[#d4a544] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}