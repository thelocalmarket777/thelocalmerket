
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">NexusShop</h3>
            <p className="text-gray-600 mb-4 max-w-xs">
              Your one-stop destination for quality products that enhance your lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/category/electronics" className="text-gray-600 hover:text-brand-blue">Electronics</Link></li>
              <li><Link to="/category/furniture" className="text-gray-600 hover:text-brand-blue">Furniture</Link></li>
              <li><Link to="/category/kitchen" className="text-gray-600 hover:text-brand-blue">Kitchen</Link></li>
              <li><Link to="/category/home" className="text-gray-600 hover:text-brand-blue">Home</Link></li>
              <li><Link to="/category/accessories" className="text-gray-600 hover:text-brand-blue">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-brand-blue">Shipping Information</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-brand-blue">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-blue">Our Story</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue">Careers</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-blue">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-blue">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex justify-between items-center flex-wrap">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} NexusShop. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="Apple Pay" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
