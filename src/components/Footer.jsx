import {
  Globe,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "/shop?sort=newest" },
      { label: "Best Sellers", to: "/shop?sort=popular" },
      { label: "Men", to: "/shop?gender=men" },
      { label: "Women", to: "/shop?gender=women" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Our Story", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", to: "/" },
      { label: "Returns", to: "/" },
      { label: "FAQs", to: "/" },
      { label: "Track Order", to: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/" },
      { label: "Terms", to: "/" },
      { label: "Accessibility", to: "/" },
      { label: "Cookies", to: "/" },
    ],
  },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4a544]">
        {title}
      </h3>

      <ul className="mt-5 space-y-3 text-sm text-[#6b6666]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="transition hover:text-[#d4a544]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1.85fr]">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-black tracking-[0.28em] text-[#ddd4be]">
                  LUXE
                </p>
                <Sparkles size={20} className="text-[#d4a544]" />
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#6b6666]">
                Premium sneakers and everyday footwear designed for clean
                silhouettes, comfort, and a sharper finish.
              </p>
            </div>

            {/* Social/Quick Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, label: "Website", href: "/" },
                { icon: ShoppingBag, label: "Shop", href: "/shop" },
                { icon: Package, label: "Packages", href: "/" },
                { icon: ArrowUpRight, label: "Explore", href: "/shop" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] text-[#5a5a5a] transition-all duration-300 hover:border-[#d4a544]/50 hover:text-[#d4a544] hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Email */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] px-4 py-3 text-sm text-[#6b6666] shadow-sm transition-all duration-300 hover:border-[#d4a544]/30">
              <Mail size={16} className="shrink-0 text-[#d4a544]" />
              <span>hello@luxe.com</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerGroups.map((group) => (
              <FooterColumn
                key={group.title}
                title={group.title}
                links={group.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#1e1e1e] pt-6 text-sm text-[#5a5a5a] md:flex-row md:items-center md:justify-between">
          <p className="text-[11px]">© 2026 LUXE. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
              <span
                key={method}
                className="rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a5a5a] hover:border-[#d4a544]/30 hover:text-[#d4a544] transition-all duration-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;