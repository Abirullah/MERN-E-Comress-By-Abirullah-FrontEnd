import React from "react";

function Footer() {
  return (
    <footer className="bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Side */}
          <div>
            <h2 className="text-3xl font-bold text-teal-600">
              YourBrand
            </h2>

            <p className="mt-4 max-w-xs text-gray-500 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Molestias, accusantium.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:bg-teal-600 hover:text-white"
              >
                Facebook
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:bg-teal-600 hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:bg-teal-600 hover:text-white"
              >
                Twitter
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:bg-teal-600 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {/* Services */}
            <div>
              <h3 className="font-semibold text-gray-900">Services</h3>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    1on1 Coaching
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Company Review
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Accounts Review
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    HR Consulting
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    SEO Optimisation
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900">Company</h3>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    About
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Meet the Team
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Helpful Links */}
            <div>
              <h3 className="font-semibold text-gray-900">Helpful Links</h3>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Contact
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    FAQs
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900">Legal</h3>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Accessibility
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Returns Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Refund Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="transition hover:text-teal-600">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © 2026 YourBrand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;