import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  User,
  Menu,
  Search,
  LogIn,
  Heart,
  X,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import RemoteServices from '@/RemoteService/Remoteservice';

const Header = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Safe JSON parse for user data
  const user = (() => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  })();

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    setProfileDropdownOpen(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
      if (searchDropdownOpen && !event.target.closest('.search-dropdown-container')) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, searchDropdownOpen]);

  useEffect(() => {
    if (!search) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(setTimeout(() => {
      RemoteServices.filterProductSearch(search)
        .then((response) => {
          if (response?.status === 200 && response?.data) {
            setResults(response.data);
            setShowResults(true);
          } else {
            setResults([]);
            setShowResults(false);
            toast({
              title: "Search Error",
              description: "Failed to fetch search results",
              variant: "destructive"
            });
          }
        })
        .catch((error) => {
          console.error('Search error:', error);
          setResults([]);
          setShowResults(false);
          toast({
            title: "Search Error",
            description: "Failed to fetch search results",
            variant: "destructive"
          });
        });
    }, 500));

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search, toast]);

  const categories = [
    { name: 'Books', path: '/category/Books' },
    { name: 'Home Decor', path: '/category/Homedecor' },
    { name: 'Plant', path: '/category/Plant' },
    { name: 'Painting', path: '/category/Painting' },
    // { name: '', path: '/category/' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-teal-600">
           The Local
            <sub className="text-lg text-gray-500">Market</sub>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-4 text-sm rounded-full border-2 border-gray-200 focus-visible:border-none "
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              {/* results dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => {
                        setShowResults(false);
                        setSearch('');      // clear the input if you like
                        setResults([]);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1">
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-teal-600 hover:bg-teal-50">
                  <Heart size={18} />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-teal-600 hover:bg-teal-50">
                  <ShoppingCart size={18} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              {user ? (
                <div className="relative profile-dropdown-container">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User size={18} />
                    <span className="hidden lg:inline text-xs">{user?.name?.split(' ')[0] || 'User'}</span>
                  </Button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded border border-gray-200 z-50 text-sm">
                      <div className="py-2 px-3 border-b">
                        <p className="font-medium text-xs">Hello, {user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-3 py-1 text-xs hover:bg-teal-50 hover:text-teal-600"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-3 py-1 text-xs hover:bg-teal-50 hover:text-teal-600"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button size="sm" variant="outline" className="text-xs border-teal-600 text-teal-600 hover:bg-teal-50">
                    <LogIn size={14} className="mr-1" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Search icon for mobile */}
            <div className="md:hidden search-dropdown-container">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
              >
                <Search size={18} />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Categories Navigation - Desktop */}
        <nav className="hidden md:block mt-1">
          <div className="flex items-center gap-4 ">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="font-medium text-xs text-gray-600 hover:text-teal-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

    {/* Search Dropdown (Mobile) */}
{searchDropdownOpen && (
  <div className="absolute left-0 right-0 p-3 bg-white shadow-md z-50 top-12 border-t border-gray-200">
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 text-sm rounded-full border border-gray-300 focus:ring-2 focus:ring-teal-400 transition"
        autoFocus
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      {showResults && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto animate-fadeIn">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
              onClick={() => {
                setShowResults(false);
                setSearch('');
                setSearchDropdownOpen(false);
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
)}


      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-50 flex flex-col",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="flex justify-between items-center p-3 border-b">
          <Link
            to="/"
            className="text-xl font-bold text-teal-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            StartUp
            <sub className="text-lg text-gray-500">बजार</sub>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-3 overflow-y-auto flex-1">
          <h3 className="font-medium text-xs uppercase text-gray-500 mb-2">Categories</h3>
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="py-2 text-sm text-gray-800 hover:text-teal-600 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}

          <div className="h-px bg-gray-200 my-3"></div>

          <Link
            to="/wishlist"
            className="py-2 flex items-center gap-2 text-sm border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart size={16} />
            <span>Wishlist</span>
          </Link>

          <Link
            to="/cart"
            className="py-2 flex items-center gap-2 text-sm border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart size={16} />
            <span>Cart {itemCount > 0 && `(${itemCount})`}</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="py-2 flex items-center gap-2 text-sm border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/orders"
                className="py-2 flex items-center gap-2 text-sm border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>My Orders</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="py-2 flex items-center gap-2 text-sm text-red-600 border-b border-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="py-2 flex items-center gap-2 text-sm border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;