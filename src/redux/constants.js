const apiUrl = import.meta.env.VITE_API_URL?.trim();

export const BASE_URL = apiUrl ? apiUrl.replace(/\/$/, "") : "";
export const USE_LOCAL_MOCK =
  import.meta.env.VITE_USE_LOCAL_MOCK !== "false";
export const USERS_URL = "/api/users";
export const ADMIN_URL = "/api/admin";
export const PRODUCTS_URL = `${USERS_URL}/products`;
export const CATEGORY_URL = "/api/category";
