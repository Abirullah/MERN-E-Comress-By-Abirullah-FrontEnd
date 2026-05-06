import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const primaryAction = userInfo?.isAdmin
    ? { to: "/admin/users", label: "Open admin tools" }
    : userInfo
      ? { to: "/shop", label: "Browse products" }
      : { to: "/login", label: "Sign in as shopper" };

  const secondaryAction = userInfo?.isAdmin
    ? { to: "/", label: "Review preview notes" }
    : userInfo
      ? { to: "/profile", label: "Update profile" }
      : { to: "/admin/login", label: "Admin sign in" };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="app-card overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <span className="muted-chip">Frontend first preview mode</span>
            <div className="space-y-4">
              <h1 className="page-title">
                The UI now runs on local preview data so you can finish the
                product experience before backend integration.
              </h1>
              <p className="section-copy max-w-2xl">
                Auth, profile updates, product browsing, wishlists, reviews,
                and admin user management all persist in local storage for fast
                frontend iteration.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={primaryAction.to} className="primary-button">
                {primaryAction.label}
              </Link>
              <Link to={secondaryAction.to} className="secondary-button">
                {secondaryAction.label}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700">
                  User routes
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Register, sign in, profile updates, products, reviews, and
                  wishlist actions.
                </p>
              </div>
              <div className="rounded-3xl bg-sky-50 p-4">
                <p className="text-sm font-semibold text-sky-700">
                  Admin routes
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Separate admin login and local user-management controls for
                  previewing the dashboard flow.
                </p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">
                  Local storage
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  The preview store keeps accounts, products, reviews, and
                  admin actions in the browser.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              Ready for UI work now
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-lg font-semibold">Dummy auth flow</p>
                <p className="mt-2 text-sm text-slate-200">
                  Sign in, register, and logout all work without a live backend.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-lg font-semibold">Editable mock data</p>
                <p className="mt-2 text-sm text-slate-200">
                  Reviews, wishlists, profiles, and admin actions write back to
                  local preview records.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-lg font-semibold">Switchable later</p>
                <p className="mt-2 text-sm text-slate-200">
                  The UI still uses the shared API layer, so you can reconnect
                  the real backend when you are ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="app-card p-6">
          <p className="text-lg font-bold text-slate-900">Current session</p>
          <p className="mt-3 text-sm text-slate-600">
            {userInfo
              ? `${userInfo.username} is signed in through the ${
                  userInfo.isAdmin ? "admin" : "user"
                } flow.`
              : "No local session is loaded yet."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {!userInfo && (
              <>
                <Link to="/register" className="primary-button">
                  Create user account
                </Link>
                <Link to="/admin/login" className="secondary-button">
                  Admin area
                </Link>
              </>
            )}
            {userInfo && !userInfo.isAdmin && (
              <>
                <Link to="/shop" className="primary-button">
                  Open shop
                </Link>
                <Link to="/profile" className="secondary-button">
                  Edit profile
                </Link>
              </>
            )}
            {userInfo?.isAdmin && (
              <Link to="/admin/users" className="primary-button">
                Manage users
              </Link>
            )}
          </div>
        </div>

        <div className="app-card p-6">
          <p className="text-lg font-bold text-slate-900">Integration notes</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>User and admin preview sessions are saved locally instead of calling a live API.</li>
            <li>Dummy products, reviews, categories, and user records are seeded automatically in local storage.</li>
            <li>You can switch back to the real backend later by disabling the local mock flag.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Home;
