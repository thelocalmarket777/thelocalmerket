import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, Book, Leaf, Scissors, Home, Music, Palette, Coffee, Gift,
  Smartphone, Sofa, Shirt, BookOpen, Flower, ShoppingBag, Gamepad, Dumbbell,
  Sparkles, Car, Heart, Crown, Apple, PenTool, PaintBucket, Dog, GraduationCap,
  Church, Search
} from 'lucide-react';

export const CATEGORY_OPTIONS = [
  'Electronics', 'Furniture', 'Clothing', 'Books', 'Flower',
  'Shoes', 'Toys', 'Sports', 'Beauty', 'Automotive',
  'Health', 'Jewelry', 'Grocery', 'Stationery', 'Home Decor',
  'Plants', 'Painting', 'Handicraft', 'Kitchenware', 'Pet Supplies',
  'Book', 'Garden Supplies', 'Seeds', 'Educational Books', 'Religious Books'
];

const categoryIcons = {
  Electronics: Smartphone,
  Furniture: Sofa,
  Clothing: Shirt,
  Books: Book,
  Flower: Flower,
  Shoes: ShoppingBag,
  Toys: Gamepad,
  Sports: Dumbbell,
  Beauty: Sparkles,
  Automotive: Car,
  Health: Heart,
  Jewelry: Crown,
  Grocery: Apple,
  Stationery: PenTool,
  'Home Decor': Home,
  Plants: Leaf,
  Painting: Palette,
  Handicraft: Scissors,

  'Pet Supplies': Dog,
  Book: BookOpen,
  'Garden Supplies': Leaf,

  'Educational Books': GraduationCap,
  'Religious Books': Church
};

const categoryColors = {
  Electronics: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Furniture: { bg: 'bg-amber-100', text: 'text-amber-800' },
  Clothing: { bg: 'bg-purple-100', text: 'text-purple-800' },
  Books: { bg: 'bg-green-100', text: 'text-green-800' },
  // ...add colors for other categories
};

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => 
    CATEGORY_OPTIONS.filter(category => 
      category.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(category => ({
      name: category,
      description: `Explore our ${category.toLowerCase()} collection`,
      icon: categoryIcons[category] || Book,
      color: categoryColors[category]?.bg || 'bg-gray-100',
      textColor: categoryColors[category]?.text || 'text-gray-800',
      path: `/category/${category.replace(/\s+/g, '-')}`
    })), [searchQuery]
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">All Categories</h1>
            <p className="text-gray-600">
              Explore our complete collection of {CATEGORY_OPTIONS.length} categories
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link 
                key={category.name}
                to={category.path} 
                className={`${category.color} ${category.textColor} p-6 rounded-xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
                  <IconComponent size={128} />
                </div>

                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="mb-4 flex items-center">
                      <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-xl font-bold ml-3">{category.name}</h3>
                    </div>
                    <p className="opacity-80 mb-8 line-clamp-2">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300">
                    Browse Collection
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
