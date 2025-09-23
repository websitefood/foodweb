import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold text-white">FlavorNest</Link>
        <div className="flex space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/upload" className="text-gray-300 hover:text-white">Upload Recipe</Link>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
