// src/RemoteService/Remoteservice.js
import axios from 'axios';

const remote = {
  // address: 'http://127.0.0.1:8000/api/',
  address: "https://backendshop-oy2c.onrender.com/api/",
};

const getAccessToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const setTokens = (access, refresh) => {
  localStorage.setItem('token', access);
  localStorage.setItem('refresh_token', refresh);
};

const removeTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

const requestHeaders = (isFormData = false) => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    Accept: 'application/json',
  };
};

// Attempt to refresh access token using the stored refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const { data } = await axios.post(
      `${remote.address}account/token/refresh/`,
      { refresh: refreshToken }
    );

    if (data.access && data.refresh) {
      setTokens(data.access, data.refresh);
      return data.access;
    }
  } catch (err) {
    console.error('Failed to refresh token:', err);
    // optionally: removeTokens();
  }
  return null;
};

// Create an axios instance
const axiosInstance = axios.create();

// Always inject Authorization header if token exists
axiosInstance.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

// On 401, try to get a new access token and retry once
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Generic wrappers
const getRequest = async api =>
  axiosInstance
    .get(`${remote.address}${api}`, { headers: requestHeaders() })
    

const postRequest = async (api, data, isFormData = false) =>
  axiosInstance
    .post(`${remote.address}${api}`, data, { headers: requestHeaders(isFormData) })
    

// FIXED: no body, headers in config
const postRequestNoData = async (api, isFormData = false) =>
  axiosInstance
    .post(`${remote.address}${api}`, null, { headers: requestHeaders(isFormData) })
    

const putRequest = async (api, data, isFormData = false) =>
  axiosInstance
    .put(`${remote.address}${api}`, data, { headers: requestHeaders(isFormData) })
    

const deleteRequest = async api =>
  axiosInstance
    .delete(`${remote.address}${api}`, { headers: requestHeaders() })
    

// RemoteServices
const RemoteServices = {
  // store tokens on login
  loginPost: async credentials => {
    const data = await postRequest('account/userlogin/', credentials);
  
    return data;
  },

  logout: () => removeTokens(),
  register: data => postRequest('account/register/', data),
  updateProfile: data => putRequest('account/update/profile/', data),
  googleLogin: data => postRequest('account/auth/google/login/', data),
  forgottenPassword: data => postRequest('account/requestOttp/', data),
  verfiyOtpPassord: data => postRequest('account/resetpassword/', data),

  // Inventory
  productList: () => getRequest('inventory/products/'),
  orderPlaced: data => postRequest('inventory/ordersplaced/', data),
  orderPlacedAllDetails: () => getRequest('inventory/orders/'),
  productUpdate: (formData, id) =>
    putRequest(`inventory/products/update/${id}/`, formData, true),
  productDelete: id => deleteRequest(`inventory/products/delete/${id}/`),
  getById: id => getRequest(`inventory/products/${id}/`),

  // Filters
  filterProductCategories: category =>
    getRequest(`inventory/products/?category=${category}&stock=true`),
  newarivalProductCategories: () =>
    getRequest('inventory/products/?isNew=true&stock=true'),
  filterProductStatus: status =>
    getRequest(`inventory/products/?status=${status}`),
  filterProductSearch: term =>
    getRequest(`inventory/products/?search=${term}`),

  getOderdetailsbyId: id => getRequest(`inventory/orders/${id}/`),

  createReviewOnProduct: data => postRequest('inventory/createreview/', data),
  like_on_product_review: id =>
    postRequestNoData(`inventory/reviews/${id}/like/`),
  getReviewOnProduct: id => getRequest(`inventory/reviews/${id}/`),

  getwishlistfile: () => getRequest('inventory/wishlist/get/'),
  deletewishlistfile: id =>
    deleteRequest(`inventory/wishlist/delete/?product_id=${id}`),
  createwishlist: data => postRequest('inventory/wishlist/add/', data),
  createcartlist: data => postRequest('inventory/cart/add/', data),

  getnotificationHistory: () => getRequest('notifications/history/'),
  postnoficationread: () =>
    postRequestNoData('notifications/read-all/'),
  getTopCatogires: () => getRequest('inventory/top-by-category/'),
};

export default RemoteServices;
