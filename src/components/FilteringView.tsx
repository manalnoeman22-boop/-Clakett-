/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Heart, Sparkles, Filter, SlidersHorizontal, ShoppingCart, RefreshCw, Star, Info } from 'lucide-react';
import { PRODUCTS, PLATFORMS, BRANDS, FILTER_CATEGORIES } from '../data';
import { Product } from '../types';

interface FilteringViewProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  favorites: string[]; // liked product ids
  onToggleFavorite: (id: string) => void;
}

export const FilteringView: React.FC<FilteringViewProps> = ({
  onAddToCart,
  onSelectProduct,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(12000);

  // platform specific curation filters
  const platformProductsFilter = (p: Product, platform: string) => {
    if (platform === 'all') return true;
    if (platform === 'youtube') return ['cameras', 'audio', 'lighting', 'digital'].includes(p.category);
    if (platform === 'tiktok') return ['audio', 'lighting', 'digital'].includes(p.category);
    if (platform === 'twitch') return ['audio', 'lighting', 'accessories'].includes(p.category);
    return true;
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 1. Search Query Match
      const matchesSearch =
        p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Platform curation match
      const matchesPlatform = platformProductsFilter(p, selectedPlatform);

      // 3. Category match
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);

      // 4. Brand match (mock brand matching)
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((brand) => p.name.toLowerCase().includes(brand.toLowerCase()));

      // 5. Price match
      const matchesPrice = p.price <= maxPrice;

      return matchesSearch && matchesPlatform && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [searchQuery, selectedPlatform, selectedCategories, selectedBrands, maxPrice]);

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((name) => name !== brandName) : [...prev, brandName]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(12000);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 py-12 px-4 sm:px-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8 animate-scale-up">
        
        {/* Top platform switcher tab header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-amber-700 uppercase font-mono tracking-widest block font-extrabold">الفلترة الذكية</span>
            <h1 className="text-xl sm:text-3xl font-sans font-extrabold text-slate-900">تخصيص مستلزمات الإنتاج ⚙️</h1>
          </div>
 
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full custom-scrollbar">
            {PLATFORMS.map((plat) => (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id)}
                className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
                  selectedPlatform === plat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {plat.titleAr}
              </button>
            ))}
          </div>
        </div>
 
        {/* Search bar row */}
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="ابحث عن الكاميرات، المايكروفونات، أو السوفت بوكس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3.5 pr-12 pl-4 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-400 shadow-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
 
        {/* Filter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar filters grid col 1 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                  <SlidersHorizontal size={14} className="text-amber-600" />
                  خيارات الفرز والفلترة
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-extrabold"
                >
                  <RefreshCw size={10} />
                  إعادة تعيين
                </button>
              </div>
 
              {/* Price range */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 block pb-1 border-b border-slate-100">السعر الأقصى: <span className="text-amber-600 font-extrabold">{maxPrice} ر.س</span></label>
                <input
                  type="range"
                  min="150"
                  max="12000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>150 ر.س</span>
                  <span>12,000 ر.س</span>
                </div>
              </div>
 
              {/* Category checkboxes */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pb-1 border-b border-slate-100">التصنيف الإبداعي:</h4>
                <div className="space-y-2">
                  {FILTER_CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-slate-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="accent-amber-500 rounded"
                      />
                      <span>{cat.titleAr}</span>
                    </label>
                  ))}
                </div>
              </div>
 
              {/* Brands selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide pb-1 border-b border-slate-100">العلامات التجارية الموثقة:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {BRANDS.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        onClick={() => handleBrandToggle(brand)}
                        className={`py-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500 text-amber-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-100'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
 
            </div>
 
            {/* Sidebar Promo Box: باقة الستريمر المتكاملة بخصم 20% */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/10 bg-gradient-to-t from-white via-amber-500/[0.01] to-slate-50 p-4 text-center space-y-3 shadow-sm">
              <span className="text-[9px] bg-red-500/10 text-red-700 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">باقة خاصة محدودة ⚡</span>
              <h3 className="text-xs font-extrabold text-slate-900">باقة الستريمر المتكاملة ووفر 20% فورياً!</h3>
              <p className="text-[10px] text-slate-500">ماتطولها، مايك Elite وإضاءة واستوديو العزل مجتمعين لنسق راقٍ في تجهيز البث.</p>
              
              <button
                onClick={() => onSelectProduct(PRODUCTS.find(p => p.id === 'p6')!)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-slate-950 font-extrabold text-[11px] transition-all cursor-pointer shadow-sm"
              >
                شراء وتجهيز السيت أب الآن 🎮
              </button>
            </div>
          </div>
 
          {/* Grid of filtered products cols 3 */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <span className="text-4xl text-slate-400">🔍</span>
                <h3 className="text-sm font-bold text-slate-800">لم نجد أي معدات تطابق الفلترة</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">جرب تخفيض الحد السعري، أو إعادة كتابة اسم المايك، أو الضغط على زر "إعادة تعيين" للبدء مجدداً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const isFav = favorites.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-350 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={prod.imageUrl}
                          alt={prod.nameAr}
                          onClick={() => onSelectProduct(prod)}
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Favorite Like clicker */}
                        <button
                          onClick={() => onToggleFavorite(prod.id)}
                          className="absolute top-3 left-3 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-500 border border-slate-200 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                        </button>
 
                        {prod.isHot && (
                          <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full z-10">Best Sellers</span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-700 font-extrabold text-[9px] px-2.5 py-1 rounded-full z-10 border border-slate-200 shadow-sm">
                          {prod.categoryAr}
                        </span>
                      </div>
                      
                      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <h3
                            onClick={() => onSelectProduct(prod)}
                            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
                          >
                            {prod.nameAr}
                          </h3>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 min-h-[28px]">{prod.descriptionAr}</p>
                        </div>
 
                        <div className="flex items-center gap-1 text-[10px] text-amber-600">
                          <Star size={10} className="fill-current animate-pulse" />
                          <span className="font-bold">{prod.rating}</span>
                          <span className="text-slate-400">({prod.reviewsCount} تقرير)</span>
                        </div>
 
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">{prod.price} ر.س</span>
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-[10px] shadow-sm"
                          >
                            <ShoppingCart size={11} />
                            <span>أضف 🛒</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
        </div>
 
      </div>
    </div>
  );
};
