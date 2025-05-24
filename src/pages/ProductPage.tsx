import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Star, ShoppingCart, Heart, ArrowLeft, ThumbsUp,
  User, ShoppingBag, Clock
} from 'lucide-react';
import { Product, ProductMedia } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import RemoteServices from '@/RemoteService/Remoteservice';
import Loadingdiv from '@/components/ui/loadingdiv';
import Nothing from '@/components/ui/Nothing';
import {
  Tabs, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import Shippinginfo from '@/components/ui/shippinginfo';

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ZOOM = 2.2; // Magnification multiplier
const ZOOM_SIZE = 260; // Magnifier size px

const ProductPage = () => {
  // ----- STATE: all grouped in one object -----
  const [state, setState] = useState({
    product: null as Product | null,
    mediaItems: [] as ProductMedia[],
    reviews: [] as any[],
    isLoading: true,
    error: null as string | null,
    activeTab: "all",
    isWishlistProcessing: false,
    isSubmittingReview: false,
    reviewText: "",
    reviewRating: 5,
    quantity: 1,
    gallery: {
      selectedIndex: 0,
      zoom: false,
      zoomPos: { x: 0, y: 0 }
    }
  });

  const { id } = useParams<{ id: string }>();
  const { addItem, buynowCartfunc } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // For Enter-to-submit focus
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch { return {}; }
  }, []);
  const currentUserId = currentUser?.id;

  // --- Utility
  const hasDiscount = state.product?.discount && Number(state.product.discount) > 0;
  const allImages: string[] = useMemo(() => {
    const mainImg = state.product?.image || fallbackImage;
    const mediaImgs = (state.mediaItems || []).map(m => m.file || fallbackImage);
    return Array.from(new Set([mainImg, ...mediaImgs])).filter(
      (img, idx) => img && img !== "" && (img !== fallbackImage || idx === 0)
    ) || [fallbackImage];
  }, [state.product, state.mediaItems]);

  // ----- FETCH DATA -----
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setState(s => ({ ...s, isLoading: true, error: null }));
      try {
        const res = await RemoteServices.getById(id);
        if (!mounted) return;
        if (res.status === 200) {
          const prod = res.data.product;
          const processedReviews = prod.reviews.map((review: any) => ({
            ...review,
            date: new Date(review.created_at).toLocaleDateString(),
            likes: review.likes || 0,
            likedBy: review.likedBy || [],
            user: review.user || 'Anonymous'
          }));
          setState(s => ({
            ...s,
            product: prod,
            mediaItems: prod.media || [],
            reviews: processedReviews,
            isLoading: false
          }));
        }
      } catch {
        if (!mounted) return;
        setState(s => ({
          ...s, isLoading: false,
          error: "Failed to load product details. Please try again later."
        }));
        toast({ title: "Error", description: "Failed to fetch product details" });
      }
    })();
    return () => { mounted = false; };
  }, [id, toast]);

  // Quantity
  const handleQuantityChange = (value: number) => {
    const maxQuantity = Number(state.product?.stock ?? 1);
    if (value >= 1 && value <= maxQuantity) setState(s => ({ ...s, quantity: value }));
  };

  // Add to cart
  const handleAddToCart = () => {
    if (state.product) {
      addItem(state.product, state.quantity);
      toast({
        title: "Added to cart",
        description: `${state.quantity} x ${state.product.name} added to your cart`,
      });
    }
  };
  // Buy now
  const handleBuyNow = () => {
    if (state.product) {
           localStorage.removeItem('buynowquantity');
    localStorage.removeItem('buynowcart');
      buynowCartfunc(state.product, state.quantity);
      navigate('/checkout/buy-now');
     
    }
  };

  // ----------- Review Handlers ------------

  const handleLikeReview = useCallback(async (reviewId: string) => {
    // Get currentUserId INSIDE the function for a stable reference
    const currentUserIdLocal = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}')?.id;
      } catch {
        return undefined;
      }
    })();

    if (!currentUserIdLocal) {
      toast({ title: "Authentication required", description: "Please sign in to like reviews" });
      return;
    }
    try {
      const res = await RemoteServices.like_on_product_review(reviewId);
      if (res.status === 200) {
        setState(s => ({
          ...s,
          reviews: s.reviews.map(review => {
            if (review.id === reviewId) {
              const isAlreadyLiked = review.likedBy?.includes(currentUserIdLocal);
              const updatedLikedBy = isAlreadyLiked
                ? review.likedBy.filter((id: any) => id !== currentUserIdLocal)
                : [...(review.likedBy || []), currentUserIdLocal];
              return {
                ...review,
                likes: isAlreadyLiked ? review.likes - 1 : review.likes + 1,
                likedBy: updatedLikedBy
              };
            }
            return review;
          })
        }));
        toast({ title: "Success", description: "Review like updated" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update review like" });
    }
  }, [toast, setState]);

  // This handles both form submit and keyboard events
  const handleSubmitReview = useCallback(async (e?: React.FormEvent | React.KeyboardEvent) => {
    // Handle keyboard event first
    if (e && 'key' in e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
      } else {
        return; // Exit if not Enter or if Shift+Enter
      }
    }

  

    // Always read state fresh inside callback
    setState(prev => {
      const reviewText = prev.reviewText;
      const reviewRating = prev.reviewRating;
      const productId = prev.product?.id;
      // Get user each time
      let currentUserIdLocal: string | undefined;
      try {
        currentUserIdLocal = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      } catch { /* ignore */ }

      if (!reviewText.trim() || !currentUserIdLocal) {
        if (!reviewText.trim()) return prev; // do nothing if empty
        toast({
          title: "Authentication required",
          description: "Please sign in to submit a review",
        });
        return prev;
      }

      // Start submitting
      (async () => {
        setState(s => ({ ...s, isSubmittingReview: true }));
        try {
          const res = await RemoteServices.createReviewOnProduct({
            productId,
            rating: reviewRating,
            comment: reviewText.trim(),
            user: currentUserIdLocal
          });
          if (res.status === 201) {
            const newReview = {
              ...res.data,
              date: new Date(res.data.created_at).toLocaleDateString(),
              likes: 0,
              likedBy: [],
            };
            setState(s => ({
              ...s,
              reviews: [newReview, ...s.reviews],
              reviewText: '',
              reviewRating: 0
            }));
            toast({ title: "Success", description: "Review submitted successfully!" });
          }
        } catch {
          toast({ title: "Error", description: "Failed to submit review" });
        } finally {
          setState(s => ({ ...s, isSubmittingReview: false }));
        }
      })();

      // Don't update state here, async will update as needed
      return prev;
    });
  }, [toast]);

  // Review filter
  const filteredReviews = useMemo(() => {
    switch (state.activeTab) {
      case "newest": return [...state.reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "highest": return [...state.reviews].sort((a, b) => b.rating - a.rating);
      case "lowest": return [...state.reviews].sort((a, b) => a.rating - b.rating);
      case "most-liked": return [...state.reviews].sort((a, b) => b.likes - a.likes);
      default: return state.reviews;
    }
  }, [state.reviews, state.activeTab]);

  // Wishlist
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) {
      toast({
        title: "Authentication Required", description: "Please login to manage wishlist", variant: "destructive"
      });
      navigate('/login'); return;
    }
    if (!state.product || state.isWishlistProcessing) return;
    setState(s => ({ ...s, isWishlistProcessing: true }));
    try {
      if (!state.product.is_wishlisted) {
        const response = await RemoteServices.createwishlist({ product_id: state.product.id });
        setState(s => ({ ...s, product: { ...s.product!, is_wishlisted: true }, isWishlistProcessing: false }));
        toast({ title: 'Added to Wishlist', description: response.data.message || 'Product added to wishlist' });
      } else {
        const response = await RemoteServices.deletewishlistfile(state.product.id);
        setState(s => ({ ...s, product: { ...s.product!, is_wishlisted: false }, isWishlistProcessing: false }));
        toast({ title: 'Removed from Wishlist', description: response.data.message || 'Product removed from wishlist' });
      }
    } catch {
      toast({
        variant: 'destructive', title: 'Operation Failed', description: 'Failed to update wishlist. Please try again.',
      });
      setState(s => ({ ...s, isWishlistProcessing: false }));
    }
  };

  // Gallery - Thumbnail select
  const handleThumbSelect = (idx: number) => {
    setState(s => ({ ...s, gallery: { ...s.gallery, selectedIndex: idx } }));
  };

  // Gallery - Zoom & mouse
  const handleZoom = (zoomed: boolean) => setState(s => ({
    ...s, gallery: { ...s.gallery, zoom: zoomed }
  }));

  const handleZoomMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    setState(s => ({
      ...s, gallery: { ...s.gallery, zoomPos: { x, y } }
    }));
  };

  // Render rating
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

  // Render review form
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
                    onClick={() => setState(s => ({ ...s, reviewRating: star }))}
                    className="focus:outline-none"
                    disabled={state.isSubmittingReview}
                    aria-label={`Rate ${star} stars`}
                    aria-pressed={star === state.reviewRating}
                  >
                    <Star
                      size={20}
                      className={star <= state.reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              ref={reviewTextareaRef}
              id="review-text"
              placeholder="Share your experience with this product..."
              value={state.reviewText}
              onChange={e => setState(s => ({ ...s, reviewText: e.target.value }))}
              onKeyDown={handleSubmitReview}
              className="w-full min-h-[120px]"
              disabled={state.isSubmittingReview}
              aria-label="Review comment"
            />
          </div>
          <Button
            type="submit"
            disabled={!state.reviewText.trim() || state.isSubmittingReview}
            aria-busy={state.isSubmittingReview}
          >
            {state.isSubmittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  ), [handleSubmitReview, state.isSubmittingReview, state.reviewRating, state.reviewText]);

  // Render all reviews
  const renderReviews = useCallback(() => (
    <>
      <Tabs defaultValue="all" className="mb-6" onValueChange={v => setState(s => ({ ...s, activeTab: v }))}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="newest"><Clock size={14} className="mr-1" />Newest</TabsTrigger>
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

  // --------------- RENDER ---------------

  if (state.isLoading) return <Loadingdiv />;
  if (state.error) return <Nothing title="Error Loading Product" content={state.error} />;
  if (!state.product) return <Nothing title="Product Not Found" content="The product you are looking for doesn't exist or has been removed." />;

  // --- Gallery image style: magnifier at mouse ---
  const mainImg = allImages[state.gallery.selectedIndex];
  const zoomVisible = state.gallery.zoom;
  const zoomPos = state.gallery.zoomPos;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <span
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 cursor-pointer hover:text-brand-blue flex items-center"
            aria-label="Back to shop"
          >
            <ArrowLeft size={16} className="mr-1" aria-hidden="true" />
            Back to shop
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* -- GALLERY -- */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-4 bg-white rounded-xl shadow-sm ">
              <div
                className="relative w-full aspect-square rounded-lg max-h-[500px] overflow-hidden group bg-white shadow-sm"
                tabIndex={0}
                aria-label="Product image zoom"
                style={{ outline: "none" }}
                onMouseEnter={() => handleZoom(true)}
                onMouseLeave={() => handleZoom(false)}
                onMouseMove={zoomVisible ? handleZoomMove : undefined}
              >
                {/* Main image */}
                <img
                  src={mainImg}
                  alt={state.product.name}
                  className={`object-contain w-full  h-full transition-transform duration-200 ${zoomVisible ? "scale-110 cursor-zoom-out" : "scale-100 cursor-zoom-in"}`}
                  style={{ pointerEvents: "none", userSelect: "none", borderRadius: "1rem" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                />
                {/* Magnifier */}
                {zoomVisible && (
                  <div
                    className="absolute border-2 border-blue-400 shadow-lg rounded-lg pointer-events-none z-20"
                    style={{
                      width: ZOOM_SIZE,
                      height: ZOOM_SIZE,
                      left: `calc(${zoomPos.x * 100}% - ${ZOOM_SIZE / 2}px)`,
                      top: `calc(${zoomPos.y * 100}% - ${ZOOM_SIZE / 2}px)`,
                      background: `url('${mainImg}') no-repeat`,
                      backgroundSize: `${ZOOM * 100}% ${ZOOM * 100}%`,
                      backgroundPosition: `${zoomPos.x * 100}% ${zoomPos.y * 100}%`,
                      opacity: 0.97,
                      transition: 'background-position 0.07s',
                      boxShadow: "0 0 16px rgba(0,0,0,0.18)"
                    }}
                  />
                )}
                {hasDiscount && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white px-3 py-1">
                      {state.product.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`h-16 w-16 rounded-md overflow-hidden border transition-all duration-200 ${state.gallery.selectedIndex === idx ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-200"}`}
                    onClick={() => handleThumbSelect(idx)}
                    aria-label={`Select image ${idx + 1}`}
                    tabIndex={0}
                    style={{ background: "#fafbfc" }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* -- Product Info -- */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{state.product?.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {state.product?.author && (
                <Badge variant="outline" className="text-sm">Author: {state.product?.author}</Badge>
              )}
              {state.product?.genre && (
                <Badge variant="outline" className="text-sm">Genre: {state.product?.genre}</Badge>
              )}
              {state.product?.totalpage && (
                <Badge variant="outline" className="text-sm">Page: {state.product?.totalpage}</Badge>
              )}
              {state.product?.language && (
                <Badge variant="outline" className="text-sm">Language: {state.product?.language}</Badge>
              )}
              {state.product?.madeinwhere && (
                <Badge variant="outline" className="text-sm">MFG: {state.product?.madeinwhere}</Badge>
              )}
              {state.product?.ageproduct && (
                <Badge variant="outline" className="text-sm">Health: {state.product?.ageproduct}</Badge>
              )}
            </div>
            <div className="mb-4 flex items-center">
              {renderRating(Number(state.product?.rating) || 0)}
              <span className="ml-2 text-sm text-gray-500">
                {state.reviews?.length} {state.reviews?.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    NPR {state.product?.finalprice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    NPR {state.product?.price}
                  </span>
                  <Badge className="bg-red-500 ml-2">Save {state.product?.discount}%</Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  NPR {state.product?.price}
                </span>
              )}
            </div>
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{state.product?.description}</p>
            </div>
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${state.product?.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {state.product?.stock > 0
                  ? `In Stock (${state.product?.stock} available)`
                  : 'Out of Stock'}
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(state.quantity - 1)}
                    disabled={state.quantity <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={state.product?.stock}
                    value={state.quantity}
                    onChange={e => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center text-gray-900"
                    aria-label="Product quantity"
                  />
                  <button
                    onClick={() => handleQuantityChange(state.quantity + 1)}
                    disabled={state.quantity >= (state.product?.stock || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={state.product?.stock === 0}
                  className="flex-1 gap-2"
                  size="lg"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={20} aria-hidden="true" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={state.product?.stock === 0}
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
                  className={`flex-1 gap-2 ${state.isWishlistProcessing
                    ? 'opacity-50 cursor-not-allowed'
                    : state.product?.is_wishlisted
                      ? 'text-red-600 hover:text-red-700'
                      : ''
                    }`}
                  disabled={state.isWishlistProcessing}
                  onClick={handleWishlistToggle}
                  aria-label={state.product?.is_wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={20}
                    className={state.product?.is_wishlisted ? "fill-current" : ""}
                    aria-hidden="true"
                  />
                  {state.isWishlistProcessing ? 'Processing...' : 'Wishlist'}
                </Button>
              </div>
              <Shippinginfo />
            </div>
          </div>
        </div>
        {/* --- Reviews --- */}
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
