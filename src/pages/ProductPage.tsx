
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Package, 
  ArrowLeft,
  ThumbsUp,
  User
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductMedia } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Mock reviews data (in a real app, this would come from an API)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Great product! Exactly as described and arrived quickly.',
      date: '2023-08-15',
      helpful: 12
    },
    {
      id: 2,
      user: 'Jane Smith',
      rating: 4,
      comment: 'Good quality, but the color is slightly different from what was shown in the pictures.',
      date: '2023-07-22',
      helpful: 5
    },
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 5,
      comment: 'Excellent value for money. Would definitely buy again.',
      date: '2023-06-30',
      helpful: 8
    },
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productId = parseInt(id);
        const fetchedProduct = await api.products.getById(productId);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    // In a real app, you would send this to an API
    const newReview = {
      id: reviews.length + 1,
      user: 'You',
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setReviewRating(5);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/4"></div>
              <div className="h-24 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-100 animate-pulse rounded w-1/3"></div>
              <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render if product not found
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Generate stars based on rating
  const renderRating = (rating: string | number | undefined, size = 18) => {
    if (!rating) return null;
    
    const ratingNum = typeof rating === 'string' ? parseInt(rating) : rating;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < ratingNum ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
        {typeof rating === 'string' && (
          <span className="ml-2 text-sm text-gray-500">{`(${rating} rating)`}</span>
        )}
      </div>
    );
  };

  // Mock media for carousel
  const mediaItems: ProductMedia[] = product.media || [
    { id: 1, product_id: product.id, file: product.imageUrl, file_type: 'image', description: 'Main product image' },
    { id: 2, product_id: product.id, file: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', file_type: 'image', description: 'Product from another angle' },
    { id: 3, product_id: product.id, file: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', file_type: 'image', description: 'Product in use' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-brand-blue flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Media Carousel */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {mediaItems.length > 1 ? (
              <Carousel className="w-full" opts={{ loop: true, align: "start" }} autoplay={true}>
                <CarouselContent>
                  {mediaItems.map((media, index) => (
                    <CarouselItem key={index}>
                      {media.file_type === 'image' && (
                        <img
                          src={media.file}
                          alt={media.description || product.name}
                          className="w-full h-[500px] object-contain"
                        />
                      )}
                      {media.file_type === 'video' && (
                        <video
                          src={media.file}
                          controls
                          className="w-full h-[500px] object-contain"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1 py-2">
                  {mediaItems.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === 0 ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <CarouselPrevious className="-left-12 lg:-left-5 bg-white hover:bg-gray-100" />
                <CarouselNext className="-right-12 lg:-right-5 bg-white hover:bg-gray-100" />
              </Carousel>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px' }}
              />
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="mb-4">
              {renderRating(product.rating)}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Stock status */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity selector and add to cart */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center text-gray-900"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gap-2"
                size="lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              
              <Button variant="outline" size="lg" className="gap-2">
                <Heart size={20} />
                Add to Wishlist
              </Button>
            </div>

            {/* Shipping Information */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-500">On orders over $50. Otherwise $4.99.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-500">30 day return policy. Return for any reason.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          
          {/* Write a review form */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-xl font-semibold">Write a Review</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Your Rating:</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              star <= reviewRating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full min-h-[120px]"
                  />
                </div>
                <Button type="submit" disabled={reviewText.trim() === ''}>
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Reviews list */}
          <div className="space-y-6">
            <ScrollArea className="h-[600px] rounded-md">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <User size={20} className="text-gray-400" />
                            <span className="font-medium">{review.user}</span>
                          </div>
                          <div className="mt-1">
                            {renderRating(review.rating, 16)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ThumbsUp size={16} />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductPage;
