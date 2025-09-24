import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post('https://flavornest.onrender.com/api/users/signup', form)
      .then(res => alert('Account created!'))
      .catch(err => alert('Signup failed'));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
