import axios from 'axios';
import { get } from 'http';

const remote = {
  // address: 'http://127.0.0.1:8000/api/', 
  address: 'https://backendshop-production-0a96.up.railway.app/api/', 
  
};

const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const setTokens = (access, refresh) => {
  localStorage.setItem("token", access);
  localStorage.setItem("refresh_token", refresh);
};

const removeTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

const requestHeaders = (isFormData = false) => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    Accept: 'application/json',
  };
};

// Refresh token request
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${remote.address}account/token/refresh/`, {
      refresh: refreshToken,
    });

    if (response.data.access) {
      setTokens(response.data.access, response.data.refresh);
      return response.data.access;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    removeTokens(); // Clear tokens if refresh fails
    return null;
  }
};

// Axios instance with interceptor for refreshing tokens
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response, // Return response if no errors
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// API Request Functions
const getRequest = async (api) => {
  try {
    return await axiosInstance.get(`${remote.address}${api}`, { headers: requestHeaders() });
  } catch (error) {
    return Promise.reject(error?.response?.data || 'Error');
  }
};

const postRequest = async (api, data, isFormData = false) => {
  try {
    return await axiosInstance.post(`${remote.address}${api}`, data, { headers: requestHeaders(isFormData) });
  } catch (error) {
    return Promise.reject(error?.response?.data || 'Error');
  }
};

const putRequest = async (api, data, isFormData = false) => {
  try {
    return await axiosInstance.put(`${remote.address}${api}`, data, { headers: requestHeaders(isFormData) });
  } catch (error) {
    return Promise.reject(error?.response?.data || 'Error');
  }
};

const deleteRequest = async (api) => {
  try {
    return await axiosInstance.delete(`${remote.address}${api}`, { headers: requestHeaders() });
  } catch (error) {
    return Promise.reject(error?.response?.data || 'Error');
  }
};

// RemoteServices Object
const RemoteServices = {
  loginPost: async (data) => {
    const response = await postRequest("account/userlogin/", data);
    if (response.data.access && response.data.refresh) {
      setTokens(response.data.access, response.data.refresh);
    }
    return response;
  },
  logout: () => {
    removeTokens();
  },
  register: (data) => postRequest("account/register/", data),
  googleLogin: (data) => postRequest("account/auth/google/login/", data),
  forgottenPassword: (data) => postRequest("account/requestOttp/", data),
  verfiyOtpPassord: (data) => postRequest("account/resetpassword/", data),
  // Inventory APIs
  productList: () => getRequest("inventory/products/"),
  orderPlaced: (data) => postRequest("inventory/ordersplaced/", data),
  orderPlacedAllDetails: () => getRequest("inventory/orders/"),
  productUpdate: (data, id) => putRequest(`inventory/products/update/${id}/`, data, true),
  productDelete: (productId) => deleteRequest(`inventory/products/delete/${productId}/`),
  getById: (id) => getRequest(`inventory/products/${id}/`),
  
  // Filters
  filterProductCategories: (data) => getRequest(`inventory/products/?category=${data}&stock=true`),
  filterProductStatus: (data) => getRequest(`inventory/products/?status=${data}`),
  filterProductSearch: (data) => getRequest(`inventory/products/?name=${data}`),


  getOderdetailsbyId: (id) => getRequest(`inventory/orders/${id}/`),

  createReviewOnProduct: (data) => postRequest("inventory/createreview/", data),
  getReviewOnProduct: (id) => getRequest(`inventory/reviews/${id}/`),


  getwishlistfile: () => getRequest(`inventory/wishlist/get/`),
  deletewishlistfile: (id) => deleteRequest(`inventory/wishlist/delete/?product_id=${id}`),

  createwishlist :(data)=>postRequest("inventory/wishlist/add/", data),
  createcartlist :(data)=>postRequest("inventory/wishlist/add/", data),
};

export default RemoteServices;
