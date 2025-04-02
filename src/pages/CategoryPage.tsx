
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { ArrowLeft } from 'lucide-react';
import RemoteServices from '@/RemoteService/Remoteservice';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      await RemoteServices.filterproductCatagories(category)
      .then(res=>{
        console.log('ews',res.data)
        setProducts(res.data)
      })
      .catch(error=>console.log('erorr product ',error))
      .finally(()=>setIsLoading(false))
       
    
    };

    fetchProducts();
  }, [category]);

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
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 h-[320px] animate-pulse">
                <div className="h-[200px] bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
