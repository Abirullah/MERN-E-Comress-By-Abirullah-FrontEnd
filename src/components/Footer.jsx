import {
  Globe,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Mail,
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
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
        {title}
      </h3>

      <ul className="mt-5 space-y-3 text-sm text-slate-500">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="transition hover:text-slate-950"
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
    <footer className="border-t border-slate-200 bg-[#f7f5ef] text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1.85fr]">
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-black tracking-[0.28em] text-slate-950">
                LUXE
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                Premium sneakers and everyday footwear designed for clean
                silhouettes, comfort, and a sharper finish.
              </p>
            </div>

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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              <Mail size={16} className="shrink-0 text-slate-400" />
              <span>hello@luxe.com</span>
            </div>
          </div>

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

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 LUXE. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
              <span
                key={method}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
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
