import API from "../../../Service/Axios";

export const fetchProductsAPI = async () => {
  const response = await API.get("/users/products");
  return response.data;
};

export const fetchProductByIdAPI = async (productId) => {
  const response = await API.get(`/users/products/${productId}`);
  return response.data;
};

export const toggleWishlistAPI = async (productId) => {
  const response = await API.post(`/users/products/${productId}/wishlist`);
  return response.data;
};

export const createProductReviewAPI = async (productId, reviewData) => {
  const response = await API.post(
    `/users/products/${productId}/reviews`,
    reviewData
  );
  return response.data;
};

export const fetchwishlist = async (userId) => {
  const response = await API.get(`/users/${userId}/wishlist`);
  return response.data;
};

export const createCheckoutSessionAPI = async (orderData = {}) => {
  const productId = orderData?.productId || orderData?.id;

  if (!productId) {
    throw new Error("Product id is required to start checkout");
  }

  const quantity = Number(orderData?.quantity || 1);
  const response = await API.post(`/users/products/${productId}/checkout`, {
    quantity,
  });
  return response.data;
};

export const createOrderAPI = createCheckoutSessionAPI;

export const fetchOrdersAPI = async (userId) => {
  if (!userId) {
    throw new Error("User id is required to load orders");
  }

  const response = await API.get(`/users/orders`);
  return response.data;
};
