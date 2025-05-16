import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import RemoteServices from '@/RemoteService/Remoteservice';
import { LoadingSkeleton } from '@/components/HelperUI/Loading';

const PRODUCTS_PER_PAGE = 8;

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Initial fetch
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        let response;
        if (category && category !== 'all') {
          response = await RemoteServices.filterProductCategories(category);
        } else {
          response = await RemoteServices.productList();
        }
        
        console.log('All products fetched:', response.data);
        setAllProducts(response.data);
        
        // Initialize with first page
        const initialProducts = response.data.slice(0, PRODUCTS_PER_PAGE);
        setProducts(initialProducts);
        setHasMore(response.data.length > PRODUCTS_PER_PAGE);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
    setPage(1); // Reset page when category changes
  }, [category]);

  // Handle pagination
  useEffect(() => {
    if (page === 1) return; // Skip on initial load
    
    const loadMoreProducts = () => {
      const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
      const endIndex = page * PRODUCTS_PER_PAGE;
      const newProducts = allProducts.slice(startIndex, endIndex);
      
      if (newProducts.length > 0) {
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
      }
      
      setHasMore(endIndex < allProducts.length);
    };
    
    loadMoreProducts();
  }, [page, allProducts]);

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-brand-blue flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category ? formatCategoryName(category) : 'All Products'}
          </h1>
          <p className="text-gray-600 mt-2">
            {allProducts.length} {allProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        {isLoading && products.length === 0 ? (
       <LoadingSkeleton count={4} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                if (products.length === index + 1) {
                  return (
                    <div ref={lastProductElementRef} key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  );
                } else {
                  return <ProductCard key={product.id} product={product} />;
                }
              })}
            </div>
            
            {isLoading && products.length > 0 && (
              <div className="flex justify-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            
            {!hasMore && products.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                No more products to load
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No products found in this category</h2>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;