import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use relative path or change to your backend base URL
      const res = await axios.post('/api/users/login', form, { withCredentials: true });
      // IMPORTANT: adapt to whatever your backend returns (token/user)
      const token = res?.data?.token;
      const user = res?.data?.user || { username: form.username };

      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.setItem('user', JSON.stringify(user));
      // let header re-render read localStorage (Header reads it) and redirect
      setLoading(false);
      navigate('/profile'); // or '/' as you prefer
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text" required
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value})}
        />
        <input
          type="password" required
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button type="submit" className="px-6 py-3 bg-primary text-white rounded hover:bg-orange-600 transition flex items-center justify-center" disabled={loading}>
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : null}
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {error ? <p className="mt-4 text-red-400">{error}</p> : null}
    </div>
  );
};

export default Login;
