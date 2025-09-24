import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('https://flavornest.onrender.com/api/users/login', form, { withCredentials: true })
      .then(res => { alert('Logged in!'); })
      .catch(err => alert('Login failed'));
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
        <button type="submit" className="px-6 py-3 bg-primary text-white rounded hover:bg-orange-600 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
