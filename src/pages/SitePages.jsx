import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  Info,
  Lock,
  Mail,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Truck,
  UserCircle2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const THEME_KEY = "site-theme";

const getPreferredTheme = () => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// ─── Theme Hook ─────────────────────────────────────────────────────────────────
const useTheme = () => {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    const syncTheme = () => setTheme(getPreferredTheme());
    syncTheme();
    window.addEventListener("storage", syncTheme);
    window.addEventListener("themechange", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("themechange", syncTheme);
    };
  }, []);

  return { theme, isDark: theme === "dark" };
};

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

// ─── CTAButton ──────────────────────────────────────────────────────────────────
const CTAButton = ({ to, children, variant = "primary" }) => {
  const { isDark } = useTheme();
  
  const base = "inline-flex items-center gap-2.5 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-300 rounded-full";
  
  const styles = variant === "secondary"
    ? `${base} border ${isDark ? 'border-[#2a2a2a] text-[#9a8f7a] hover:border-[#d4a544]/50 hover:text-[#d4a544]' : 'border-gray-300 text-gray-600 hover:border-amber-600 hover:text-amber-600'}`
    : `${base} bg-amber-500 text-black hover:bg-amber-400 hover:-translate-y-px shadow-lg shadow-amber-500/20`;

  return (
    <Link to={to} className={styles}>
      {children}
      <ArrowUpRight size={12} strokeWidth={2.5} />
    </Link>
  );
};

