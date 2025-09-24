import api from './api';

export const login = (username, password) =>
  api.post('/users/login', { username, password });

export const signup = (username, password) =>
  api.post('/users/signup', { username, password });

export const logout = () =>
  api.post('/users/logout');

export const getProfile = () =>
  api.get('/users/profile');
