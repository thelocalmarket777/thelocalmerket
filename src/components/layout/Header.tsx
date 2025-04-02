
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Search, 
  LogIn,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const categories = [
    { name: 'Electronics', path: '/category/electronics' },
    { name: 'Furniture', path: '/category/furniture' },
    { name: 'Kitchen', path: '/category/kitchen' },
    { name: 'Home', path: '/category/home' },
    { name: 'Accessories', path: '/category/accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-blue">
            NexusShop
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex md:w-1/3 lg:w-1/2">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart size={20} />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white rounded-full text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="relative group">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User size={20} />
                  </Button>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                  <div className="py-2 px-4 border-b">
                    <p className="text-sm font-medium">Hello, {user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="gap-2">
                  <LogIn size={18} />
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Category navigation */}
        <div className="hidden md:flex items-center justify-center gap-6 mt-4">
          {categories.map((category) => (
            <Link 
              key={category.path} 
              to={category.path}
              className="text-sm font-medium text-gray-600 hover:text-brand-blue"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 bg-white z-50 flex flex-col",
          mobileMenuOpen ? "block" : "hidden"
        )}>
          <div className="flex justify-between items-center p-4 border-b">
            <Link 
              to="/" 
              className="text-2xl font-bold text-brand-blue"
              onClick={() => setMobileMenuOpen(false)}
            >
              NexusShop
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full"
            />
          </div>
          
          <nav className="flex flex-col p-4">
            <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">Categories</h3>
            {categories.map((category) => (
              <Link 
                key={category.path} 
                to={category.path}
                className="py-2 text-gray-800 hover:text-brand-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <Link 
              to="/wishlist" 
              className="py-2 flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
            
            <Link 
              to="/cart" 
              className="py-2 flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={18} />
              <span>Cart {itemCount > 0 && `(${itemCount})`}</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="py-2 flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="py-2 flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>My Orders</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 flex items-center gap-3 text-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>Login / Register</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
