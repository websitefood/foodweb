import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    fetch('https://flavornest.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <input 
        type="text" 
        placeholder="Name" 
        className="w-full p-2 mb-2 text-black" 
        value={name} 
        onChange={e => setName(e.target.value)} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        className="w-full p-2 mb-2 text-black" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full p-2 mb-2 text-black" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button onClick={handleSignup} className="w-full bg-blue-500 p-2 rounded">Sign Up</button>
    </div>
  );
};

export default SignupPage;
