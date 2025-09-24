import axios from 'axios';

const API_URL = 'https://flavornest.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies for session auth
});

export default api;
