import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

import { Product } from '@/types';
import { 
  ChevronRight, 
  Heart,
  Package,
  Shield,
  Headphones,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await api.products.getAll();
        
        // In a real app, these would be separate API calls
        setFeaturedProducts(products);
        
        // Simulating different product sets
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setNewArrivals(shuffled.slice(0, 4));
        setBestSellers(shuffled.slice(4, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { 
      name: 'Book', 
      description: 'Explore our collection of books',
      icon: 'book',
     
      color: 'bg-blue-100', 
      textColor: 'text-blue-800',
      path: '/category/Book'
    },
    { 
      name: 'Plants',
      description: 'Bring nature indoors with our plants', 
      
      icon: 'sofa',
      color: 'bg-green-100',
      textColor: 'text-amber-800',
      path: '/category/Plants'
    },
    { 
      name: 'Handicrafts',
      description: 'Unique handicrafts from local artisans', 
      
      icon: 'handcuffs',
      color: 'bg-green-100',
      textColor: 'text-green-800',
      path: '/category/Handicrafts'
    },
    { 
      name: 'Home Decor', 
      description: 'Beautiful accents for your space',
      icon: 'lamp',
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
      path: '/category/homedecor'
    },
  ];

  const testimonials = [
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

  const featuredCollections = [
    {
      title: "Wood Craft",
      description: "Handcrafted wooden items for your home",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Wood_Craft_%2CNepal.JPG",
      color: " bg-gradient-to-r from-pink-400 to-purple-500",
      path: "/category/handcraft"
    },
    {
      title: "Tibetan thangka ",
      description: "Artistic and spiritual pieces for your home",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Tibetan_thangka_from_AD_1500%2C_Mahakala%2C_Protector_of_the_Tent%2C_Central_Tibet._Distemper_on_cloth-_%28cropped%29.jpg",
      color: "bg-gradient-to-r from-green-400 to-blue-500",
      path: "/category/Painting"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden bg-slate-500 text-white">
        <div className="absolute inset-0 z-0 opacity-60">
          <div className="absolute inset-0   z-10"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Wood_Craft_%2CNepal.JPG" 
            alt="Modern lifestyle" 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm">
              Elevate Your Lifestyle
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Curated Designs for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                Modern Living
              </span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Discover thoughtfully crafted products that blend beauty, functionality, and sustainability for your everyday needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 hover:text-black px-8" asChild>
                <Link to="/All">Explore Collection</Link>
              </Button>
              {/* <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/category/new">New Season</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Premium Quality</h3>
                <p className="text-gray-600 text-sm">Curated selection of durable, high-quality items</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Made with Care</h3>
                <p className="text-gray-600 text-sm">Ethically sourced materials and responsible manufacturing</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Satisfaction Guarantee</h3>
                <p className="text-gray-600 text-sm">30-day returns and 1-year warranty on all products</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-rose-100 text-rose-600">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Expert Support</h3>
                <p className="text-gray-600 text-sm">Our team is available 7 days a week to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-gray-50">
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
                <div className={`absolute inset-0  ${collection.color}  opacity-90 transition-opacity duration-300 group-hover:opacity-100`}></div>
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
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
              <p className="text-gray-600">Find exactly what you're looking for</p>
            </div>
            <Link to="/shop" className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
              View All Categories
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={category.path} 
                className={`${category.color} ${category.textColor} p-8 rounded-xl hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="opacity-80 mb-8">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300">
                    Explore
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2 block">Just In</span>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
            </div>
            <Link to="/category/new-arrivals" className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg bg-white p-4 h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {newArrivals.map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 bg-white shadow-md hover:bg-gray-50" />
              <CarouselNext className="-right-4 bg-white shadow-md hover:bg-gray-50" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2 block">Popular Items</span>
              <h2 className="text-3xl font-bold">Best Sellers</h2>
            </div>
            <Link to="/category/best-sellers" className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg bg-white p-4 h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Local Nepali Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3">Local Treasures of Nepal</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the best of Nepal with our exclusive range of local products. Explore beautifully crafted books, artisanal crafting items, and traditional banbo products that celebrate Nepali heritage and culture.
            </p>
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 p-6">
              <img src="/api/placeholder/600/400" alt="Nepali Heritage Book" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold mb-2">Nepali Heritage Book</h3>
              <p className="text-gray-600 mb-4">
                Explore the rich history and culture of Nepal through beautifully illustrated and thoughtfully written stories.
              </p>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">Learn More</Button>
            </div>
            <div className="rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 p-6">
              <img src="/api/placeholder/600/400" alt="Traditional Crafting" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold mb-2">Traditional Crafting</h3>
              <p className="text-gray-600 mb-4">
                Handcrafted items that showcase the artistry of local Nepali craftsmen, blending tradition with modern design.
              </p>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">Discover More</Button>
            </div>
            <div className="rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 p-6">
              <img src="/api/placeholder/600/400" alt="Authentic Banbo" className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold mb-2">Authentic Banbo</h3>
              <p className="text-gray-600 mb-4">
                Traditional banbo products made by local artisans, capturing the authentic essence of Nepali heritage.
              </p>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">Shop Now</Button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Special Offer Banner */}
      {/* <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 15% Off Your First Order</h2>
              <p className="text-white/80 max-w-lg mx-auto lg:mx-0">
                Sign up for our newsletter and receive exclusive offers, early access to new products, and personalized recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="rounded-md px-4 py-3 flex-grow text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2 block">What People Say</span>
            <h2 className="text-3xl font-bold mb-3">Customer Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community of satisfied customers about their experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className="text-amber-400 fill-amber-400" 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center mt-auto">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      {/* <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Explore our curated collections and find pieces that reflect your unique style and elevate your everyday living.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </section> */}
    </MainLayout>
  );
};

export default HomePage;
