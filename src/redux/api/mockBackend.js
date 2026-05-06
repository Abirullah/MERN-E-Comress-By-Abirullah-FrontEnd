const MOCK_DB_STORAGE_KEY = "mern-store-mock-db";
const MOCK_NETWORK_DELAY_MS = 180;

const EMPTY_PROFILE = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  accountDetails: "",
  profilePicture: "",
  preferences: "",
};

const cloneValue = (value) =>
  value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const toTitleCase = (value) =>
  normalizeText(value)
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getFallbackName = (email, fallbackLabel) => {
  const emailPrefix = normalizeText(email).split("@")[0];
  return toTitleCase(emailPrefix) || fallbackLabel;
};

const ensureEmail = (email, fallbackPrefix) => {
  const normalizedEmail = normalizeText(email).toLowerCase();
  if (normalizedEmail) {
    return normalizedEmail;
  }

  return `${fallbackPrefix}.${Date.now()}@demo.local`;
};

const createError = (status, message) => ({
  status,
  message,
});

const demoProducts = [
  {
    _id: "prod-aurora-runner",
    name: "Aurora Runner",
    brand: "Northline",
    category: "Running",
    description:
      "A lightweight knit runner with enough detail to prototype cards, filters, and long-form product copy.",
    price: 140,
    discountPrice: 118,
    countInStock: 18,
    gender: "Unisex",
    status: "In stock",
    isFeatured: true,
    tags: ["Breathable", "City", "Foam"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 7, color: "Cloud White", stock: 4 },
      { size: 8, color: "Graphite", stock: 6 },
      { size: 9, color: "Sunrise Coral", stock: 8 },
    ],
    reviews: [
      {
        _id: "review-aurora-1",
        user: "user-sara",
        name: "Sara Malik",
        rating: 5,
        comment: "Really clean layout for testing image grids and product copy.",
        createdAt: "2026-04-02T10:00:00.000Z",
      },
    ],
    wishlistedBy: ["user-sara"],
    createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    _id: "prod-dune-hiker",
    name: "Dune Hiker Mid",
    brand: "Terracore",
    category: "Boots",
    description:
      "A structured hiking boot with mixed materials and chunkier proportions for more dramatic product presentations.",
    price: 190,
    discountPrice: 0,
    countInStock: 11,
    gender: "Men",
    status: "In stock",
    isFeatured: false,
    tags: ["Trail", "Water resistant", "Grip"],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608256246200-53e8b47b2f80?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 8, color: "Sandstone", stock: 3 },
      { size: 9, color: "Olive", stock: 5 },
      { size: 10, color: "Black", stock: 3 },
    ],
    reviews: [],
    wishlistedBy: [],
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    _id: "prod-metro-court",
    name: "Metro Court Low",
    brand: "Atelier Pace",
    category: "Lifestyle",
    description:
      "A minimal leather sneaker that works well for testing clean product pages, tag pills, and compact metadata.",
    price: 160,
    discountPrice: 136,
    countInStock: 24,
    gender: "Women",
    status: "In stock",
    isFeatured: true,
    tags: ["Leather", "Minimal", "Everyday"],
    images: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 6, color: "Ivory", stock: 7 },
      { size: 7, color: "Stone", stock: 8 },
      { size: 8, color: "Black", stock: 9 },
    ],
    reviews: [
      {
        _id: "review-metro-1",
        user: "user-ali",
        name: "Ali Raza",
        rating: 4,
        comment: "Great for previewing the detail page spacing and typography.",
        createdAt: "2026-04-08T12:00:00.000Z",
      },
    ],
    wishlistedBy: ["user-ali"],
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    _id: "prod-summit-trainer",
    name: "Summit Trainer X",
    brand: "Northline",
    category: "Training",
    description:
      "A sturdier cross-training pair with a broad sole and bold color blocking for varied UI states.",
    price: 150,
    discountPrice: 129,
    countInStock: 15,
    gender: "Unisex",
    status: "In stock",
    isFeatured: false,
    tags: ["Gym", "Support", "Hybrid"],
    images: [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 7, color: "Steel", stock: 5 },
      { size: 8, color: "Lime", stock: 4 },
      { size: 9, color: "Navy", stock: 6 },
    ],
    reviews: [],
    wishlistedBy: [],
    createdAt: "2026-03-26T10:00:00.000Z",
  },
  {
    _id: "prod-night-stride",
    name: "Night Stride",
    brand: "Velo Studio",
    category: "Running",
    description:
      "A darker colorway with reflective details that helps preview cards against both warm and cool backgrounds.",
    price: 145,
    discountPrice: 0,
    countInStock: 21,
    gender: "Men",
    status: "In stock",
    isFeatured: false,
    tags: ["Reflective", "Road", "Comfort"],
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 8, color: "Black", stock: 6 },
      { size: 9, color: "Slate", stock: 8 },
      { size: 10, color: "Cobalt", stock: 7 },
    ],
    reviews: [],
    wishlistedBy: [],
    createdAt: "2026-04-03T10:00:00.000Z",
  },
  {
    _id: "prod-weekend-slip",
    name: "Weekend Slip",
    brand: "Maison Drift",
    category: "Slides",
    description:
      "An easy, low-profile slip-on that gives the catalog a softer product shape and a different content balance.",
    price: 70,
    discountPrice: 55,
    countInStock: 31,
    gender: "Women",
    status: "In stock",
    isFeatured: true,
    tags: ["Casual", "Soft", "Light"],
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { size: 6, color: "Cream", stock: 10 },
      { size: 7, color: "Rose", stock: 11 },
      { size: 8, color: "Tan", stock: 10 },
    ],
    reviews: [],
    wishlistedBy: [],
    createdAt: "2026-04-09T10:00:00.000Z",
  },
];

