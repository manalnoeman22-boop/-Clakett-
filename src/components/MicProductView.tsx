/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Truck, Award, Play, AlertCircle, ShoppingCart, Plus, Minus, Check, CheckSquare, Square, X } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { ProductReviews } from './ProductReviews';

interface MicProductViewProps {
  onAddToCart: (product: Product, selectedAddons?: string[]) => void;
  setActiveView: (view: string) => void;
}

export const MicProductView: React.FC<MicProductViewProps> = ({
  onAddToCart,
  setActiveView,
}) => {
  const micProduct = PRODUCTS.find((p) => p.id === 'p6') || PRODUCTS[5]; // Elite Streaming Mic Kit
  
  const [activeImage, setActiveImage] = useState(micProduct.imageUrl);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addonArm, setAddonArm] = useState(true);
  const [addonAcoustic, setAddonAcoustic] = useState(false);
  const [liveBuyer, setLiveBuyer] = useState<string | null>(null);

  // Reels preview / play state
  const [playReel, setPlayReel] = useState(false);

  // Prices
  const basePrice = micProduct.price; // 1299 r.s
  const armPrice = 180;
  const acousticPrice = 110;

  const currentProductTotal = basePrice * quantity;
  const addonsTotal = (addonArm ? armPrice : 0) + (addonAcoustic ? acousticPrice : 0);
  const bundleDiscountFactor = (addonArm || addonAcoustic) ? 0.85 : 1.0; // 15% discount for buying bundle!
  const finalPrice = Math.round((currentProductTotal + addonsTotal) * bundleDiscountFactor);

  // Cycle fake social buyer toasts
  useEffect(() => {
    const buyers = [
      'محمد من الرياض اشترى طقم مايك Elite قبل 3 دقائق 🎤',
      'زياد من الدمام أضاف ذراع التعليق الاحترافي للسلة منذ قليل',
      'سحر من جدة اشترت باقة البث المتكاملة ووفرت 15% للتو 🚀',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setLiveBuyer(buyers[idx]);
      idx = (idx + 1) % buyers.length;
      
      // Auto clear top bubble after 5s
      setTimeout(() => {
        setLiveBuyer(null);
      }, 5000);

    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = () => {
    const addons: string[] = [];
    if (addonArm) addons.push('ذراع مايكروفون هيدروليكي');
    if (addonAcoustic) addons.push('عوائل صوتية عازلة للأذن');

    const customizedProduct: Product = {
      ...micProduct,
      price: finalPrice / quantity, // adjusted average price
    };

    onAddToCart(customizedProduct, addons);
  };

  const imagesList = [
    micProduct.imageUrl,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB5avj1BsjGyqcbY4gq8QXn03qhSAupNf-DFQIr7rQNlvKRgtqJly1IOb7d1_VDLm6GK9uGKoz6OPvikfMD25AOy7giRuLg_wzdE6SIS-BlFiik0Q_q5Ln_kSh6NpJZO6A0ez7Pow3bVtkvoceFg4PZZV7gMPRSXtGoyRkPmyrisAydS2p68QEelUs556hGS4aVBHvsqscGQQoLiKWP2uU_yYuB-Q_51lEYwvxJRf3YD4ILUM7nsDvENXNmA9nIYhyhFZuZKmfLP9Q',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1Jvf0meQP1dIu_kmG7Rgvw5sOC1JA51DCDTEIsk_F056gplPBZ6t_sU64QltFgR6RWn4_DaRHJuFCUSVIk4syd7kABFfO6cyBzvkK7MpmNwb10y1gtHOeN88oUJsIfSwhVICFkdnb3XN1_OZKKZ1lNgaNu1YVOR35pUEIQKhIaz7d0gTVPXBcAAlbJynyZuPfixCH2ktaSiyMNTOsrqPQXF-vBYci8smjPxpy4qGKORIIy20emjFZNz4UJmbZOff-Mb96xKNaww0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCqT81pELdf-lqjuefBD_jtvQIMorOz1lI0mrMBig6wRKxRPzMtJEMH-WhShUXA26DE9AJVjlVrPgtQtqsgCXbmVgMYIiVWHsZQrkJD9q0kQd0WFOFqegf9E3UZ-U0zN_MQlCQZes7ReF8xf0ugzgKGj1Dqho1gYq6fH21ja_BtmwZx9xpR7atVQ-YWFBPmh_3yzzxYR_rMdP4l-eWfjzkp6gjF72wm4OR9gC4RqJCQRnK7gb7cnC91JVHxAWHHulRsyQ5xUJkQzrk'
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 relative" dir="rtl">
      
      {/* Dynamic Social Floating Toast Bubble */}
      {liveBuyer && (
        <div className="fixed top-20 right-4 z-40 bg-white border border-amber-500/30 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-slide-in-right max-w-xs sm:max-w-sm">
          <div className="p-1 rounded-full bg-amber-500/10 text-amber-700">
            <ShoppingCart size={14} />
          </div>
          <span className="text-xs font-bold text-slate-700">{liveBuyer}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-scale-up">
        
        {/* Left column: High Quality Images & Reels preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            {showVideoGallery ? (
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-microphone-on-a-stand-in-a-music-studio-41701-large.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <img
                src={activeImage}
                alt="Elite Mic"
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-sm">
              {showVideoGallery ? 'معاينة الفيديو المباشر 🎥' : 'باقة الستريمر 🎤'}
            </span>
          </div>

          {/* Thumbnails row */}
          <div className="flex gap-3 overflow-x-auto py-1 justify-start">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setShowVideoGallery(false);
                }}
                className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border bg-slate-100 cursor-pointer transition-all ${
                  (!showVideoGallery && activeImage === img) ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
              </button>
            ))}

            {/* In-gallery Video Preview Box */}
            <button
              onClick={() => setShowVideoGallery(true)}
              className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border cursor-pointer relative flex items-center justify-center group shrink-0 shadow-sm transition-all ${
                showVideoGallery ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-amber-500/40 bg-slate-100 hover:border-amber-500'
              }`}
              title="شاهد معاينة الفيديو المباشرة للمنتج"
            >
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-microphone-on-a-stand-in-a-music-studio-41701-large.mp4"
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-300"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 bg-amber-500/10" />
              <div className="absolute p-1 py-0.5 rounded bg-amber-500 text-slate-950 text-[8px] font-black shadow-md flex items-center gap-0.5">
                <Play size={8} className="fill-slate-950" />
                <span>فيديو حقيقي</span>
              </div>
            </button>

            {/* Reels Video Preview Box */}
            <div
              onClick={() => setPlayReel(true)}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-100 cursor-pointer relative flex items-center justify-center group shrink-0 shadow-sm"
              title="شاهد معاينة ريلز بالفيديو"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX84qncb2j0EYSvY3T6IVUUpq08bxIP3WViI9aZpidlaMVuIOKxmZsDQk9LFio5dlFjLoSf1we4yVMC_aGcs93-gT7TyQPOstH3Vnd9-j5E1oWca1plF8VBpLCXnq_2hTXeE3atK1H2YNfMXDjHG7QXJDb65-gFnSuc562Nas8gyr4DGwUze_EvUpDs8y_a-UdMJDTTgiQknz668hQnpWd_xhr3V_V_CEE_TYKyBFHqs90yRtdtEfTJWuK4pnoQExrvOsf7Xl_ZAk"
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-300"
                alt="Reels video"
              />
              <div className="absolute inset-0 bg-amber-500/10" />
              <div className="absolute p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Play size={14} className="fill-slate-950" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Specs, pricing, bundle cross-sell */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-amber-700 font-extrabold text-xs block">صوت نقي، تسجيل خالي من التشويش</span>
            <h1 className="text-xl sm:text-3xl font-sans font-black text-slate-900">{micProduct.nameAr}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-extrabold">(198 تقييم حقيقي من الستريمرز)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs text-slate-400 font-bold block">لماذا تختار طقم Elite Streaming؟</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-650">
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>عزل كامل للأصوات المحيطة والارتدادات</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>دعم تشغيل سلس USB-C ومراقبة صوتية فورية</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>بوب فيلتر وممانع صدمات مكتبي احترافي متضمن</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>تصميم فولاذي مصفى يعطي طابعاً مهيباً للبث</span>
              </div>
            </div>
          </div>

          {/* Cross selling: اشترِ معاً ووفر 15% */}
          <div className="border border-amber-500/20 bg-amber-500/[0.01] rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                🧩 اشترِ معاً ووفر 15% كاملة
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-800 px-2.5 py-1 rounded-full font-bold">باقة المبدع الفائقة</span>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setAddonArm(!addonArm)}
                className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 select-none transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAILVgNf-mNs9WQsdMxUrUfWMlvToE5RgojThQewa3mrWir4u39PvZham_KjVbMpAcDa86DmS8DmHQJQJl175onP0YIjN1ZmXsW0OeRsUao8bHh0S_NKIJFs8YhgmHIB48gc-XxaD62F2gwslWziLw6wpeWcJj4d05NxKoakPkCTzrKeHbFyF0tzb-2BoaKeMoFeapXtpT26S4wAXQEsRkGCkMa1HtIBwkrB3FwVggMe9kZyaX1kXKF_Cvdc3Urlb2fO5FtEF2ga7w"
                    className="h-10 w-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    alt="ذراع مايك"
                  />
                  <div>
                    <span className="text-xs font-bold block text-slate-800">ذراع مايكروفون تعليق هيدروليكي احترافي</span>
                    <span className="text-[10px] text-slate-400">حامل متحرك صامت تماماً ذو قوة توازن قوية</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-800 font-extrabold">180 ر.س</span>
                  {addonArm ? (
                    <CheckSquare size={18} className="text-amber-600 fill-amber-500/15" />
                  ) : (
                    <Square size={18} className="text-slate-300" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setAddonAcoustic(!addonAcoustic)}
                className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 select-none transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYmrf0B6oV8hCbdGyPjQyVLup2u0HZ3tm_O_9Bohhv28lSdi6EK3Z3Mfa5N1IcXb-KuMKs9MabDVJRgJQX4zSDxD1v6e4Rk__1tfJzNwc-R5WcT4W1Xnh7PFPqYxCPkYXw6ggMRp_inLM27IUxWWovf98em7Y2_3shL4Nzo7777rXQknPl8T2uWdPHLoHZKy8eV_lvQ5zyl4mTCiRJCzZfs4GbsN3NZn7KjhoMgJK6rMfqajoadlBIvfB4l3ueoXdmzY-U2Jbwiwk"
                    className="h-10 w-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    alt="عزل صوتي"
                  />
                  <div>
                    <span className="text-xs font-bold block text-slate-800">اللوحات العازلة للصوت (12 قطعة هرمية)</span>
                    <span className="text-[10px] text-slate-400">تنهي تماماً ارتدادات جدران غرفتك للحصول على نقاء استوديو</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-800 font-extrabold">110 ر.س</span>
                  {addonAcoustic ? (
                    <CheckSquare size={18} className="text-amber-600 fill-amber-500/15" />
                  ) : (
                    <Square size={18} className="text-slate-300" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector, pricing, checkout trigger */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">حجم الطلب:</span>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 mt-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-sans font-extrabold text-slate-850 min-w-[20px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="text-left font-sans">
                <span className="text-xs text-slate-500 block font-bold">السعر الكلي شامل الخصم:</span>
                <span className="text-3xl font-black text-slate-900">{finalPrice} ر.س</span>
                {(addonArm || addonAcoustic) && (
                  <span className="text-xs text-red-600 font-black block mt-1">وفرت 15٪ كاملة من قيمة التجميعة! 🎉</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-sans font-black text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              id="mic-add-to-cart-btn"
            >
              <ShoppingCart size={18} />
              <span>أضف طقم Elite Streaming للسلة 🛒</span>
            </button>
          </div>
        </div>

        {/* User Reviews and Ratings section to increase trust and engagement */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="mic-ratings-container">
          <div className="bg-amber-500/5 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-sans">تعليقات وآراء صناع المحتوى المعتمدين ⭐</h2>
            <span className="text-amber-800 text-xs font-bold bg-amber-550/10 px-2.5 py-1 rounded-full">١٩٨ تقرير نشط</span>
          </div>
          <ProductReviews productId={micProduct.id} />
        </div>

      </div>

      {/* Reels Full screen preview simulation modal */}
      {playReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setPlayReel(false)} />
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-slate-200 bg-white h-[85vh] flex flex-col z-10 animate-scale-up shadow-2xl">
            
            {/* Reel Screen simulation */}
            <div className="relative flex-1 bg-black">
              {/* Fake overlay camera/sound elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between text-xs text-white z-20">
                <span className="bg-black/40 px-2 py-1 rounded-full border border-slate-850">بث تجريبي مباشر 📡</span>
                <button onClick={() => setPlayReel(false)} className="bg-black/40 hover:bg-black/60 p-1 rounded-full text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Sine Wave mock animation as "playing voice" */}
              <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center z-20 text-center px-4 space-y-4">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full tracking-wider animate-bounce">
                  اضبط مايكروفونك!
                </span>
                
                {/* Simulated sine waves */}
                <div className="flex justify-center items-center gap-1.5 h-16 w-full max-w-[200px]">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.6s'
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  "نقاوة تعزل النفس والهمسات، بدون أي تعريفات معقدة. طقم Elite هو خيارك الأوثق."
                </p>
              </div>

              {/* Real Video element playing a genuine recording video */}
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-man-recording-podcast-in-studio-41131-large.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-550">
              <div className="flex items-center gap-2">
                <img src={micProduct.imageUrl} className="h-8 w-8 rounded-full object-cover border border-slate-250 animate-spin-slow" />
                <span className="font-extrabold text-slate-850 text-xs">{micProduct.nameAr}</span>
              </div>
              <button
                onClick={() => {
                  setPlayReel(false);
                  handleAddToCart();
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                أضف فوراً 🛒
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
