import { useState, useEffect, useRef } from 'react';

// Hero Section with Auto-Scrolling Image Carousel
export default function HeroSection({ getTotalProductCount }) {
  // Sample images for the carousel - replace with your actual images
  const images = [
    "/api/placeholder/1200/800", // First placeholder image
    "/api/placeholder/1200/800", // Second placeholder image
    "/api/placeholder/1200/800", // Third placeholder image
    "/api/placeholder/1200/800", // Fourth placeholder image
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  
 
  
  // Auto-scroll effect
  useEffect(() => {
    // Setup interval for automatic scrolling
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Transition time before changing image
    }, 5000); // Change image every 5 seconds
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length]);
  
  return (
    <section className="relative overflow-hidden bg-black h-screen">
      {/* Background image with transition effect */}
      <div className="absolute inset-0 z-0 opacity-60">
        <div className="absolute inset-0 z-10"></div>
        <img 
          src={images[currentImageIndex]}
          alt="Modern lifestyle" 
          className={`object-cover w-full h-full transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 text-black h-full flex items-center">
        <div className="max-w-xl">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium rounded-full bg-white backdrop-blur-sm">
            Elevate Your Lifestyle
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Curated Designs for <br/>
            <span className="text-white">
              Modern Living
            </span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="bg-white text-black hover:bg-white/90 hover:text-black px-8 py-3 rounded-md font-medium text-lg">
              Explore Collection
            </button>
            {getTotalProductCount() > 0 && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md text-white">
                <span className="font-bold">{getTotalProductCount()}</span> products available
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Image carousel indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentImageIndex(index);
                setIsTransitioning(false);
              }, 500);
              
              // Reset the interval timer when manually changing images
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                    setIsTransitioning(false);
                  }, 500);
                }, 5000);
              }
            }}
            className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}