const createSeedDatabase = () => ({
  users: [
    {
      _id: "admin-store",
      username: "Store Admin",
      email: "admin@demo.com",
      password: "admin123",
      isAdmin: true,
      isActive: true,
      createdAt: "2026-01-12T09:00:00.000Z",
      Profile: null,
      wishlist: [],
    },
    {
      _id: "user-sara",
      username: "Sara Malik",
      email: "sara@demo.com",
      password: "demo123",
      isAdmin: false,
      isActive: true,
      createdAt: "2026-02-14T09:00:00.000Z",
      Profile: {
        firstName: "Sara",
        lastName: "Malik",
        address: "42 Model Town, Lahore",
        phoneNumber: "+92 300 1111111",
        accountDetails: "Prefers minimal styling and neutral color palettes.",
        profilePicture: "",
        preferences: "Sneakers, training shoes, warm neutrals",
      },
      wishlist: ["prod-aurora-runner"],
    },
    {
      _id: "user-ali",
      username: "Ali Raza",
      email: "ali@demo.com",
      password: "demo123",
      isAdmin: false,
      isActive: false,
      createdAt: "2026-02-26T09:00:00.000Z",
      Profile: {
        firstName: "Ali",
        lastName: "Raza",
        address: "18 DHA Phase 6, Karachi",
        phoneNumber: "+92 300 2222222",
        accountDetails: "",
        profilePicture: "",
        preferences: "Running shoes, darker tones",
      },
      wishlist: ["prod-metro-court"],
    },
    {
      _id: "user-zoya",
      username: "Zoya Khan",
      email: "zoya@demo.com",
      password: "demo123",
      isAdmin: false,
      isActive: true,
      createdAt: "2026-03-07T09:00:00.000Z",
      Profile: null,
      wishlist: [],
    },
  ],
  products: demoProducts,
  categories: [
    {
      _id: "cat-running",
      name: "Running",
      createdAt: "2026-03-01T09:00:00.000Z",
    },
    {
      _id: "cat-boots",
      name: "Boots",
      createdAt: "2026-03-01T09:01:00.000Z",
    },
    {
      _id: "cat-lifestyle",
      name: "Lifestyle",
      createdAt: "2026-03-01T09:02:00.000Z",
    },
    {
      _id: "cat-training",
      name: "Training",
      createdAt: "2026-03-01T09:03:00.000Z",
    },
    {
      _id: "cat-slides",
      name: "Slides",
      createdAt: "2026-03-01T09:04:00.000Z",
    },
  ],
});

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return cloneValue(safeUser);
};

