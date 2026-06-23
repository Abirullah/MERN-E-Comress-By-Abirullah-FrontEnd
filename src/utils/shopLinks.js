export const buildShopLink = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = String(value).trim();
    if (!normalizedValue) {
      return;
    }

    searchParams.set(key, normalizedValue);
  });

  const query = searchParams.toString();
  return query ? `/shop?${query}` : "/shop";
};

export const normalizeFilterValue = (value) =>
  String(value ?? "").trim().toLowerCase();

export const normalizeBrandValue = (value) =>
  normalizeFilterValue(value).replace(/[^a-z0-9]/g, "");

export const formatFilterLabel = (value) =>
  String(value ?? "")
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
