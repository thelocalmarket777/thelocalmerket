import React, { useEffect, useState, useCallback } from 'react';
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

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [mediaItems, setMediaItems] = useState<ProductMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch product and reviews by ID
  const fetchProduct = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await RemoteServices.getById(id);
      if (res.status === 200) {
        setProduct(res.data);
        setMediaItems(res.data.media || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch product details.",
        });
      }

      // Fetch reviews
      const reviewRes = await RemoteServices.getReviewOnProduct(id);
      if (reviewRes.status === 200) {
        console.log('reviews:', reviewRes.data);
        setReviews(reviewRes.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch reviews.",
        });
      }
    } catch (error) {
      console.error("Error fetching product or reviews:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle quantity change with bounds checking
  const handleQuantityChange = (value: number) => {
    const maxQuantity = product?.stock ?? 1;
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };

  // Review submission using async/await and a submission state
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const reviewData = {
      productId: product?.id,
      rating: reviewRating,
      comment: reviewText.trim(),
    };

    setIsSubmittingReview(true);
    try {
      const res = await RemoteServices.createReviewOnProduct(reviewData);
      if (res.status === 200) {
        setReviews(prev => [...prev, res.data]);
        setReviewText('');
        setReviewRating(5);
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper to render product image with fallback
  const renderProductImage = (src?: string, alt?: string) => (
    <img
      src={src || fallbackImage}
      alt={alt || "Product image"}
      className="w-full h-[500px] object-contain"
      onError={(e) => {
        e.currentTarget.src = fallbackImage;
      }}
    />
  );

  // Render rating stars
  const renderRating = (rating: number, size = 18) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
        />
      ))}
    </div>
  );

  // Render review submission form with submission state
  const renderReviewForm = () => (
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
                    disabled={isSubmittingReview}
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
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-[120px]"
              disabled={isSubmittingReview}
            />
          </div>
          <Button type="submit" disabled={!reviewText.trim() || isSubmittingReview}>
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // Render list of reviews
  const renderReviews = () => (
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
              {/* <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsUp size={16} />
                  Helpful ({review.helpful})
                </Button>
              </div> */}
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      )}
    </ScrollArea>
  );

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-brand-blue flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {mediaItems.length > 0 ? (
              <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                <CarouselContent>
                  {mediaItems.map((media, index) => (
                    <CarouselItem key={index}>
                      {media.file_type === 'image'
                        ? renderProductImage(media.file, media.description || product.name)
                        : null}
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
              renderProductImage(product.imageUrl, product.name)
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              {product.author && (
                <span className="text-sm font-medium text-gray-500"> Author :{product.author}</span>
              )}
              &nbsp;
              {product.genre && (
                <span className="text-sm font-medium text-gray-500"> Genre :{product.genre}</span>
              )}
              </div>
            <div className="mb-4">
              {renderRating(Number(product.rating) || 0)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              NPR {product.price}
            </div>
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : 'Out of Stock'}
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium">Quantity</label>
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
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
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
            </div>
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
              {/* <Button variant="outline" size="lg" className="gap-2">
                <Heart size={20} />
                Add to Wishlist
              </Button> */}
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-500">On orders over Rs 500. Otherwise RS 80.</p>
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
