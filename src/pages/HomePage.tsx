import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

import { 
  ChevronRight, 
  Heart,
  Package,
  Shield,
  Headphones,
  ArrowRight,
  Star,
  Book,
  Leaf,
  Scissors,
  Home,
  ShoppingBag
} from 'lucide-react';

import bookimgfront from '../assects/image/bookshowroom.jpg';
import RemoteServices from '@/RemoteService/Remoteservice';
import NotificationListener from '@/components/layout/Notification';
import { LoadingSkeleton } from '@/components/HelperUI/Loading';
import HeroSection from '@/components/Homepage/ScrollTopImg';
import { set } from 'date-fns';
import ImgScrollonly from '@/components/Homepage/ImgScrollonly';

// Define interfaces for better type safety
interface ValueProp {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

interface Category {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  path: string;
}

interface FeaturedCollection {
  title: string;
  description: string;
  image: string;
  color: string;
  path: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface LocalProduct {
  title: string;
  description: string;
  buttonText: string;
  path: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  [key: string]: any; // for additional properties
}

interface HomepageImage {
  id: string;
  type: 'main' | 'promotion' | 'product';
  image_url: string | null;
  created_at: string;
}

interface HomepageImages {
  mainImg: HomepageImage[];
  promotionImg: HomepageImage[];
  productImg: HomepageImage[];
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkPath?: string;
}

interface EmptyStateProps {
  message: string;
}

interface TopCategories {
  [key: string]: Product[];
}

// Define static data for better organization
const valueProps: ValueProp[] = [
  {
    icon: Package,
    title: "Premium Quality",
    description: "Curated selection of durable, high-quality items",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "Ethically sourced materials and responsible manufacturing",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Shield,
    title: "Satisfaction Guarantee",
    description: "7-day returns on all products",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Our team is available 7 days a week to assist you",
    color: "bg-rose-100 text-rose-600"
  }
];

const categories: Category[] = [
  { 
    name: 'Books', 
    description: 'Explore our collection of books',
    icon: Book,
    color: 'bg-blue-100', 
    textColor: 'text-blue-800',
    path: '/category/Books'
  },
  { 
    name: 'Plants',
    description: 'Bring nature indoors with our plants', 
    icon: Leaf,
    color: 'bg-green-100',
    textColor: 'text-green-800',
    path: '/category/Plants'
  },
  { 
    name: 'Handicrafts',
    description: 'Unique handicrafts from local artisans', 
    icon: Scissors,
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
    path: '/category/Handicrafts'
  },
  { 
    name: 'Home Decor', 
    description: 'Beautiful accents for your space',
    icon: Home,
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    path: '/category/homedecor'
  },
];

const featuredCollections: FeaturedCollection[] = [
  {
    title: "Wood Craft",
    description: "Handcrafted wooden items for your home",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Wood_Craft_%2CNepal.JPG",
    color: "bg-gradient-to-r from-pink-400 to-purple-500",
    path: "/category/handcraft"
  },
  {
    title: "Tibetan Thangka",
    description: "Artistic and spiritual pieces for your home",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Tibetan_thangka_from_AD_1500%2C_Mahakala%2C_Protector_of_the_Tent%2C_Central_Tibet._Distemper_on_cloth-_%28cropped%29.jpg",
    color: "bg-gradient-to-r from-green-400 to-blue-500",
    path: "/category/Painting"
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Sarah J.",
    role: "Regular Customer",
    content: "I've been shopping here for years and the quality has always been exceptional. Their customer service is top-notch too!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Michael T.",
    role: "First-time Buyer",
    content: "Ordered for the first time and was pleasantly surprised by the fast shipping and product quality. Will definitely order again.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Emily R.",
    role: "Loyal Customer",
    content: "The attention to detail in their products is amazing. Everything I've purchased has exceeded my expectations!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const localNepalProducts: LocalProduct[] = [
  {
    title: "Nepali Heritage Books",
    description: "Explore the rich history and culture of Nepal through beautifully illustrated and thoughtfully written stories.",
    buttonText: "Learn More",
    path: "/local-showcase/heritage-books"
  },
  {
    title: "Traditional Crafting",
    description: "Handcrafted items that showcase the artistry of local Nepali craftsmen, blending tradition with modern design.",
    buttonText: "Discover More",
    path: "/local-showcase/traditional-crafts"
  },
  {
    title: "Authentic Banbo",
    description: "Traditional banbo products made by local artisans, capturing the authentic essence of Nepali heritage.",
    buttonText: "Shop Now",
    path: "/local-showcase/banbo"
  }
];

// Map category names to their corresponding icons
const categoryIconMap = {
  books: Book,
  furniture: Home,
  clothing: ShoppingBag,
  shoes: ShoppingBag,
  beauty: Heart,
  health: Shield,
  jewelry: Package,
  automotive: Package,
  plants: Leaf,
  handicraft: Scissors,
  painting: Scissors,
  home_decor: Home
};

interface HomepageState {
  topCategories: TopCategories;
  homepageImages: HomepageImages;
  featuredProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  isLoading: boolean;
  hasError: boolean;
}

const HomePage = () => {
  const [state, setState] = useState<HomepageState>({
    topCategories: {},
    homepageImages: {
      mainImg: [],
      promotionImg: [],
      productImg: []
    },
    featuredProducts: [],
    newArrivals: [],
    bestSellers: [],
    isLoading: true,
    hasError: false
  });


  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    RemoteServices.getTopCatogires()
      .then((response) => {
        setState(prev => ({
          ...prev,
          topCategories: response.data || {},
          homepageImages: {
            mainImg: response.data?.homepageImg?.mainImg?.filter(img => img.image_url !== null) || [],
            promotionImg: response.data?.homepageImg?.promotionImg?.filter(img => img.image_url !== null) || [],
            productImg: response.data?.homepageImg?.productImg?.filter(img => img.image_url !== null) || []
          },
          isLoading: false
        }));
      })
      .catch((error) => {
        setState(prev => ({
          ...prev,
          hasError: true,
          isLoading: false
        }));
      });
  }, []);

