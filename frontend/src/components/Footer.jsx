import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-800 text-gray-400 py-6">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-0">
      <div className="text-center md:text-left">
        <p>&copy; 2025 FlavorNest. All rights reserved.</p>
        <div className="flex justify-center md:justify-start space-x-4 mt-2">
          <a href="https://facebook.com/flavornest" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF className="hover:text-white transition"/>
          </a>
          <a href="https://twitter.com/flavornest" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="hover:text-white transition"/>
          </a>
          <a href="https://instagram.com/flavornest" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="hover:text-white transition"/>
          </a>
          <a href="https://wa.me/?text=https://flavornestx.onrender.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp className="hover:text-white transition"/>
          </a>
        </div>
      </div>
      <p className="mt-4 md:mt-0">Crafted with ❤️ by FlavorNest Team</p>
    </div>
  </footer>
);

export default Footer;
