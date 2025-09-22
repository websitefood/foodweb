import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FlavorNest — Joyful cooking & recipes.
      </div>
    </footer>
  );
}
