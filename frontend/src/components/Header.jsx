import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <Link to="/" className="text-2xl font-bold">
          <span>Flavor</span><span className="text-primary">Nest</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className="hover:text-primary">{t('welcome')}</NavLink>
          <NavLink to="/recipes" className="hover:text-primary">Recipes</NavLink>
          <NavLink to="/add" className="hover:text-primary">Add Recipe</NavLink>
          <NavLink to="/about" className="hover:text-primary">About</NavLink>
        </nav>
        <div className="hidden md:flex space-x-4 items-center">
          <DarkModeToggle />
          <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition">
            Signup
          </Link>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
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
          <NavLink to="/" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/recipes" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>Recipes</NavLink>
          <NavLink to="/add" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>Add Recipe</NavLink>
          <NavLink to="/about" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>About</NavLink>
          <Link to="/login" className="block px-4 py-2 text-primary hover:bg-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" className="block px-4 py-2 bg-primary text-white hover:bg-orange-600" onClick={() => setMenuOpen(false)}>Signup</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
