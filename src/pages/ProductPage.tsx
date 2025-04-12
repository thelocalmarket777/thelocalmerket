import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ThumbsUp,
  User,
  ShoppingBag,
  Tag,
  Clock
} from 'lucide-react';
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
import RemoteServices from '@/RemoteService/Remoteservice';
import Loadingdiv from '@/components/ui/loadingdiv';
import Nothing from '@/components/ui/Nothing';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import Shippinginfo from '@/components/ui/shippinginfo';

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [mediaItems, setMediaItems] = useState<ProductMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  
  // Get current user from localStorage with error handling
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return {};
    }
  }, []);
  
  const currentUserId = currentUser?.id;

  // Calculate discounted price using memoization
  const { hasDiscount, discountedPrice } = useMemo(() => {
    const hasDisc = Boolean(product?.discount && product.discount > 0);
    const discPrice = hasDisc && product?.price && product?.discount
      ? product.price - (product.price * (product.discount / 100))
      : product?.price ?? 0;
    
    return { hasDiscount: hasDisc, discountedPrice: discPrice };
  }, [product?.discount, product?.price]);

  // Fetch product data
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await RemoteServices.getById(id);
        
        if (!mounted) return;
        
        if (res.status === 200) {
          // Update product data
          setProduct(res.data.product);
          
          // Set media items if they exist
          setMediaItems(res.data.product.media || []);
          
          // Process reviews with consistent data structure
          const processedReviews = res.data.product.reviews.map(review => ({
            ...review,
            date: new Date(review.created_at).toLocaleDateString(),
            likes: review.likes || 0,
            likedBy: review.likedBy || [],
            user: review.user || 'Anonymous'
          }));
          
          setReviews(processedReviews);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to fetch product details",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id, toast]);

  // Handle quantity change with bounds checking
  const handleQuantityChange = useCallback((value: number) => {
    const maxQuantity = product?.stock ?? 1;
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  }, [product?.stock]);

  // Add to cart handler
  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  }, [product, quantity, addItem, toast]);

  // Buy now handler
  const handleBuyNow = useCallback(() => {
    if (product) {
      addItem(product, quantity);
      navigate('/checkout');
    }
  }, [product, quantity, addItem, navigate]);

  // Like a review
  const handleLikeReview = useCallback(async (reviewId: string) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like reviews",
      });
      return;
    }
    
    try {
      // For demonstration: in a real app, this would be an API call
      setReviews(prevReviews => prevReviews.map(review => {
        if (review.id === reviewId) {
          const isAlreadyLiked = review.likedBy?.includes(currentUserId);
          const updatedLikedBy = isAlreadyLiked 
            ? review.likedBy.filter(id => id !== currentUserId)
            : [...(review.likedBy || []), currentUserId];
          
          return {
            ...review,
            likes: isAlreadyLiked ? review.likes - 1 : review.likes + 1,
            likedBy: updatedLikedBy
          };
        }
        return review;
      }));
      
      toast({
        title: "Success",
        description: "Review like updated",
      });
    } catch (error) {
      console.error("Error liking review:", error);
      toast({
        title: "Error",
        description: "Failed to update review like",
      });
    }
  }, [currentUserId, toast]);

  // Review submission using async/await and a submission state
  const handleSubmitReview = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewText.trim()) return;
    
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
      });
      return;
    }

    const reviewData = {
      product: product?.id,
      rating: reviewRating,
      comment: reviewText.trim(),
      user: currentUserId
    };

    setIsSubmittingReview(true);
    
    try {
      const res = await RemoteServices.createReviewOnProduct(reviewData);
      if (res.status === 200) {
        const newReview = {
          ...res.data,
          date: new Date(res.data.created_at).toLocaleDateString(),
          likes: 0,
          likedBy: [],
        };
        
        setReviews(prev => [newReview, ...prev]);
        setReviewText('');
        setReviewRating(5);
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  }, [reviewText, reviewRating, product?.id, currentUserId, toast]);

  // Filter reviews based on active tab - memoized
  const filteredReviews = useMemo(() => {
    switch(activeTab) {
      case "newest":
        return [...reviews].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "highest":
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...reviews].sort((a, b) => a.rating - b.rating);
      case "most-liked":
        return [...reviews].sort((a, b) => b.likes - a.likes);
      default:
        return reviews;
    }
  }, [reviews, activeTab]);

  // Helper to render product image with fallback
  const renderProductImage = useCallback((src?: string, alt?: string) => (
    <div className="relative w-full h-[500px]">
      <img
        src={src || fallbackImage}
        alt={alt?.trim() || "Product image"}
        className="w-full h-full object-contain transition-opacity duration-300"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget;
          target.src = fallbackImage;
          target.onerror = null; // Prevent infinite error loop
        }}
      />
    </div>
  ), []);

  // Render rating stars
  const renderRating = useCallback((rating: number, size = 18) => (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  ), []);

  // Render review submission form with submission state
  const renderReviewForm = useCallback(() => (
    <Card className="mb-8">
      <CardHeader>
        <h3 className="text-xl font-semibold">Write a Review</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="rating" className="text-sm font-medium">Your Rating:</label>
              <div className="flex" id="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                    disabled={isSubmittingReview}
                    aria-label={`Rate ${star} stars`}
                    aria-pressed={star === reviewRating}
                  >
                    <Star
                      size={20}
                      className={star <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              id="review-text"
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-[120px]"
              disabled={isSubmittingReview}
              aria-label="Review comment"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!reviewText.trim() || isSubmittingReview}
            aria-busy={isSubmittingReview}
          >
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  ), [handleSubmitReview, isSubmittingReview, reviewRating, reviewText]);

  // Render list of reviews with filter tabs
  const renderReviews = useCallback(() => (
    <>
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="newest">
            <Clock size={14} className="mr-1" />
            Newest
          </TabsTrigger>
          <TabsTrigger value="highest">Highest Rated</TabsTrigger>
          <TabsTrigger value="lowest">Lowest Rated</TabsTrigger>
          <TabsTrigger value="most-liked">Most Liked</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ScrollArea className="h-[500px] rounded-md">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card key={review.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={20} className="text-gray-400" aria-hidden="true" />
                      <span className="font-medium">{review.user}</span>
                      {review.date && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          <Clock size={12} className="mr-1" aria-hidden="true" />
                          {review.date}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1">
                      {renderRating(review.rating, 16)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`gap-1 ${review.likedBy?.includes(currentUserId) ? 'text-blue-600' : ''}`}
                    onClick={() => handleLikeReview(review.id)}
                    aria-label={`Mark review as helpful (${review.likes || 0} likes)`}
                    aria-pressed={review.likedBy?.includes(currentUserId)}
                  >
                    <ThumbsUp size={16} aria-hidden="true" />
                    Helpful ({review.likes || 0})
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
    </>
  ), [filteredReviews, currentUserId, handleLikeReview, renderRating]);

  // Loading state
  if (isLoading) {
    return <Loadingdiv />;
  }

  // Error state
  if (error) {
    return <Nothing title={'Error Loading Product'} content={error} />;
  }

  // Product not found state
  if (!product) {
    return <Nothing title={'Product Not Found'} content={'The product you are looking for doesn\'t exist or has been removed.'} />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-brand-blue flex items-center"
            aria-label="Back to shop"
          >
            <ArrowLeft size={16} className="mr-1" aria-hidden="true" />
            Back to shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images section */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Product tags */}
            <div className="absolute z-10 left-4 top-24">
              {product?.is_new && (
                <Badge className="bg-blue-500 mb-2 shadow-md">
                  <Tag size={12} className="mr-1" aria-hidden="true" /> New Arrival
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-red-500 shadow-md">
                  <Tag size={12} className="mr-1" aria-hidden="true" /> {product?.discount}% OFF
                </Badge>
              )}
            </div>
            
            {/* Product images carousel */}
            {mediaItems?.length > 0 ? (
              <div>
                <Carousel 
                  className="w-full" 
                  opts={{ loop: true, align: "start" }}
                  value={selectedImage}
                  onValueChange={setSelectedImage}
                >
                  <CarouselContent>
                    {mediaItems?.map((media, index) => (
                      <CarouselItem key={index}>
                        {media?.file_type === 'image'
                          ? renderProductImage(media?.file, media?.description || product?.name)
                          : null}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 lg:left-5 bg-white/70 hover:bg-white" />
                  <CarouselNext className="right-2 lg:right-5 bg-white/70 hover:bg-white" />
                </Carousel>

                {/* Thumbnail navigation */}
                <div className="flex justify-center gap-2 mt-4 px-4 overflow-x-auto">
                  {mediaItems?.map((media, index) => (
                    <button 
                      key={index} 
                      className={`h-16 w-16 rounded cursor-pointer border-2 overflow-hidden ${
                        selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={selectedImage === index}
                    >
                      <img 
                        src={media?.file} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              renderProductImage(product.image_url, product?.name)
            )}
          </div>

          {/* Product details section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
            
            {/* Product metadata badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product?.author && (
                <Badge variant="outline" className="text-sm">Author: {product?.author}</Badge>
              )}
              {product?.genre && (
                <Badge variant="outline" className="text-sm">Genre: {product?.genre}</Badge>
              )}
              {product?.totalpage > 0 && (
                <Badge variant="outline" className="text-sm">Pages: {product?.totalpage}</Badge>
              )}
              {product?.language && (
                <Badge variant="outline" className="text-sm">Language: {product?.language}</Badge>
              )}
              {product?.madeinwhere && (
                <Badge variant="outline" className="text-sm">MFG: {product?.madeinwhere}</Badge>
              )}
              {product?.ageproduct && (
                <Badge variant="outline" className="text-sm">Health: {product?.ageproduct}</Badge>
              )}
            </div>
            
            {/* Rating summary */}
            <div className="mb-4 flex items-center">
              {renderRating(Number(product?.rating) || 0)}
              <span className="ml-2 text-sm text-gray-500">
                {reviews?.length} {reviews?.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            
            {/* Price display with discount */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    NPR {discountedPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    NPR {product?.price}
                  </span>
                  <Badge className="bg-red-500 ml-2">Save {product?.discount}%</Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  NPR {product?.price}
                </span>
              )}
            </div>

            {/* Product description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product?.description}</p>
            </div>
            
            {/* Stock status */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product?.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {product?.stock > 0
                  ? `In Stock (${product?.stock} available)`
                  : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product?.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center text-gray-900"
                    aria-label="Product quantity"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product?.stock || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
                className="flex-1 gap-2"
                size="lg"
                aria-label="Add to cart"
              >
                <ShoppingCart size={20} aria-hidden="true" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product?.stock === 0}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
                aria-label="Buy now"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                aria-label="Add to wishlist"
              >
                <Heart size={20} aria-hidden="true" />
                Wishlist
              </Button>
            </div>
            
            {/* Shipping information section */}
            <Shippinginfo />
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          {renderReviewForm()}
          <div className="space-y-6">{renderReviews()}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductPage;