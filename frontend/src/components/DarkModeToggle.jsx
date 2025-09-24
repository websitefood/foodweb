import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
      || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark', !dark);
    localStorage.setItem('theme', !dark ? 'dark' : 'light');
  };

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="p-2">
      {dark ? <FaSun className="text-yellow-400 w-5 h-5" /> : <FaMoon className="text-gray-200 w-5 h-5" />}
    </button>
  );
};

export default DarkModeToggle;
