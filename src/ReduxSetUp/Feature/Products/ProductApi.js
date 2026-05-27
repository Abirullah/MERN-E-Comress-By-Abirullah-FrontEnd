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
