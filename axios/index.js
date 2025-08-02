import axios from 'axios';

const API = axios.create({
  baseURL: `https://movie.pythonanywhere.com/api/v1/`,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('__token_');
    if (token) {
      config.headers['Authorization'] = '_Token ' + token;
    }
    return config;
  },
  (err) => {
    return err;
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err && err?.response?.status === 401)
      localStorage.removeItem('__token_');
    return Promise.reject(err);
  }
);

export default API;
