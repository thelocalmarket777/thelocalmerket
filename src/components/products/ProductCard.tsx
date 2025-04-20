import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ShoppingBag, Tag } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import RemoteServices from '@/RemoteService/Remoteservice';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const currencySymbol = 'NPR';
  const { toast } = useToast();
  // Check if discount is available
  const hasDiscount = product?.discount && product?.discount > 0;
  const afterDiscountAmount = hasDiscount 
    ? product?.price - (product?.price * (product?.discount / 100))
    : product?.price;

  // Generate stars based on rating
  const renderRating = () => {
    if (!product?.rating) return null;

    const rating = parseInt(product?.rating);
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm text-gray-500">{`(${rating}.0)`}</span>
      </div>
    );
  };

  const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart first
    addItem(product, 1);
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
    >
      {/* Wishlist button */}
      <button
        className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 text-gray-900 transition-all hover:text-rose-500"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          RemoteServices.createwishlist({product_id:product.id}).then((res) => {
            toast({
                title: 'Added to wish list Successfully',
                description: res.data.message,
            });

        }).catch(error => {
            toast({
                variant: 'destructive',
                title: ' Failed',
                description: 'An error occurred ',
            });
        })
         
        }}
      >
        <Heart size={20} />
      </button>

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute left-0 top-3 z-10">
          <div className="flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-r">
            <Tag size={14} className="mr-1" />
            {product.discount}% OFF
          </div>
        </div>
      )}

      {/* Product image */}
      <div className="h-48 w-full overflow-hidden bg-gray-50">
        {(product.image_url !== '' || product.media?.length > 0) ? (
          product.image_url !== '' ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:opacity-90"
            />
          ) : product.media?.length > 0 ? (
            <img
              src={product.media[0].file}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:opacity-90"
            />
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
              alt="No image available"
              className="h-full w-full object-contain object-center group-hover:opacity-90"
            />
          )
        ) : (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
            alt="No image available"
            className="h-full w-full object-contain object-center group-hover:opacity-90"
          />
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{product?.name}</h3>

        {renderRating()}

        <div className="mt-2">
          {hasDiscount ? (
            <div className="flex items-center">
              <p className="text-lg font-semibold text-gray-900">
                {currencySymbol} {product.finalprice}
              </p>
              <p className="ml-2 text-sm text-gray-500 line-through">
                {currencySymbol} {product?.price}
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {currencySymbol} {product?.price}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            <span className="sr-only sm:not-sr-only sm:inline-block">Add</span>
          </Button>
          
          <Button
            size="sm"
            variant="default"
            className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
            onClick={handleBuyNow}
          >
            <ShoppingBag size={14} />
            <span className="sr-only sm:not-sr-only sm:inline-block">Buy Now</span>
          </Button>
        </div>
      </div>
    </Link>
  );
};

// Missing Star import - adding it here
const Star = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

export default ProductCard;