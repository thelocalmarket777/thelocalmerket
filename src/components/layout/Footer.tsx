import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">TheLocal <sub>Market</sub></h3>
            <p className="text-gray-600 text-sm">
              Your one-stop destination for quality products.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Shop</h4>
              <ul className="text-sm">
                <li><Link to="/category/Book" className="text-gray-600 hover:text-blue-600">Book</Link></li>
                <li><Link to="/category/Plants" className="text-gray-600 hover:text-blue-600">Plants</Link></li>
                <li><Link to="/category/domedecor" className="text-gray-600 hover:text-blue-600">Homedecor</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Support</h4>
              {/* <ul className="text-sm">
                <li><Link to="/catogroy/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
                <li><Link to="/catogroy/faq" className="text-gray-600 hover:text-blue-600">FAQs</Link></li>
                <li><Link to="/catogroy/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              </ul> */}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between items-center flex-wrap">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Startup <sub>बजार</sub>. All rights reserved.
            </p>
            <div className="flex space-x-3" >
              <a href="#"  className="text-gray-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;