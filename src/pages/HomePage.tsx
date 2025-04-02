import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { 
  ChevronRight, 
  Truck, 
  RotateCw, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Star,
  TrendingUp
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
      name: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      path: '/category/electronics'
    },
    { 
      name: 'Furniture', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      path: '/category/furniture'
    },
    { 
      name: 'Kitchen', 
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      path: '/category/kitchen'
    },
    { 
      name: 'Home Decor', 
      image: 'https://images.unsplash.com/photo-1513716875835-b4b71893e905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      path: '/category/home'
    },
  ];

  const collections = [
    {
      name: "Summer Collection",
      description: "Bright and colorful items for summer days",
      image: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80",
      path: "/category/summer"
    },
    {
      name: "Autumn Essentials",
      description: "Warm and cozy products for the autumn season",
      image: "https://images.unsplash.com/photo-1544985361-b420d7a77140?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80",
      path: "/category/autumn"
    }
  ];

  const promotions = [
    {
      title: "Get 20% off",
      subtitle: "on all electronic items",
      cta: "Shop Now",
      path: "/category/electronics",
      bgColor: "bg-blue-600",
      textColor: "text-white"
    },
    {
      title: "Free Shipping",
      subtitle: "on orders over $100",
      cta: "Learn More",
      path: "/shipping",
      bgColor: "bg-purple-600",
      textColor: "text-white"
    },
    {
      title: "New Arrivals",
      subtitle: "Check out our latest products",
      cta: "Discover",
      path: "/new-arrivals",
      bgColor: "bg-amber-500",
      textColor: "text-white"
    }
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

  return (
    <MainLayout>
      <section className="relative bg-gray-100">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            <CarouselItem>
              <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Discover Quality Products for Your Lifestyle
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Shop our curated collection of premium products designed to enhance your everyday living experience.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" asChild>
                        <Link to="/shop">Shop Now</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/category/new-arrivals">New Arrivals</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <img 
                      src="https://images.unsplash.com/photo-1605826832916-d0a401244df1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80" 
                      alt="Home decorative items"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Summer Collection 2023
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Refresh your space with our vibrant summer collection, featuring bright colors and lightweight materials.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" asChild>
                        <Link to="/category/summer">View Collection</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <img 
                      src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80" 
                      alt="Summer collection"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full mb-4 inline-block">Limited Time</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Flash Sale: 30% Off Electronics
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                      Upgrade your tech with our premium electronics. Sale ends in 3 days!
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                        <Link to="/category/electronics">Shop Sale</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <img 
                      src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80" 
                      alt="Electronics on sale"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 py-2">
            {[0, 1, 2].map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === 0 ? "bg-primary" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </section>

      <section className="py-6 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center p-3">
              <Truck size={24} className="text-brand-blue mb-2" />
              <h3 className="font-medium">Free Shipping</h3>
              <p className="text-sm text-gray-500">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <RotateCw size={24} className="text-brand-blue mb-2" />
              <h3 className="font-medium">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <ShieldCheck size={24} className="text-brand-blue mb-2" />
              <h3 className="font-medium">Secure Payments</h3>
              <p className="text-sm text-gray-500">Protected by encryption</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Clock size={24} className="text-brand-blue mb-2" />
              <h3 className="font-medium">24/7 Support</h3>
              <p className="text-sm text-gray-500">We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/shop" className="text-brand-blue flex items-center hover:underline">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={category.path} 
                className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-brand-blue" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <Link to="/category/new-arrivals" className="text-brand-blue flex items-center hover:underline">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 h-[320px] animate-pulse">
                  <div className="h-[200px] bg-gray-200 rounded-md mb-4"></div>
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
              <CarouselPrevious className="-left-4 bg-white" />
              <CarouselNext className="-right-4 bg-white" />
            </Carousel>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Featured Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link 
                to={collection.path}
                key={index}
                className="relative overflow-hidden rounded-xl group"
              >
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
                  <p className="text-white/80 mb-4">{collection.description}</p>
                  <Button size="sm" className="self-start bg-white text-gray-900 hover:bg-gray-100">
                    Discover
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <div 
                key={index} 
                className={`${promo.bgColor} ${promo.textColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
              >
                <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                <p className="mb-4 opacity-90">{promo.subtitle}</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-current text-current hover:bg-white/10"
                >
                  <Link to={promo.path}>{promo.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-blue" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/category/best-sellers" className="text-brand-blue flex items-center hover:underline">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 h-[320px] animate-pulse">
                  <div className="h-[200px] bg-gray-200 rounded-md mb-4"></div>
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

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">What Our Customers Say</h2>
          <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
            Don't just take our word for it - see what our valued customers have to say about their shopping experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get 10% Off Your First Order</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Sign up for our newsletter and receive exclusive offers, new product alerts, and more!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="rounded-md px-4 py-2 flex-grow text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-brand-blue hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
