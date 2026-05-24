const getFallbackName = (email) => email?.split("@")[0] || "Account";

export const normalizeUserSession = (user) => ({
  _id: user?._id,
  username: user?.username || getFallbackName(user?.email),
  email: user?.email || "",
  isAdmin: false,
  accountType: "user",
  Profile: user?.Profile || null,
});

export const normalizeAdminSession = (admin) => ({
  _id: admin?._id,
  username:
    admin?.username || admin?.name || getFallbackName(admin?.email),
  email: admin?.email || "",
  isAdmin: true,
  accountType: "admin",
});