import axios from 'axios';

const API = axios.create({
  baseURL: 'https://foodweb-goen.onrender.com' // Live backend URL
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
}

// Initialize token from localStorage on import
const token = localStorage.getItem('flavornest_token');
if (token) setAuthToken(token);

export default API;