const sanitizeProduct = (product) => cloneValue(product);

const readDatabase = () => {
  try {
    const storedValue = localStorage.getItem(MOCK_DB_STORAGE_KEY);

    if (!storedValue) {
      const seededDatabase = createSeedDatabase();
      localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(seededDatabase));
      return seededDatabase;
    }

    const parsedValue = JSON.parse(storedValue);

    if (
      !parsedValue ||
      !Array.isArray(parsedValue.users) ||
      !Array.isArray(parsedValue.products) ||
      !Array.isArray(parsedValue.categories)
    ) {
      throw new Error("Invalid mock database shape");
    }

    return parsedValue;
  } catch {
    const seededDatabase = createSeedDatabase();
    localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(seededDatabase));
    return seededDatabase;
  }
};

const writeDatabase = (database) => {
  localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(database));
};

const getRequestConfig = (args) => {
  if (typeof args === "string") {
    return {
      url: args,
      method: "GET",
      body: undefined,
    };
  }

  return {
    method: "GET",
    ...args,
  };
};

const getCurrentUser = (database, api) => {
  const currentUserId = api.getState()?.auth?.userInfo?._id;
  return database.users.find((user) => user._id === currentUserId) || null;
};

const requireUser = (database, api) => {
  const currentUser = getCurrentUser(database, api);

  if (!currentUser) {
    throw createError(401, "Please sign in to continue.");
  }

  return currentUser;
};

const requireAdmin = (database, api) => {
  const currentUser = requireUser(database, api);

  if (!currentUser.isAdmin) {
    throw createError(403, "Admin access is required for this action.");
  }

  return currentUser;
};

const findProduct = (database, productId) => {
  const product = database.products.find((item) => item._id === productId);

  if (!product) {
    throw createError(404, "Product not found.");
  }

  return product;
};

const findUser = (database, userId) => {
  const user = database.users.find((item) => item._id === userId);

  if (!user) {
    throw createError(404, "User not found.");
  }

  return user;
};

const findCategory = (database, categoryId) => {
  const category = database.categories.find((item) => item._id === categoryId);

  if (!category) {
    throw createError(404, "Category not found.");
  }

  return category;
};

const ensureCategoryExists = (database, categoryName) => {
  const normalizedCategory = normalizeText(categoryName);

  if (!normalizedCategory) {
    return;
  }

  const exists = database.categories.some(
    (category) => category.name.toLowerCase() === normalizedCategory.toLowerCase()
  );

  if (!exists) {
    database.categories.push({
      _id: buildId("cat"),
      name: normalizedCategory,
      createdAt: new Date().toISOString(),
    });
  }
};

const createUserRecord = (database, payload = {}) => {
  const nonAdminCount = database.users.filter((user) => !user.isAdmin).length + 1;
  const isAdmin = Boolean(payload.isAdmin);
  const fallbackPrefix = isAdmin ? "admin" : `shopper${nonAdminCount}`;
  const email = ensureEmail(payload.email, fallbackPrefix);
  const username =
    normalizeText(payload.username) ||
    getFallbackName(email, isAdmin ? "Admin Preview" : `Shopper ${nonAdminCount}`);

  return {
    _id: buildId(isAdmin ? "admin" : "user"),
    username,
    email,
    password: normalizeText(payload.password) || (isAdmin ? "admin123" : "demo123"),
    isAdmin,
    isActive: true,
    createdAt: new Date().toISOString(),
    Profile: isAdmin ? null : null,
    wishlist: [],
  };
};

const handleRegisterUser = (database, body) => {
  const email = ensureEmail(body?.email, "shopper");
  const existingUser = database.users.find(
    (user) => !user.isAdmin && user.email.toLowerCase() === email
  );

  if (existingUser) {
    existingUser.username =
      normalizeText(body?.username) || existingUser.username || getFallbackName(email, "Shopper");
    existingUser.password = normalizeText(body?.password) || existingUser.password;
    existingUser.isActive = true;
    writeDatabase(database);
    return sanitizeUser(existingUser);
  }

  const newUser = createUserRecord(database, {
    username: body?.username,
    email,
    password: body?.password,
  });

  database.users.unshift(newUser);
  writeDatabase(database);
  return sanitizeUser(newUser);
};

