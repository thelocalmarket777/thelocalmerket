import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import RemoteServices from '@/RemoteService/Remoteservice';
import { useToast } from '@/hooks/use-toast';


// Define TypeScript interfaces
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
}

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    const { toast } = useToast();
    const { addItem } = useCart();


    const removeFromWishlist = (id: string): void => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
        RemoteServices.deletewishlistfile(id).then((res) => {
            toast({
                title: 'Delete Successfully',
                description: 'Deleted wishlist',
            });

        }).catch(error => {
            toast({
                variant: 'destructive',
                title: ' Failed',
                description: 'An error occurred ',
            });
        })



    };

    useEffect(() => {
        RemoteServices.getwishlistfile().then((res) => {

            setWishlistItems(res.data)
        })

    }, [])


    const addToCart = (id) => {


        RemoteServices.getById(id).then(res => {

            addItem(res.data.product, 1);
        }).catch((error) => console.log('error', error))

    };







    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-600 hover:text-brand-blue flex items-center transition-colors duration-200"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Continue Shopping
                    </Link>

                    <Badge variant="outline" className="px-3 py-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in wishlist
                    </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {/* Wishlist Content */}
                {wishlistItems.length > 0 ? (
                    <div className="w-full">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="hidden sm:grid sm:grid-cols-12 text-sm font-medium text-gray-500">
                                    <div className="sm:col-span-6">Product</div>
                                    <div className="sm:col-span-2 text-center">Price</div>
                                    <div className="sm:col-span-2 text-center">Availability</div>
                                    <div className="sm:col-span-2 text-center">Actions</div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                {wishlistItems.map((item) => (
                                    <div key={item.id}>
                                        <div className="grid sm:grid-cols-12 gap-4 py-4 items-center">
                                            {/* Product */}
                                            <div className="sm:col-span-6 flex items-center gap-4">
                                                <div className="shrink-0 relative">
                                                    <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/api/placeholder/200/200";
                                                                (e.target as HTMLImageElement).alt = "Image not available";
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-gray-900 font-medium hover:text-blue-600 line-clamp-2">
                                                        {item.name}
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                        {item.description.substring(0, 100)}...
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="sm:col-span-2 text-center">
                                                <div className="sm:hidden text-sm text-gray-500">Price:</div>
                                                <div className="font-medium">NPR&nbsp;{parseFloat(item.price.toString()).toFixed(2)}</div>
                                            </div>

                                            {/* Availability */}
                                            <div className="sm:col-span-2 text-center">
                                                <div className="sm:hidden text-sm text-gray-500">Availability:</div>
                                                {item.stock > 0 ? (
                                                    <div className="text-green-600 text-sm">
                                                        {item.stock <= 5 ? (
                                                            <span>Only {item.stock} left</span>
                                                        ) : (
                                                            <span>In Stock</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-red-600 text-sm">Out of Stock</div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="sm:col-span-2 flex items-center justify-center sm:justify-around gap-2">
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    disabled={item.stock === 0}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${item.stock === 0
                                                        ? 'text-gray-400 bg-gray-100'
                                                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                        }`}
                                                    aria-label="Add to cart"
                                                >
                                                    <ShoppingCart size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <Separator className="last:hidden" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven't added any products to your wishlist yet.
                            </p>
                            <Button asChild size="lg">
                                <Link to="/">Start Shopping</Link>
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>

    );
}