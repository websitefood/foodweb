import axios from 'axios';

const API = axios.create({
  baseURL: 'https://flavornest.onrender.com/' // live backend URL
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
}

// Init token from localStorage
const token = localStorage.getItem('flavornest_token');
if (token) setAuthToken(token);

export default API;