const handleLoginUser = (database, body) => {
  const email = normalizeText(body?.email).toLowerCase();
  let targetUser = null;

  if (email) {
    targetUser = database.users.find(
      (user) => !user.isAdmin && user.email.toLowerCase() === email
    );
  } else {
    targetUser = database.users.find((user) => !user.isAdmin) || null;
  }

  if (!targetUser) {
    targetUser = createUserRecord(database, {
      email,
      password: body?.password,
    });
    database.users.unshift(targetUser);
  } else if (normalizeText(body?.password)) {
    targetUser.password = normalizeText(body.password);
  }

  targetUser.isActive = true;
  writeDatabase(database);
  return sanitizeUser(targetUser);
};

const handleLoginAdmin = (database, body) => {
  const email = normalizeText(body?.email).toLowerCase();
  let targetAdmin = null;

  if (email) {
    targetAdmin = database.users.find(
      (user) => user.isAdmin && user.email.toLowerCase() === email
    );
  } else {
    targetAdmin = database.users.find((user) => user.isAdmin) || null;
  }

  if (!targetAdmin) {
    targetAdmin = createUserRecord(database, {
      username: body?.email ? getFallbackName(body.email, "Admin Preview") : "Admin Preview",
      email,
      password: body?.password,
      isAdmin: true,
    });
    database.users.unshift(targetAdmin);
  } else if (normalizeText(body?.password)) {
    targetAdmin.password = normalizeText(body.password);
  }

  targetAdmin.isActive = true;
  writeDatabase(database);
  return sanitizeUser(targetAdmin);
};

const handleGetProfile = (database, api) => {
  const currentUser = requireUser(database, api);
  return sanitizeUser(currentUser);
};

const handleUpdateProfile = (database, api, body) => {
  const currentUser = requireUser(database, api);

  currentUser.username = normalizeText(body?.username) || currentUser.username;
  currentUser.email = ensureEmail(body?.email || currentUser.email, "shopper");

  if (normalizeText(body?.password)) {
    currentUser.password = normalizeText(body.password);
  }

  if (body?.Profile) {
    currentUser.Profile = {
      ...EMPTY_PROFILE,
      ...(currentUser.Profile || {}),
      ...Object.fromEntries(
        Object.entries(body.Profile).map(([field, value]) => [
          field,
          typeof value === "string" ? value : "",
        ])
      ),
    };
  }

  writeDatabase(database);
  return sanitizeUser(currentUser);
};

const handleGetProducts = (database, api) => {
  requireUser(database, api);

  return database.products
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(sanitizeProduct);
};

const handleGetProductById = (database, api, productId) => {
  requireUser(database, api);
  return sanitizeProduct(findProduct(database, productId));
};

const handleToggleWishlist = (database, api, productId) => {
  const currentUser = requireUser(database, api);
  const product = findProduct(database, productId);
  const alreadyWishlisted = product.wishlistedBy.includes(currentUser._id);

  if (alreadyWishlisted) {
    product.wishlistedBy = product.wishlistedBy.filter((id) => id !== currentUser._id);
    currentUser.wishlist = (currentUser.wishlist || []).filter((id) => id !== productId);
  } else {
    product.wishlistedBy = [...product.wishlistedBy, currentUser._id];
    currentUser.wishlist = [...(currentUser.wishlist || []), productId];
  }

  writeDatabase(database);

  return {
    message: alreadyWishlisted
      ? "Removed from wishlist in local preview mode"
      : "Added to wishlist in local preview mode",
    product: sanitizeProduct(product),
  };
};

const handleCreateReview = (database, api, productId, body) => {
  const currentUser = requireUser(database, api);
  const product = findProduct(database, productId);
  const review = {
    _id: buildId("review"),
    user: currentUser._id,
    name: currentUser.username,
    rating: Number(body?.rating) || 5,
    comment:
      normalizeText(body?.comment) || "Preview review saved from the local mock store.",
    createdAt: new Date().toISOString(),
  };

  product.reviews = [review, ...(product.reviews || [])];
  writeDatabase(database);

  return {
    message: "Review saved locally",
    review: cloneValue(review),
  };
};