// ─── ContentPage (Redesigned with Hero) ────────────────────────────────────────
function ContentPage({
  icon: HeroIcon = Sparkles,
  eyebrow,
  title,
  summary,
  highlights = [],
  sections = [],
  ctas = [],
  calloutTitle,
  calloutText,
  footer = true,
}) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-gray-50'}`}>
      {/* Hero Section - 100vh */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-3xl w-full"
        >
          {/* Icon */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
            }`}>
              <HeroIcon size={28} className={isDark ? 'text-amber-400' : 'text-amber-600'} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium ${
              isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {eyebrow}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className={`text-[42px] sm:text-[56px] lg:text-[72px] font-semibold leading-[1.05] tracking-[-0.02em] mb-6 ${
              isDark ? 'text-[#ede5d0]' : 'text-gray-900'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </motion.h1>

          {/* Summary */}
          <motion.p
            variants={fadeUp}
            className={`text-sm leading-relaxed max-w-xl mx-auto mb-8 ${isDark ? 'text-[#5a5450]' : 'text-gray-500'}`}
          >
            {summary}
          </motion.p>

          {/* Highlights */}
          {highlights.length > 0 && (
            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-2 mb-8">
              {highlights.map((h) => (
                <motion.span
                  key={h.label}
                  variants={fadeUp}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-medium ${
                    isDark ? 'bg-[#0a0a0a] text-gray-400 border border-[#1a1a1a]' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  <h.icon size={12} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                  {h.label}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* CTAs */}
          {ctas.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {ctas.map((cta) => (
                <CTAButton key={cta.label} to={cta.to} variant={cta.variant || "primary"}>
                  {cta.label}
                </CTAButton>
              ))}
            </motion.div>
          )}

          {/* Scroll indicator */}
          {sections.length > 0 && (
            <motion.div variants={fadeUp} className="mt-12">
              <div className="w-5 h-8 rounded-full border border-amber-500/30 flex items-start justify-center p-1 mx-auto">
                <motion.div 
                  className="w-1 h-2 rounded-full bg-amber-500"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Sections Grid - Below the fold */}
      {sections.length > 0 && (
        <section className="relative pb-16 px-6 mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-16"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`relative p-6 rounded-2xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-amber-500/20' 
                    : 'bg-white border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-md'
                }`}
              >
                <span className={`absolute top-6 right-6 text-[10px] font-mono ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
                  {section.kicker}
                </p>

                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {section.title}
                </h3>

                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {section.text}
                </p>

                {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 size={12} className={`shrink-0 mt-0.5 ${isDark ? 'text-amber-500/70' : 'text-amber-500'}`} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Callout Banner */}
          {(calloutTitle || calloutText) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={`relative rounded-2xl overflow-hidden p-8 md:p-10 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] border border-[#1a1a1a]' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-3">
                      Need help?
                    </p>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {calloutTitle}
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {calloutText}
                    </p>
                  </div>
                  <CTAButton to="/contact" variant="primary">
                    Get in touch
                  </CTAButton>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      )}

      {footer && <Footer />}
    </div>
  );
}

// ─── ContactPage ────────────────────────────────────────────────────────────────
function ContactPage() {
  const { isDark } = useTheme();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "We'll respond within 2 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7 for instant help",
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Mon-Fri, 9AM-6PM EST",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#080808]' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-3xl w-full"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
            }`}>
              <Mail size={28} className={isDark ? 'text-amber-400' : 'text-amber-600'} strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium ${
              isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <Sparkles size={12} />
              We're here to help
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`text-[42px] sm:text-[56px] lg:text-[72px] font-semibold leading-[1.05] tracking-[-0.02em] mb-6 ${
              isDark ? 'text-[#ede5d0]' : 'text-gray-900'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Get in touch
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`text-sm leading-relaxed max-w-xl mx-auto mb-12 ${isDark ? 'text-[#5a5450]' : 'text-gray-500'}`}
          >
            Questions about your order, sizing, or just want to share feedback — our team responds promptly.
          </motion.p>

          {/* Contact Methods */}
          <motion.div variants={stagger} className="grid gap-4 md:grid-cols-3 mb-8">
            {contactMethods.map((method) => (
              <motion.div
                key={method.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-amber-500/30' 
                    : 'bg-white border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isDark ? 'bg-amber-500/10' : 'bg-amber-50'
                }`}>
                  <method.icon size={18} className={isDark ? 'text-amber-400' : 'text-amber-600'} strokeWidth={1.5} />
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {method.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {method.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
}

// ─── MessageCircle Icon ────────────────────────────────────────────────────────
const MessageCircle = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ─── Page Data ─────────────────────────────────────────────────────────────────
const aboutPage = {
  icon: Sparkles,
  eyebrow: "About Luxe",
  title: "Curated sneakers.\nA shopping experience that feels personal.",
  summary: "Luxe is built for those who value quality over quantity. We've refined sneaker shopping with clean navigation, trusted brands, and a seamless path from discovery to delivery.",
  highlights: [
    { icon: Sparkles, label: "Curated Collections" },
    { icon: Package, label: "Order Tracking" },
    { icon: ShieldCheck, label: "Secure Checkout" },
    { icon: Award, label: "Premium Quality" },
  ],
  sections: [
    {
      kicker: "Our Philosophy",
      title: "Why we built this store",
      text: "Shopping should feel intentional, not overwhelming. We focus on a refined catalog, intuitive filtering, and a checkout process that respects your time.",
      bullets: [
        "Hand-picked selection from trusted brands",
        "Smart wishlist and order management",
        "Instant brand and category filters",
        "Mobile-first, clutter-free interface",
      ],
    },
    {
      kicker: "What We Offer",
      title: "From lifestyle to performance",
      text: "Whether you're after everyday comfort, athletic performance, or statement pieces, our collection spans the styles that define modern footwear.",
      bullets: [
        "Premium lifestyle sneakers",
        "High-performance athletic shoes",
        "Classic formal and casual pairs",
        "Limited-edition collaborations",
      ],
    },
    {
      kicker: "The Experience",
      title: "Designed for confident decisions",
      text: "Every feature — from brand filtering to order history — is designed to help you make informed choices without the noise.",
      bullets: [
        "Instant filtering by brand, category, gender",
        "Complete order and wishlist management",
        "Transparent pricing and availability",
        "Responsive support when you need it",
      ],
    },
  ],
  ctas: [
    { label: "Explore collection", to: "/shop", variant: "primary" },
    { label: "Contact support", to: "/contact", variant: "secondary" },
  ],
  calloutTitle: "Ready to find your next pair?",
  calloutText: "Browse our curated collection and discover footwear that combines style, comfort, and quality.",
};

const shippingPage = {
  icon: Truck,
  eyebrow: "Shipping & Delivery",
  title: "Fast, reliable,\ntransparent shipping.",
  summary: "From order confirmation to your doorstep, you'll always know where your package stands.",
  highlights: [
    { icon: Truck, label: "Real-time Tracking" },
    { icon: Package, label: "Secure Packaging" },
    { icon: Clock3, label: "Quick Processing" },
    { icon: Globe, label: "Worldwide Delivery" },
  ],
  sections: [
    {
      kicker: "Processing",
      title: "Order preparation done right",
      text: "Once confirmed, our team carefully prepares and packages your items with attention to detail.",
      bullets: [
        "Immediate order confirmation",
        "Meticulous quality checks",
        "Eco-friendly packaging",
        "Real-time status updates",
      ],
    },
    {
      kicker: "Delivery",
      title: "Timely, wherever you are",
      text: "Our shipping network ensures your order arrives safely and on time with accurate estimates.",
      bullets: [
        "Express and standard options",
        "Live tracking updates",
        "Signature confirmation available",
        "Flexible delivery schedules",
      ],
    },
    {
      kicker: "Support",
      title: "Here if something goes wrong",
      text: "If your package is delayed or you have questions, our support team is ready to help.",
      bullets: [
        "24/7 order tracking",
        "Dedicated support team",
        "Quick issue resolution",
        "Satisfaction guaranteed",
      ],
    },
  ],
  ctas: [
    { label: "Track your order", to: "/ordersplaced", variant: "primary" },
    { label: "Contact support", to: "/contact", variant: "secondary" },
  ],
  calloutTitle: "Have a question about shipping?",
  calloutText: "Our team is always ready to assist. Reach out anytime.",
};

const returnsPage = {
  icon: RotateCcw,
  eyebrow: "Returns & Exchanges",
  title: "Hassle-free returns,\nno questions asked.",
  summary: "We want you to love your purchase. If something isn't right, our straightforward return process makes it easy.",
  highlights: [
    { icon: RotateCcw, label: "30-Day Returns" },
    { icon: CheckCircle2, label: "Easy Process" },
    { icon: Info, label: "Full Transparency" },
    { icon: ThumbsUp, label: "Satisfaction First" },
  ],
  sections: [
    {
      kicker: "Eligibility",
      title: "Simple return conditions",
      text: "Most unworn items can be returned within 30 days. We review returns based on condition and timing.",
      bullets: [
        "Items must be in original condition",
        "Original packaging preferred",
        "Clear return instructions",
        "Quick approval process",
      ],
    },
    {
      kicker: "Process",
      title: "How to initiate a return",
      text: "Contact our support team with your order number and reason for return. We'll guide you through.",
      bullets: [
        "Submit return request online",
        "Receive return authorization",
        "Package items securely",
        "Track return status",
      ],
    },
    {
      kicker: "Refunds",
      title: "Fast and reliable refunds",
      text: "Once approved and received, refunds are processed promptly to your original payment method.",
      bullets: [
        "Quick processing times",
        "Full refund to original payment",
        "Store credit options available",
        "Status notifications throughout",
      ],
    },
  ],
  ctas: [
    { label: "Start a return", to: "/contact", variant: "primary" },
    { label: "View orders", to: "/ordersplaced", variant: "secondary" },
  ],
  calloutTitle: "Need help with a return?",
  calloutText: "We're here to make it easy. Contact us and we'll handle the rest.",
};

const privacyPage = {
  icon: ShieldCheck,
  eyebrow: "Privacy Policy",
  title: "Your privacy\nis our priority.",
  summary: "We collect only what's necessary to provide a seamless shopping experience. Your data stays secure.",
  highlights: [
    { icon: ShieldCheck, label: "Data Security" },
    { icon: FileText, label: "Full Transparency" },
    { icon: Heart, label: "Your Control" },
    { icon: Lock, label: "Encrypted Storage" },
  ],
  sections: [
    {
      kicker: "Data Collection",
      title: "What we store and why",
      text: "We collect essential information to process orders and improve your shopping experience.",
      bullets: [
        "Account and profile information",
        "Order and shipping details",
        "Communication history",
        "Shopping preferences",
      ],
    },
    {
      kicker: "Data Usage",
      title: "How we use your information",
      text: "Your data helps us fulfill orders, provide support, and continuously improve Luxe.",
      bullets: [
        "Order processing and delivery",
        "Personalised recommendations",
        "Customer support services",
        "Platform improvements",
      ],
    },
    {
      kicker: "Your Rights",
      title: "You're always in control",
      text: "Access, update, or delete your data at any time. We're transparent about data handling.",
      bullets: [
        "Update profile anytime",
        "Review order history",
        "Request data deletion",
        "Opt-out of marketing",
      ],
    },
  ],
  ctas: [
    { label: "Update profile", to: "/profile", variant: "primary" },
    { label: "Privacy questions", to: "/contact", variant: "secondary" },
  ],
  calloutTitle: "Have privacy concerns?",
  calloutText: "We're committed to protecting your data. Contact us with any questions.",
};

const termsPage = {
  icon: FileText,
  eyebrow: "Terms of Service",
  title: "Clear terms for\na fair experience.",
  summary: "We believe in transparency. These terms outline how the store operates and what you can expect.",
  highlights: [
    { icon: FileText, label: "Clear Policies" },
    { icon: ShieldCheck, label: "Fair Use" },
    { icon: Package, label: "Account Security" },
    { icon: Users, label: "Community Guidelines" },
  ],
  sections: [
    {
      kicker: "Orders",
      title: "How orders work",
      text: "When you place an order, we take that commitment seriously and keep you updated throughout.",
      bullets: [
        "Order confirmation details",
        "Payment verification process",
        "Inventory and availability",
        "Order modification options",
      ],
    },
    {
      kicker: "Pricing",
      title: "Transparent pricing, always",
      text: "We strive for clear, competitive pricing. You'll always see the final price before checkout.",
      bullets: [
        "Clear price display",
        "Promotional transparency",
        "Tax calculation included",
        "No hidden fees",
      ],
    },
    {
      kicker: "Usage",
      title: "Responsible shopping",
      text: "We ask that you use our platform responsibly and follow community guidelines.",
      bullets: [
        "Maintain accurate account details",
        "Respect checkout limits",
        "Follow community guidelines",
        "Comply with local laws",
      ],
    },
  ],
  ctas: [
    { label: "Start shopping", to: "/shop", variant: "primary" },
    { label: "Contact support", to: "/contact", variant: "secondary" },
  ],
  calloutTitle: "Questions about our terms?",
  calloutText: "We're here to clarify any questions about our policies or your account.",
};

const accessibilityPage = {
  icon: Globe,
  eyebrow: "Accessibility",
  title: "Designed for\neveryone, everywhere.",
  summary: "We're committed to an inclusive shopping experience with accessibility at every level.",
  highlights: [
    { icon: CheckCircle2, label: "Keyboard Optimised" },
    { icon: Info, label: "High Contrast" },
    { icon: Sparkles, label: "Screen Reader Ready" },
    { icon: Globe, label: "Universal Design" },
  ],
  sections: [
    {
      kicker: "Navigation",
      title: "Easy navigation for all users",
      text: "Our interface is structured to be intuitive with clear labels and keyboard-friendly controls.",
      bullets: [
        "Consistent navigation patterns",
        "Large, clickable elements",
        "Clear visual hierarchy",
        "Alternative text support",
      ],
    },
    {
      kicker: "Visual Design",
      title: "Readability and clarity first",
      text: "We prioritize high contrast, legible typography, and clear spacing for accessibility.",
      bullets: [
        "WCAG contrast standards",
        "Responsive text sizes",
        "Clear button states",
        "Focus indicators visible",
      ],
    },
    {
      kicker: "Assistance",
      title: "Help when you need it",
      text: "If you encounter any barriers, our support team is ready to assist and improve.",
      bullets: [
        "Accessible support channels",
        "Quick issue resolution",
        "Continuous improvements",
        "Feedback welcomed",
      ],
    },
  ],
  ctas: [
    { label: "Get support", to: "/contact", variant: "primary" },
    { label: "Browse products", to: "/shop", variant: "secondary" },
  ],
  calloutTitle: "Found an accessibility issue?",
  calloutText: "Let us know about any barriers you encounter. We'll act on it.",
};

const cookiesPage = {
  icon: FileText,
  eyebrow: "Cookie Policy",
  title: "Cookies that enhance\nyour experience.",
  summary: "We use cookies responsibly to improve your shopping experience and maintain security.",
  highlights: [
    { icon: FileText, label: "Essential Only" },
    { icon: Sparkles, label: "Enhanced Experience" },
    { icon: ShieldCheck, label: "Privacy First" },
    { icon: Info, label: "Full Control" },
  ],
  sections: [
    {
      kicker: "Purpose",
      title: "Why we use cookies",
      text: "Cookies help us remember your session and preferences for a smoother shopping experience.",
      bullets: [
        "Session management",
        "Preference storage",
        "Authentication support",
        "Basic functionality",
      ],
    },
    {
      kicker: "Performance",
      title: "Improving your experience",
      text: "We use analytics cookies to understand interactions and make meaningful improvements.",
      bullets: [
        "Performance analytics",
        "Usage patterns",
        "Feature popularity",
        "Continuous optimisation",
      ],
    },
    {
      kicker: "Control",
      title: "You're in charge",
      text: "Manage cookie preferences through your browser settings. We respect your choices.",
      bullets: [
        "Browser settings control",
        "Easy to clear",
        "Transparent usage",
        "Support available",
      ],
    },
  ],
  ctas: [
    { label: "Contact support", to: "/contact", variant: "primary" },
    { label: "Privacy policy", to: "/privacy-policy", variant: "secondary" },
  ],
  calloutTitle: "Questions about cookies?",
  calloutText: "We're here to explain our cookie usage and help you manage your preferences.",
};

const faqPage = {
  icon: HelpCircle,
  eyebrow: "FAQ",
  title: "Answers to your\nmost common questions.",
  summary: "Quick answers about orders, shipping, returns, and account management.",
  highlights: [
    { icon: HelpCircle, label: "Quick Answers" },
    { icon: Truck, label: "Shipping Help" },
    { icon: RotateCcw, label: "Returns Guide" },
    { icon: Headphones, label: "24/7 Support" },
  ],
  sections: [
    {
      kicker: "Orders",
      title: "Order management",
      text: "Everything you need to know about placing, tracking, and managing your orders.",
      bullets: [
        "View order status anytime",
        "Track shipments in real-time",
        "Modify order details",
        "Cancel or return orders",
      ],
    },
    {
      kicker: "Products",
      title: "Sizing and quality",
      text: "Learn about product details, sizing guides, and ensuring the perfect fit.",
      bullets: [
        "Size guides available",
        "Product measurements",
        "Material quality",
        "Care instructions",
      ],
    },
    {
      kicker: "Account",
      title: "Account management",
      text: "Manage your profile, wishlist, and preferences with ease.",
      bullets: [
        "Update profile information",
        "Manage wishlist",
        "View order history",
        "Notification preferences",
      ],
    },
  ],
  ctas: [
    { label: "Contact support", to: "/contact", variant: "primary" },
    { label: "Returns policy", to: "/returns", variant: "secondary" },
  ],
  calloutTitle: "Still have questions?",
  calloutText: "Our support team is ready to help. Reach out anytime for personalised assistance.",
};

const careersPage = {
  icon: Briefcase,
  eyebrow: "Careers",
  title: "Join a team\nredefining retail.",
  summary: "We're building something special at Luxe — a brand that values quality, innovation, and experience.",
  highlights: [
    { icon: UserCircle2, label: "Product & Design" },
    { icon: Briefcase, label: "Operations" },
    { icon: Mail, label: "Customer Care" },
    { icon: TrendingUp, label: "Growth" },
  ],
  sections: [
    {
      kicker: "Opportunities",
      title: "Roles we're hiring for",
      text: "We're always looking for talented people who share our passion for exceptional customer experiences.",
      bullets: [
        "Product management and curation",
        "Operations and fulfilment",
        "Customer experience and support",
        "Marketing and brand development",
      ],
    },
    {
      kicker: "Culture",
      title: "What matters to us",
      text: "We value creativity, attention to detail, and a commitment to excellence.",
      bullets: [
        "Clear communication",
        "Ownership mindset",
        "Customer obsession",
        "Innovation and growth",
      ],
    },
    {
      kicker: "Apply",
      title: "Ready to join?",
      text: "Send us a message with your background, experience, and the role you're interested in.",
      bullets: [
        "Share your background",
        "Highlight relevant experience",
        "Show your passion",
        "Tell us what drives you",
      ],
    },
  ],
  ctas: [
    { label: "Apply now", to: "/contact", variant: "primary" },
    { label: "About Luxe", to: "/about", variant: "secondary" },
  ],
  calloutTitle: "Ready to make an impact?",
  calloutText: "Join us in building the future of online retail. We'd love to hear from you.",
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export function AboutPage() { return <ContentPage {...aboutPage} />; }
export function ShippingPage() { return <ContentPage {...shippingPage} />; }
export function ReturnsPage() { return <ContentPage {...returnsPage} />; }
export function PrivacyPage() { return <ContentPage {...privacyPage} />; }
export function TermsPage() { return <ContentPage {...termsPage} />; }
export function AccessibilityPage() { return <ContentPage {...accessibilityPage} />; }
export function CookiesPage() { return <ContentPage {...cookiesPage} />; }
export function FaqPage() { return <ContentPage {...faqPage} />; }
export function CareersPage() { return <ContentPage {...careersPage} />; }
export { ContactPage };