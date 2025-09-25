import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use relative path or change to your exact backend base URL
      const res = await axios.post('/api/users/signup', form);
      setSuccess(true);
      // short delay then redirect to login page
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 1400);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Signup failed');
      setLoading(false);
    }
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

        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded hover:bg-orange-600 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : null}
          {loading ? 'Creating...' : 'Signup'}
        </button>
      </form>

      {error ? <p className="mt-4 text-red-400">{error}</p> : null}

      {success && (
        <div className="mt-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold">Account created!</div>
            <div className="text-sm text-gray-300">Successfully signed up. Redirecting to login...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