const handleGetAdminUsers = (database, api) => {
  requireAdmin(database, api);

  return database.users
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(sanitizeUser);
};

const handleGetAdminUserById = (database, api, userId) => {
  requireAdmin(database, api);
  return sanitizeUser(findUser(database, userId));
};

const handleSetUserStatus = (database, api, userId, isActive) => {
  requireAdmin(database, api);
  const user = findUser(database, userId);

  user.isActive = isActive;
  writeDatabase(database);

  return {
    message: `${user.username} ${isActive ? "activated" : "deactivated"} locally`,
    user: sanitizeUser(user),
  };
};

const handleCreateAdminProduct = (database, api, body) => {
  requireAdmin(database, api);

  const newProduct = {
    _id: buildId("prod"),
    name: normalizeText(body?.name) || "Preview Product",
    brand: normalizeText(body?.brand) || "Demo Brand",
    category: normalizeText(body?.category) || "Uncategorized",
    description:
      normalizeText(body?.description) ||
      "Locally created preview product for frontend development.",
    price: Number(body?.price) || 120,
    discountPrice: Number(body?.discountPrice) || 0,
    countInStock: Number(body?.countInStock) || 10,
    gender: normalizeText(body?.gender) || "Unisex",
    status: normalizeText(body?.status) || "In stock",
    isFeatured: Boolean(body?.isFeatured),
    tags: Array.isArray(body?.tags) ? body.tags : [],
    images:
      Array.isArray(body?.images) && body.images.length > 0
        ? body.images
        : [
            "https://via.placeholder.com/1200x900?text=Preview+Product",
            "https://via.placeholder.com/1200x900?text=Preview+Product",
            "https://via.placeholder.com/1200x900?text=Preview+Product",
            "https://via.placeholder.com/1200x900?text=Preview+Product",
          ],
    variants: Array.isArray(body?.variants) ? body.variants : [],
    reviews: [],
    wishlistedBy: [],
    createdAt: new Date().toISOString(),
  };

  ensureCategoryExists(database, newProduct.category);
  database.products.unshift(newProduct);
  writeDatabase(database);

  return sanitizeProduct(newProduct);
};

const handleUpdateAdminProduct = (database, api, productId, body) => {
  requireAdmin(database, api);
  const product = findProduct(database, productId);

  Object.assign(product, body);
  product.name = normalizeText(product.name) || "Preview Product";
  product.brand = normalizeText(product.brand) || "Demo Brand";
  product.category = normalizeText(product.category) || "Uncategorized";
  product.description =
    normalizeText(product.description) ||
    "Locally updated preview product for frontend development.";
  product.price = Number(product.price) || 120;
  product.discountPrice = Number(product.discountPrice) || 0;
  product.countInStock = Number(product.countInStock) || 0;
  product.gender = normalizeText(product.gender) || "Unisex";
  product.status = normalizeText(product.status) || "In stock";
  product.tags = Array.isArray(product.tags) ? product.tags : [];
  product.images = Array.isArray(product.images) ? product.images : [];
  product.variants = Array.isArray(product.variants) ? product.variants : [];

  ensureCategoryExists(database, product.category);
  writeDatabase(database);
  return sanitizeProduct(product);
};

const handleDeleteAdminProduct = (database, api, productId) => {
  requireAdmin(database, api);
  const index = database.products.findIndex((product) => product._id === productId);

  if (index === -1) {
    throw createError(404, "Product not found.");
  }

  const [deletedProduct] = database.products.splice(index, 1);
  writeDatabase(database);

  return sanitizeProduct(deletedProduct);
};

const handleFetchCategories = (database) =>
  database.categories
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((category) => cloneValue(category));

