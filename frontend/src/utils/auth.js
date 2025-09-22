import API, { setAuthToken } from '../api/api';

export async function signup({ name, email, password }) {
  const r = await API.post('/auth/signup', { name, email, password });
  const { token, user } = r.data;
  if (token) {
    localStorage.setItem('flavornest_token', token);
    setAuthToken(token);
  }
  return r.data;
}

export async function login({ email, password }) {
  const r = await API.post('/auth/login', { email, password });
  const { token, user } = r.data;
  if (token) {
    localStorage.setItem('flavornest_token', token);
    setAuthToken(token);
  }
  return r.data;
}

export function logout() {
  localStorage.removeItem('flavornest_token');
  setAuthToken(null);
}
