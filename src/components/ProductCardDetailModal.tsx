import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Tag, Info, Award, Play } from 'lucide-react';
import { Product } from '../types';
import { ProductReviews } from './ProductReviews';

interface ProductCardDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCardDetailModal: React.FC<ProductCardDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [playVideoPreview, setPlayVideoPreview] = useState(false);

  // Match real video preview URL based on product
  const getProductVideoUrl = (id: string) => {
    if (id === 'p1') {
      return 'https://assets.mixkit.co/videos/preview/mixkit-lens-of-a-video-camera-filming-in-a-studio-34293-large.mp4';
    }
    if (id === 'p6') {
      return 'https://assets.mixkit.co/videos/preview/mixkit-man-recording-podcast-in-studio-41131-large.mp4';
    }
    if (id === 'p7') {
      return 'https://assets.mixkit.co/videos/preview/mixkit-recording-studio-sound-mixer-close-up-vibe-41716-large.mp4';
    }
    return 'https://assets.mixkit.co/videos/preview/mixkit-man-recording-podcast-in-studio-41131-large.mp4';
  };

  const videoUrl = getProductVideoUrl(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" dir="rtl" id={`product-card-modal-${product.id}`}>
      {/* Background click dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Card body */}
      <div className="relative w-full max-w-4xl bg-slate-50 hover:border-slate-350 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 animate-scale-up max-h-[90vh] border border-slate-200">
        
        {/* Header toolbar */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black text-slate-400 font-sans tracking-wide">عالم كلاكيت الإبداعي</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            id={`btn-close-modal-${product.id}`}
            title="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area (Scrollable scrollbar) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Top block split: image and core information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Image display col-5 or Active Video Player */}
            <div className="md:col-span-5 relative aspect-square sm:aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-inner shrink-0 group">
              {playVideoPreview ? (
                <div className="relative w-full h-full">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayVideoPreview(false);
                    }}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 p-1.5 rounded-full text-white cursor-pointer z-10 hover:scale-105 transition-all text-xs flex items-center justify-center h-7 w-7 font-black"
                    title="الرجوع للصورة"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-full h-full relative cursor-pointer" onClick={() => setPlayVideoPreview(true)}>
                  <img
                    src={product.imageUrl}
                    alt={product.nameAr}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Real video preview play trigger */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 flex items-center justify-center transition-all opacity-90">
                    <div className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play size={20} className="fill-slate-950 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded shadow-sm z-10">
                    معاينة بالفيديو الحقيقي 🎥
                  </div>
                </div>
              )}
              {product.isHot && (
                <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full z-10">Best Seller</span>
              )}
              <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-900 border border-slate-250 font-extrabold text-[9px] px-3 py-1 rounded-full z-10 shadow-xs">
                {product.categoryAr}
              </span>
            </div>

            {/* Core Info col-7 */}
            <div className="md:col-span-7 space-y-4 text-right">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-700 tracking-wider uppercase font-extrabold block">بطاقة مراجعة وتصفّح المنتج</span>
                <h1 className="text-xl sm:text-2xl font-sans font-black text-slate-900 leading-tight">
                  {product.nameAr}
                </h1>
                <p className="text-xs text-slate-400 font-mono font-bold">{product.name}</p>
              </div>

              {/* Star ratings overview */}
              <div className="flex items-center gap-2 text-xs text-amber-600 font-bold">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`fill-current ${i < Math.round(product.rating) ? '' : 'opacity-20'}`}
                    />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="text-slate-400 font-sans">({product.reviewsCount} تقييم حقيقي)</span>
              </div>

              {/* Description explanation */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-medium bg-white/60 p-3 rounded-xl border border-slate-100">
                {product.descriptionAr}
              </p>

              {/* Price and Cart CTA */}
              <div className="pt-3 border-t border-slate-150 flex flex-wrap gap-4 items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">السعر النهائي المباشر:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-950 font-sans">{product.price}</span>
                    <span className="text-xs text-slate-500 font-bold">ر.س</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-black text-xs shadow hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                  id={`btn-modal-add-to-cart-${product.id}`}
                >
                  <ShoppingCart size={13} />
                  <span>تأكيد الإضافة للسلة 🛒</span>
                </button>
              </div>
            </div>
          </div>

          {/* Specifications and Bullet point grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
            {/* Highlights list */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Award size={14} className="text-amber-600" />
                أبرز المميزات الفنية المعتمدة المعززة:
              </h3>
              {product.bulletsAr && product.bulletsAr.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-600">
                  {product.bulletsAr.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed font-sans">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 font-bold">يتضمن هذا المنتج دعم ضمان كلاكيت الشامل لمدة سنتين.</p>
              )}
            </div>

            {/* Tech specs dict list if exists */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Info size={14} className="text-amber-600" />
                المواصفات التقنية الدقيقة:
              </h3>
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="space-y-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-slate-100/50">
                      <span className="text-slate-400 font-bold">{key}</span>
                      <span className="text-slate-800 font-extrabold pr-2 text-left">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1.5 border-b border-slate-100/50 text-xs">
                    <span className="text-slate-400 font-bold">المنتج</span>
                    <span className="text-slate-800 font-extrabold">مكفول ومصنّف أصليًا</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100/50 text-xs">
                    <span className="text-slate-400 font-bold">الضمان المميز</span>
                    <span className="text-green-700 font-extrabold">سنتين كلاكيت كير (Clakett Care) 🛡️</span>
                  </div>
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-slate-400 font-bold">بلد المنشأ</span>
                    <span className="text-slate-850 font-extrabold">مواصفات ومعايير إنتاج عالمية</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User comments and reviews section directly integrated under details! */}
          <div className="space-y-4">
            <div className="bg-amber-500/5 px-6 py-4 border border-slate-200 border-b-none rounded-t-3xl flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 font-sans">تعليقات وآراء مراجعي "{product.nameAr}" الموثوقة ⭐</h3>
              <span className="text-amber-800 text-[10px] sm:text-xs font-bold bg-amber-550/10 px-2.5 py-1 rounded-full">تقارير الثقة والمشاركة</span>
            </div>
            <div className="border border-slate-200 border-t-none rounded-b-3xl overflow-hidden bg-white">
              <ProductReviews productId={product.id} />
            </div>
          </div>

        </div>

        {/* Sticky footer for quick dismiss */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm border border-slate-200"
          >
            إغلاق المراجعة والتصفح ✕
          </button>
        </div>

      </div>
    </div>
  );
};