const handleCreateCategory = (database, body) => {
  const baseName = normalizeText(body?.name);
  const category = {
    _id: buildId("cat"),
    name: baseName || `Category ${database.categories.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  database.categories.push(category);
  writeDatabase(database);
  return cloneValue(category);
};

const handleUpdateCategory = (database, categoryId, body) => {
  const category = findCategory(database, categoryId);
  category.name = normalizeText(body?.name) || category.name;
  writeDatabase(database);
  return cloneValue(category);
};

const handleDeleteCategory = (database, categoryId) => {
  const index = database.categories.findIndex((item) => item._id === categoryId);

  if (index === -1) {
    throw createError(404, "Category not found.");
  }

  const [deletedCategory] = database.categories.splice(index, 1);
  writeDatabase(database);
  return cloneValue(deletedCategory);
};

const handleMockRequest = (request, api) => {
  const database = readDatabase();
  const pathname = new URL(request.url, "https://mock.store.local").pathname;
  const method = request.method.toUpperCase();

  if (pathname === "/api/users/register" && method === "POST") {
    return handleRegisterUser(database, request.body);
  }

  if (pathname === "/api/users/login" && method === "POST") {
    return handleLoginUser(database, request.body);
  }

  if (pathname === "/api/users/logout" && method === "POST") {
    return { message: "User session cleared from local preview mode" };
  }

  if (pathname === "/api/users/profile" && method === "GET") {
    return handleGetProfile(database, api);
  }

  if (pathname === "/api/users/profile" && method === "PUT") {
    return handleUpdateProfile(database, api, request.body);
  }

  if (pathname === "/api/users/products" && method === "GET") {
    return handleGetProducts(database, api);
  }

  if (pathname.startsWith("/api/users/products/") && method === "GET") {
    const productId = pathname.split("/")[4];
    return handleGetProductById(database, api, productId);
  }

  if (pathname.endsWith("/wishlist") && method === "POST") {
    const productId = pathname.split("/")[4];
    return handleToggleWishlist(database, api, productId);
  }

  if (pathname.endsWith("/reviews") && method === "POST") {
    const productId = pathname.split("/")[4];
    return handleCreateReview(database, api, productId, request.body);
  }

  if (pathname === "/api/admin/login" && method === "POST") {
    return handleLoginAdmin(database, request.body);
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    return { message: "Admin session cleared from local preview mode" };
  }

  if (pathname === "/api/admin/users" && method === "GET") {
    return handleGetAdminUsers(database, api);
  }

  if (pathname.startsWith("/api/admin/users/") && method === "GET") {
    const userId = pathname.split("/")[4];
    return handleGetAdminUserById(database, api, userId);
  }

  if (pathname.endsWith("/activate") && method === "PUT") {
    const userId = pathname.split("/")[4];
    return handleSetUserStatus(database, api, userId, true);
  }

  if (pathname.endsWith("/deactivate") && method === "PUT") {
    const userId = pathname.split("/")[4];
    return handleSetUserStatus(database, api, userId, false);
  }

  if (pathname === "/api/admin/products" && method === "POST") {
    return handleCreateAdminProduct(database, api, request.body);
  }

  if (pathname.startsWith("/api/admin/products/") && method === "PUT") {
    const productId = pathname.split("/")[4];
    return handleUpdateAdminProduct(database, api, productId, request.body);
  }

  if (pathname.startsWith("/api/admin/products/") && method === "DELETE") {
    const productId = pathname.split("/")[4];
    return handleDeleteAdminProduct(database, api, productId);
  }

  if (pathname === "/api/category/categories" && method === "GET") {
    return handleFetchCategories(database);
  }

  if (pathname === "/api/category" && method === "POST") {
    return handleCreateCategory(database, request.body);
  }

  if (pathname.startsWith("/api/category/") && method === "PUT") {
    const categoryId = pathname.split("/")[3];
    return handleUpdateCategory(database, categoryId, request.body);
  }

  if (pathname.startsWith("/api/category/") && method === "DELETE") {
    const categoryId = pathname.split("/")[3];
    return handleDeleteCategory(database, categoryId);
  }

  throw createError(404, `No local mock route exists for ${method} ${pathname}`);
};

export const mockBaseQuery = async (args, api) => {
  await wait(MOCK_NETWORK_DELAY_MS);

  try {
    const request = getRequestConfig(args);
    const data = handleMockRequest(request, api);
    return { data: cloneValue(data) };
  } catch (error) {
    return {
      error: {
        status: error?.status || 500,
        data: {
          message: error?.message || "Local mock request failed.",
        },
      },
    };
  }
};
