import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { LoadingSkeleton } from '../HelperUI/Loading';

interface PromotionImage {
  id: string;
  type: string;
  image_url: string | null;
  created_at: string;
  title?: string;
  description?: string;
}

interface ImgCarouselProps {
  images: PromotionImage[];
  autoplayDelay?: number;
  height?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
}

export default function ImgCarousel({
  images,
  autoplayDelay = 4000,
  height = "h-96",
  showPagination = true,
  showNavigation = true
}: ImgCarouselProps) {
  const navigate = useNavigate();
  const [validImages, setValidImages] = useState<PromotionImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter valid images on mount or when images prop changes
  useEffect(() => {
    setValidImages(images.filter(img => img.image_url));
    setIsLoading(false);
  }, [images]);

  const handleImageClick = useCallback((type: string) => {
    switch (type) {
      case 'books': 
        navigate('/category/all');
        break;

      default: 
          navigate('/category/all');
    }
  }, [navigate]);

  // Handle slide change
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  // Show loading state or no images message
  if (isLoading) {
    return (
<LoadingSkeleton/>
    );
  }

  if (!validImages.length) {
    return (
      <div className={`w-full ${height} flex items-center justify-center bg-gray-100 text-gray-600`}>
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="relative group h-[400px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        loop={true}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        speed={800}
        slidesPerView={1}
        spaceBetween={0}
        
        pagination={showPagination ? { 
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} h-2 w-2"></span>`;
          }
        } : false}
        effect="fade"
        className={`w-full ${height} rounded-lg overflow-hidden shadow-lg`}
        onSlideChange={handleSlideChange}
      >
        {validImages.map((img, index) => (
          <SwiperSlide key={img.id} className="relative cursor-pointer">
            <div 
              className="relative w-full h-full overflow-hidden"
              onClick={() => handleImageClick(img.type)}
              aria-label={`${img.type} banner - click to view details`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick(img.type);
                }
              }}
            >
              <img
                src={img.image_url!}
                alt={`${img.title || img.type} banner`}
                className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/fallback-banner.jpg';
                  target.classList.add('opacity-90');
                }}
              />
              
              {/* Overlay gradient always visible but darkens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-0 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold mb-2 capitalize">
                    {img.title || `${img.type} Offers`}
                  </h3>
                  <p className="text-sm max-w-md mb-4 opacity-90">
                    {img.description || "Click to explore our latest deals and products"}
                  </p>
                  <button 
                    className="px-4 py-2 bg-white text-black font-medium rounded hover:bg-opacity-90 transition-colors duration-200 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick('books');
                    }}
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom indicator for currently active slide */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 right-4 z-10 bg-black/30 px-3 py-1 rounded-full text-white text-xs font-medium">
          {activeIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  );
}