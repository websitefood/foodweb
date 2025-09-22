import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { logout } from '../utils/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('flavornest_token');
    setUser(!!t);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    navigate('/');
  }

  return (
    <nav className="bg-white dark:bg-gray-800 sticky top-0 z-20 shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-orange-500">FlavorNest</Link>
          <Link to="/" className="hidden md:inline text-sm">Home</Link>
          <Link to="/upload" className="hidden md:inline text-sm">Upload</Link>
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          {user ? (
            <>
              <Link to="/profile" className="px-3 py-1 rounded bg-indigo-500 text-white text-sm">Profile</Link>
              <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-indigo-500 text-white text-sm">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded bg-green-500 text-white text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
