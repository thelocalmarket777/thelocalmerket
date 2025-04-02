import axios from 'axios';

const remote = {
  address: 'http://127.0.0.1:8000/api/', // Ensure this points to your backend API
};

const getToken = () => {
  const token = localStorage.getItem("token");
  return token && token.length > 0 ? token : null;
};

const requestHeaders = (isFormData = false) => {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    Accept: 'application/json',
  };
};

const handleError = (error) => {
  return Promise.reject(error?.response?.data?.Message || error?.response?.data || error?.response || 'Error Message Not Handled');
};

async function getRequest(api) {
  try {
    const response = await axios.get(`${remote.address}${api}`, {
      headers: requestHeaders(),
    });
    return response
  } catch (error) {
    return handleError(error);
  }
}

async function postRequest(api, data, isFormData = false) {
  try {
    const response = await axios.post(`${remote.address}${api}`, data, {
      headers: requestHeaders(isFormData),
    });
    return response
  } catch (error) {
    return handleError(error);
  }
}

async function putRequest(api, data,isFormData = false) {
  try {
    const response = await axios.put(`${remote.address}${api}`, data, {
      headers: requestHeaders(isFormData),
    });
    return response
  } catch (error) {
    return handleError(error);
  }
}

async function patchRequest(api, data) {
  try {
    const response = await axios.patch(`${remote.address}${api}`, data, {
      headers: requestHeaders(),
    });
    return response
  } catch (error) {
    return handleError(error);
  }
}

async function deleteRequest(api) {
  try {
    const response = await axios.delete(`${remote.address}${api}`, {
      headers: requestHeaders(),
    });
    return response
  } catch (error) {
    return handleError(error);
  }
}

const RemoteServices = {
  loginPost: (data) => postRequest("account/userlogin/", data),
  register: (data) => postRequest("account/register/", data),
  
  productAdd: (data) => postRequest("inventory/products/add/", data, true),
  
  productList: () => getRequest("inventory/products/"),
  productUpdate: (data,id) => putRequest(`inventory/products/update/${id}/`, data, true),
  productDelete: (productId) => deleteRequest(`inventory/products/delete/${productId}/`),
  filterproductCatagories: (data) => getRequest(`inventory/products/?category=${data}`),
  getById:(id)=>getRequest(`inventory/products/${id}/`),

  filterproductStatus: (data) => getRequest(`inventory/products/?status=${data}`),

  filterproductSearch: (data) => getRequest(`inventory/products/?name=${data}`),

};

export default RemoteServices;
     