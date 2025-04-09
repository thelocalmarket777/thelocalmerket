import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const currencySymbol = 'NPR';
  // Generate stars based on rating
  const renderRating = () => {
    if (!product.rating) return null;

    const rating = parseInt(product.rating);
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
          // Add wishlist functionality
        }}
      >
        <Heart size={20} />
      </button>

      {/* Product image */}
      {(product.imageUrl !== '' || product.media.length > 0) ? (
        <div className="aspect-h-3 aspect-w-4 bg-gray-50">
          {product.imageUrl !== '' ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:opacity-90"
            />
          ) : product.media.length > 0 ? (
            <img
              src={product.media[0].file}
              alt={product.name}
              className="h-[220px] w-full object-cover object-center group-hover:opacity-90"
            />
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
              alt="No image available"
              className="h-[220px] w-full object-contain group-hover:opacity-90"
            />
          )}
        </div>
      ) : (
        <div className="aspect-h-3 aspect-w-4 bg-gray-50">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
            alt="No image available"
            className="h-[220px] w-full object-contain group-hover:opacity-90"
          />
        </div>
      )}

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>

        {renderRating()}

        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-semibold text-gray-900">{currencySymbol} &nbsp;{product.price}</p>

          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            <span className="sr-only sm:not-sr-only sm:inline-block">Add</span>
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
