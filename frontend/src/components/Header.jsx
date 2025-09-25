import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Read user from localStorage on mount
    const raw = localStorage.getItem('user');
    setUser(raw ? JSON.parse(raw) : null);

    // Update when other tabs change auth state
    const onStorage = (e) => {
      if (e.key === 'user') {
        const val = e.newValue;
        setUser(val ? JSON.parse(val) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    // Optionally call backend logout endpoint if required by your app
    navigate('/');
  };

  const closeMobileAndNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <Link to="/" className="text-2xl font-bold">
          <span>Flavor</span><span className="text-primary">Nest</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>{t('welcome')}</NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>Recipes</NavLink>
          <NavLink to="/add" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>Add Recipe</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary' : 'hover:text-primary'}>About</NavLink>
        </nav>

        <div className="hidden md:flex space-x-4 items-center">
          <DarkModeToggle />

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition">
                Signup
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
                title="Go to profile"
              >
                {user.username || user.name || 'Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/')}>Home</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/recipes')}>Recipes</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/add')}>Add Recipe</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/about')}>About</button>

          <div className="border-t border-gray-700 mt-2 pt-2">
            <div className="px-4 py-2">
              <DarkModeToggle />
            </div>

            {!user ? (
              <>
                <button className="block w-full text-left px-4 py-2 text-primary hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/login')}>Login</button>
                <button className="block w-full text-left px-4 py-2 bg-primary text-white hover:bg-orange-600" onClick={() => closeMobileAndNavigate('/signup')}>Signup</button>
              </>
            ) : (
              <>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => closeMobileAndNavigate('/profile')}>{user.username || user.name || 'Profile'}</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-700" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
