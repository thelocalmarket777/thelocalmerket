import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ShoppingBag, Tag, Star, Eye } from 'lucide-react';
import { DirectCheckoutState, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import RemoteServices from '@/RemoteService/Remoteservice';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'md',

}) => {
  const { addItem, buynowCartfunc } = useCart();
  const currencySymbol = 'Rs.';
  const { toast } = useToast();
  const navigate = useNavigate();
  

  const [isWishlisted, setIsWishlisted] = useState(product?.is_wishlisted || false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

 
  const hasDiscount = product?.discount && product?.discount > 0;
  

  const discountPercentage =product?.discount

  const sizeConfig = {
    sm: {
      imageHeight: 'h-36',
      padding: 'p-3',
      titleClamp: 'line-clamp-1',
      titleHeight: 'h-6',
      buttonSize: 'sm' as const,
      iconSize: 12,
      heartSize: 16
    },
    md: {
      imageHeight: 'h-48',
      padding: 'p-4',
      titleClamp: 'line-clamp-2',
      titleHeight: 'h-12',
      buttonSize: 'sm' as const,
      iconSize: 14,
      heartSize: 20
    },
    lg: {
      imageHeight: 'h-56',
      padding: 'p-5',
      titleClamp: 'line-clamp-2',
      titleHeight: 'h-14',
      buttonSize: 'default' as const,
      iconSize: 16,
      heartSize: 22
    }
  };

  const config = sizeConfig[size];

  const renderRating = () => {
    if (!product?.rating) return null;

    const rating = parseFloat(product.rating);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center ">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={config.iconSize}
              className={
                i < fullStars
                  ? "text-yellow-500 fill-yellow-500"
                  : i === fullStars && hasHalfStar
                  ? "text-yellow-500 fill-yellow-500 opacity-50"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="ml-1 text-xs text-gray-500 font-medium">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };


  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlistLoading) return;
    
    setIsWishlistLoading(true);

    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);
    
    try {
      const response = await RemoteServices.createwishlist({ product_id: product.id });
      
      toast({
        title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        description: response.data.message || 'Wishlist updated successfully',
        duration: 2000,
      });
    } catch (error) {
      setIsWishlisted(previousState);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      addItem(product, 1);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add item to cart',
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
     buynowCartfunc(product, 1);
      navigate('/checkout/buy-now');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to proceed to checkout'
      });
    }
  };

 

  const getProductImage = () => {
    if (imageError) {
      return "/api/placeholder/300/300";
    }
    
    if (product.image_url) {
      return product.image_url;
    }
    
    if (product.media && product.media.length > 0) {
      return product.media[0].file;
    }
    
    return "/api/placeholder/300/300";
  };

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="contents">
        <div className="absolute top-3 left-0 right-0 z-10 flex justify-between items-start px-3">
          {hasDiscount && (
            <div className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <Tag size={12} className="mr-1" />
              {discountPercentage}% OFF
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              className={`p-2 rounded-full transition-all duration-200 shadow-md ${isWishlisted ? 'bg-red-500 text-white shadow-red-500/25' : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500'} ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              onClick={handleWishlist}
              disabled={isWishlistLoading}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={config.heartSize} className={`transition-all duration-200 ${isWishlisted ? 'fill-current' : ''} ${isWishlistLoading ? 'animate-pulse' : ''}`}/>
            </button>
          </div>
        </div>
        <div className={`${config.imageHeight} w-full overflow-hidden bg-gray-50 relative`}>
          <img
            src={getProductImage()}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
        
          <div className={`
            absolute inset-0 bg-black/0 transition-all duration-300
            ${isHovered ? 'bg-black/5' : ''}
          `} />
        </div>

        <div className={`flex flex-1 flex-col ${config.padding}`}>
          <h3 className={`font-semibold text-gray-900 ${config.titleClamp} ${config.titleHeight} leading-tight`}>
            {product?.name}
          </h3>
          {renderRating()}
          <div className="mt-3 flex-1 flex flex-col justify-end">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {currencySymbol} {Number(product.finalprice).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {currencySymbol} {Number(product.price).toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {currencySymbol} {Number(product.price).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              size={config.buttonSize}
              variant="outline"
              className="flex-1 gap-1.5 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart size={config.iconSize} />
              <span className="font-medium">
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </span>
            </Button>
            
            <Button
              size={config.buttonSize}
              variant="default"
              className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700 transition-colors"
              onClick={handleBuyNow}
            >
              <ShoppingBag size={config.iconSize} />
              <span className="font-medium">Buy Now</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;