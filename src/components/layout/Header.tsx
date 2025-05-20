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
  ChevronDown,
  Home,
  Book,
  Leaf,
  Palette,
  BellDot,
  Bell
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import RemoteServices from '@/RemoteService/Remoteservice';
import logoimg from '@/assects/image/logobgremove.jpg';



const Header = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { toast } = useToast();
  const searchInputRef = useRef(null);

 
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setProfileDropdownOpen(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
      variant: 'success'
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

    setIsLoading(true);
    setSearchTimeout(setTimeout(() => {
      RemoteServices.filterProductSearch(search)
        .then((response) => {
          setIsLoading(false);
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
          setIsLoading(false);
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

  // Focus search input when dropdown opens on mobile
  useEffect(() => {
    if (searchDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchDropdownOpen]);

  const categories = [
    { name: 'Books', path: '/category/Books', icon: <Book size={16} /> },
    { name: 'Home Decor', path: '/category/Homedecor', icon: <Home size={16} /> },
    { name: 'Plant', path: '/category/Plant', icon: <Leaf size={16} /> },
    { name: 'Painting', path: '/category/Painting', icon: <Palette size={16} /> },
  ];
  const notifications = 2


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="mr-6 transition-transform hover:scale-105">
              <img src={logoimg} alt="Logo" className="h-16 object-contain" />
            </Link>
            <nav className="hidden lg:block">
              <div className="flex items-center gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="flex items-center gap-1.5 font-medium text-sm text-gray-700 hover:text-teal-600 transition-colors duration-200"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full search-dropdown-container">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-4 text-sm rounded-full border-2 border-gray-200 focus:border-transparent focus-visible:ring-1 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2  border-t-transparent rounded-full" />
                ) : (
                  <Search size={16} />
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-72 overflow-auto animate-fadeIn">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">{results.length} results found</p>
                  </div>
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => {
                        setShowResults(false);
                        setSearch('');
                        setResults([]);
                      }}
                    >
                      {item.image_url && (
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'; // Fallback image path
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 flex-row min-w-0">
                      
                        <p className="font-medium text-gray-800 truncate">{item.name}</p>
                       
                       
                          {item.category && (
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {showResults && results.length === 0 && search && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-sm text-gray-500">No products found for "{search}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full h-10 w-10 p-0 flex items-center justify-center relative"
                >
                  <Heart size={18} />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>
              <Link to="/notification">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full h-10 w-10 p-0 flex items-center justify-center relative"
                >
                  <Bell size={18} />
                  {notifications > 0 && (
                  <span
                  className="
                    absolute
                    top-0.5
                    right-1
                    h-2
                    w-2
                    bg-red-600
                    rounded-full
                  "
                  aria-hidden="true"
                />)}
                  <span className="sr-only">Notification</span>
                </Button>
              </Link>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full h-10 w-10 p-0 flex items-center justify-center"
                >
                  <ShoppingCart size={18} />
                  <span className="sr-only">Cart</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <div className="relative profile-dropdown-container">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full px-4 py-2"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                  </Button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 z-50 text-sm overflow-hidden animate-fadeIn">
                      <div className="py-4 px-4 border-b bg-gradient-to-r from-teal-50 to-white">
                        <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={16} className="mr-3 text-gray-500" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        <div className="h-px bg-gray-200 my-2 mx-4"></div>
                        <button
                          onClick={logout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    size="sm"
                    className="text-sm bg-teal-600 hover:bg-teal-700 text-white border-0 rounded-full px-5 py-2 transition-colors"
                  >
                    <LogIn size={14} className="mr-2" />
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
                className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
              >
                <Search size={18} />
              </Button>
            </div>

            {/* Mobile Cart Button */}
            <Link to="/cart" className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="relative rounded-full h-10 w-10 p-0 flex items-center justify-center"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-medium">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden rounded-full h-10 w-10 flex items-center justify-center bg-gray-100 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown (Mobile) */}
      {searchDropdownOpen && (
        <div className="fixed inset-x-0 top-0 h-full bg-white shadow-md z-50 flex flex-col animate-slideInDown">
          <div className="flex items-center gap-2 p-4 border-b">
            <button
              onClick={() => setSearchDropdownOpen(false)}
              className="text-gray-500"
            >
              <X size={20} />
            </button>
            <div className="relative flex-1">
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 text-sm rounded-full border-2 border-gray-200 focus-visible:ring-1 focus-visible:ring-teal-300"
                autoFocus
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full" />
                ) : (
                  <Search size={16} />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {showResults && results.length > 0 ? (
              <>
                <p className="text-xs text-gray-500 font-medium mb-2">{results.length} results found</p>
                <div className="space-y-3">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-teal-200 transition-all"
                      onClick={() => {
                        setShowResults(false);
                        setSearch('');
                        setSearchDropdownOpen(false);
                      }}
                    >
                      {item.image_url && (
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'; // Fallback image
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        {item.price && (
                          <p className="text-teal-600 text-sm font-semibold mt-1">${item.price}</p>
                        )}
                        {item.category && (
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : search && !isLoading ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No products found for "{search}"</p>
                <p className="text-sm text-gray-400 mt-2">Try different keywords or browse categories</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-50 flex flex-col transition-all duration-300 ease-in-out",
        mobileMenuOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      )}>
        <div className="flex justify-between items-center p-4 border-b">
          <Link
            to="/"
            className="transition-transform hover:scale-105"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={logoimg} alt="Logo" className="h-10 object-contain" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center px-4 py-3 bg-teal-50">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-semibold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-teal-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>

        <nav className="flex flex-col p-4 overflow-y-auto flex-1">
          <h3 className="font-medium text-xs uppercase text-gray-500 mb-3 px-2">Categories</h3>
          <div className="space-y-1 mb-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  {category.icon}
                </div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>

          <h3 className="font-medium text-xs uppercase text-gray-500 mb-3 px-2">My Account</h3>
          <div className="space-y-1">
            <Link
              to="/wishlist"
              className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={18} className="text-gray-500" />
              <span>Wishlist</span>
            </Link>
            <Link
              to="/notification"
              className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell size={18} className="text-gray-500" />
              <span>Notification</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={18} className="text-gray-500" />
              <span>Cart {itemCount > 0 && <span className="ml-1 px-2 py-0.5 text-xs bg-teal-100 text-teal-700 rounded-full">{itemCount}</span>}</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="text-gray-500" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 py-3 px-3 text-gray-800 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>My Orders</span>
                </Link>
              </>
            ) : null}
          </div>

          {user && (
            <>
              <div className="h-px bg-gray-200 my-4"></div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-all w-full text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">
          © 2025 HandCraft Store. All rights reserved.
        </div>
      </div>
    </header>
  );
};

export default Header;