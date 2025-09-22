import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch (e) {
      alert('Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" className="w-full p-2 border rounded" required />
        <button className="px-4 py-2 bg-indigo-500 text-white rounded">Login</button>
      </form>
    </div>
  );
}
