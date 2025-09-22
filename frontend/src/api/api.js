import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
}

// Init from localStorage on import
const token = localStorage.getItem('flavornest_token');
if (token) setAuthToken(token);

export default API;