  // Helper function to check if a category has products
  const hasCategoryProducts = (categoryName) => {
    return state.topCategories[categoryName] && state.topCategories[categoryName].length > 0;
  };

  // Get total number of products across all categories
  const getTotalProductCount = () => {
    let count = 0;
    Object.values(state.topCategories).forEach(products => {
      count += (products?.length || 0);
    });
    return count;
  };

  // Get populated categories (categories with at least one product)
  const getPopulatedCategories = () => {
    return Object.keys(state.topCategories).filter(category => 
      state.topCategories[category] && state.topCategories[category].length > 0
    );
  };

  // Reusable section header component
  const SectionHeader = ({ title, subtitle, linkText, linkPath }: SectionHeaderProps) => (
    <div className="flex justify-between items-end mb-8">
      <div>
        {subtitle && (
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2 block">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      {linkText && (
        <Link to={linkPath} className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
          {linkText}
          <ChevronRight size={16} className="ml-1" />
        </Link>
      )}
    </div>
  );



  return (
    <MainLayout>
     
    
      <HeroSection 
        getTotalProductCount={getTotalProductCount} 
        productimgs={state.homepageImages.mainImg}
      />

      {/* Value Props */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => {
              const IconComponent = prop.icon;
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className={`p-3 rounded-full ${prop.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{prop.title}</h3>
                    <p className="text-gray-600 text-sm">{prop.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {getPopulatedCategories().length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Popular Categories" 
              subtitle="Shop by Category" 
              linkText="View All Categories" 
              linkPath="/categories" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getPopulatedCategories().slice(0, 4).map((category) => {
                const displayName = category.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                // Get an icon based on the category name or use a default
                const IconComponent = categoryIconMap[category] || ShoppingBag;
                
                // Generate a consistent color based on the category name
                const colorIndex = category.length % 4;
                const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-amber-100', 'bg-purple-100'];
                const textColors = ['text-blue-800', 'text-green-800', 'text-amber-800', 'text-purple-800'];
                
                return (
                  <Link 
                    key={category}
                    to={`/category/${category}`} 
                    className={`${bgColors[colorIndex]} ${textColors[colorIndex]} p-8 rounded-xl hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="mb-4 flex items-center">
                          <IconComponent size={24} className="mr-2" />
                          <h3 className="text-xl font-bold">{displayName}</h3>
                        </div>
                        <p className="opacity-80 mb-8">
                          {state.topCategories[category]?.length || 0} products available
                        </p>
                      </div>
                      <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300">
                        Explore
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Collections */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed to enhance your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCollections.map((collection, index) => (
              <Link 
                key={index}
                to={collection.path} 
                className="group relative overflow-hidden rounded-xl shadow-lg h-80"
              >
                <div className={`absolute inset-0 ${collection.color} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}></div>
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                    <p className="text-white/90">{collection.description}</p>
                  </div>
                  <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300">
                    Discover Collection
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}



      {/* Categories */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Shop by Category" 
            subtitle="" 
            linkText="View All Categories" 
            linkPath="/categories" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link 
                  key={category.name}
                  to={category.path} 
                  className={`${category.color} ${category.textColor} p-8 rounded-xl hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="mb-4 flex items-center">
                        <IconComponent size={24} className="mr-2" />
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      <p className="opacity-80 mb-8">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300">
                      Explore
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section> */}
      <ImgScrollonly 
        images={state.homepageImages.promotionImg}
      />
      {/* New Arrivals */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4 py-8">
          <SectionHeader 
            title="New Arrivals" 
            subtitle="Just In" 
            linkText="View All" 
            linkPath="/category/isNew=true&stock=true" 
          />
          
          {state.isLoading ? (
            <LoadingSkeleton count={4} />
          ) : state.newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {state.newArrivals.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="New arrivals coming soon! Check back later for our latest products." />
          )}
        </div>
      </section> */}

      {/* Top Categories Products */}
      {getPopulatedCategories().map(category => {
        if (!hasCategoryProducts(category)) return null;
        
        const displayName = category.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        return (
          <section key={category} className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <SectionHeader 
                title={`${displayName} Collection`}
                subtitle="Featured Items" 
                linkText="View All" 
                linkPath={`/category/${category}`} 
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {state.topCategories[category].slice(0, 4).map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Local Nepali Products */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">Local Treasures of Nepal</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the best of Nepal with our exclusive range of local products. Explore beautifully crafted books, artisanal crafting items, and traditional banbo products that celebrate Nepali heritage and culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localNepalProducts.map((product, index) => (
              <div key={index} className="rounded-lg bg-gray-50 shadow hover:shadow-md transition-all duration-300 p-6">
                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <Button 
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                  asChild
                >
                  <Link to={product.path}>{product.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Explore our curated collections and find pieces that reflect your unique style and elevate your everyday living.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8" asChild>
            <Link to="/all">Shop Now</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;