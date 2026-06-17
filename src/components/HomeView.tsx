/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft, Volume2, ShieldCheck, Eye, Sparkles, ShoppingCart, Info, Award, X } from 'lucide-react';
import { STORIES, BUNDLES, PRODUCTS } from '../data';
import { Product, Bundle } from '../types';

interface HomeViewProps {
  onAddToCart: (product: Product, selectedAddons?: string[]) => void;
  setActiveView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onAddToCart,
  setActiveView,
  onSelectProduct,
}) => {
  const [activeStory, setActiveStory] = useState<typeof STORIES[0] | null>(null);
  const [bundleChecked, setBundleChecked] = useState<Record<string, boolean>>({
    mic: true,
    light: true,
    arm: true,
    chroma: true,
  });

  // Calculate customized bundle price
  const baseBundlePrice = BUNDLES[0].price; // 1875 r.s
  const originalBundlePrice = BUNDLES[0].originalPrice; // 2499 r.s
  
  const enabledItemsCount = Object.values(bundleChecked).filter(Boolean).length;
  const currentBundlePrice = Math.round((baseBundlePrice / 4) * enabledItemsCount);
  const currentOriginalPrice = Math.round((originalBundlePrice / 4) * enabledItemsCount);

  // Bundle Add to cart handler
  const handleAddBundle = () => {
    // Inject the bundle items together
    const mockBundleProduct: Product = {
      id: 'bundle-pack-discount',
      name: 'Custom Creative Setup Bundle',
      nameAr: BUNDLES[0].nameAr,
      category: 'accessories',
      categoryAr: 'سيت أب متكامل',
      price: currentBundlePrice,
      rating: 5.0,
      reviewsCount: 221,
      imageUrl: BUNDLES[0].imageUrl,
      descriptionAr: BUNDLES[0].descriptionAr,
      bulletsAr: BUNDLES[0].itemsAr,
    };
    onAddToCart(mockBundleProduct);
  };

  return (
    <div className="w-full bg-slate-50 pb-16" dir="rtl">
      {/* Banner/Hero section */}
      <section className="relative w-full h-[320px] sm:h-[450px] flex items-center justify-center overflow-hidden">
        {/* Ambient Darkened Video/Image Mock */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent z-10" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA66Q4udgwy3RdGhObhZALKHlL2aCGW8jvvJZijwrdqQk1gaoYd7EBXObeosovAdrj_sIK25wgwTEZn1VZ6AHXYoOFvqxXWaLngXOcy5EcJZMpJyDQFOg_bHzzL9TgZflWTUKINFtj4mCiII4MG7--S-PWHYS8c8nuQABYkstCk32SWyFX3t-y12YjMrC8h-EzI2tQnqWO1dtNTEFgdkX7tyHWqLso8MCk9Hyr2B-jdfVj6hOlxTteVomCix-EU-NQo1TIo81IfOOQ"
          alt="كلاكيت استوديو"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />

        {/* Content Box */}
        <div className="relative z-20 max-w-4xl px-6 text-center space-y-4 animate-scale-up">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-800 text-[11px] font-bold tracking-wide font-sans">
            تجهيزات صناعة المحتوى الإبداعي والقيمنق
          </span>
          <h1 className="text-2xl sm:text-4xl font-sans font-black text-slate-900 tracking-tight leading-snug">
            جهّز استوديوهات الإبداع والقيمنق <br className="hidden sm:inline" /> بلمسة <span className="text-amber-500">احترافية مريحة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
            تسوّق أرقى معدات البث، الإضاءة، والمايكروفونات مع توصيل سريع لجميع دول الخليج العربي.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('filtering')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-xs transition-all shadow-md cursor-pointer"
            >
              استكشف المتجر
            </button>
          </div>
        </div>
      </section>

      {/* Circle Highlights/Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-30">
        <div className="flex items-center gap-4 overflow-x-auto py-4 custom-scrollbar justify-start sm:justify-center">
          {STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-500 to-red-500 group-hover:scale-105 transition-all duration-300">
                <div className="p-0.5 rounded-full bg-white">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover bg-slate-100"
                  />
                </div>
                <span className="absolute bottom-0 left-0 bg-red-500 text-[8px] font-bold text-white uppercase px-1 rounded-full animate-bounce">Live</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 group-hover:text-amber-600 transition-colors">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Feature Content: Story Highlights/Stories Preview Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveStory(null)} />
          <div className="relative w-full max-w-sm bg-[#0d1017] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 animate-scale-up">
            
            <div className="relative aspect-[3/4] bg-gray-950">
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e111d] via-black/10 to-transparent" />
              
              {/* Header inside story modal */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <div className="p-0.5 rounded-full bg-amber-500">
                    <img src={activeStory.imageUrl} alt={activeStory.title} className="h-8 w-8 rounded-full object-cover bg-gray-900" />
                  </div>
                  <span className="text-xs font-bold font-mono text-white leading-none">{activeStory.title}</span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Description inside story modal */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
                <span className="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full">نصائح كلاكيت للمبدعين 💡</span>
                <p className="text-xs text-gray-200 leading-relaxed font-sans">{activeStory.desc}</p>
                
                <button
                  onClick={() => {
                    setActiveStory(null);
                    setActiveView('filtering');
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>تسوق منتجات هذا القصة</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Bundles / شيل شيلتك ووفر 25% */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-scale-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="col-span-1 lg:col-span-12 xl:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-full px-3 py-1 text-xs font-bold">
              <Sparkles size={12} />
              <span>وفر 25٪ بتجميعك الفوري</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight">
              شيل شيلتك ووفر 25% مع <br /> <span className="text-amber-600 font-extrabold">باقة صانع المحتوى المتكاملة</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              قمنا بتنسيق وترتيب أهم الأدوات والعيازل الصوتية لتجهيز استوديو الأحلام. يمكنك استبعاد أي منتج لا تريده والتحقق من حسابك الفوري المباشر!
            </p>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span>شحن سريع توصيل آمن خلال 48 ساعة لباب منزلك</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span>ضمان سنتين متكامل ضد عيوب التصنيع وصوت المايك</span>
              </li>
            </ul>

            {/* Calculations Box */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 ml-1">السعر الحالي:</span>
                <span className="text-2xl font-extrabold text-slate-900 font-sans">{currentBundlePrice} ر.س</span>
                {enabledItemsCount > 0 && (
                  <span className="text-xs line-through text-slate-400 mr-2">{currentOriginalPrice} ر.س</span>
                )}
              </div>
              <button
                onClick={handleAddBundle}
                disabled={enabledItemsCount === 0}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart size={14} />
                <span>أضف الباقة للسلة 🛒</span>
              </button>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main Interactive Checklist items */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">تفصيل مكونات السيت أب:</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bundleChecked.mic}
                      onChange={(e) => setBundleChecked({ ...bundleChecked, mic: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-xs text-slate-800 font-medium">طقم مايكروفون Elite المصفى</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">625 ر.س</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bundleChecked.light}
                      onChange={(e) => setBundleChecked({ ...bundleChecked, light: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-xs text-slate-800 font-medium">سوفت بوكس إضاءة ال- LED</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">425 ر.س</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bundleChecked.arm}
                      onChange={(e) => setBundleChecked({ ...bundleChecked, arm: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-xs text-slate-800 font-medium">ذراع هيدروليكي كلاكيت برو</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">425 ر.س</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bundleChecked.chroma}
                      onChange={(e) => setBundleChecked({ ...bundleChecked, chroma: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-xs text-slate-800 font-medium">كروما خضراء خلفية مضادة للمياه</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">400 ر.س</span>
                </label>
              </div>
            </div>

            {/* Banner picture mock */}
            <div className="relative aspect-square sm:aspect-auto rounded-2xl overflow-hidden border border-slate-100 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQW9wSO-dOjrZy3XLvrcSV558HdhDq843qae6aKAGWE4Lt5NoCiE8nG5hUt5gaMtOyqJipamcwHhsh1G48hcig8ZD6QSXyOP5ShGRWzcF-Tlsq1UDj0_OwGAhmPmWeWv7GgYZsYEFS_4vP-gLQ0UDiIoKyd_nhYcieuIYRWB5WzBrtucqeb5Yulbqa06PDZwWD1EIapNS2m2L_0Tq63-n2wuj2sEAttRQcmBYwOV1nY0y1F6NfLUnBD63tm4mAATVihO22kiveRsg"
                alt="باقة صانع المحتوى"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-slate-800 text-xs font-bold bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg">
                <span>توصيل سريع مجاني 📦</span>
                <span className="text-amber-600 font-extrabold">خلال 48 ساعة</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* "الأكثر طلباً" horizontal overflow slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] text-amber-700 uppercase font-mono tracking-wider font-extrabold">سيت أب النجوم</span>
            <h2 className="text-xl sm:text-3xl font-sans font-extrabold text-slate-900">المعدات الأكثر طلباً هذا الأسبوع 🔥</h2>
          </div>
          <button
            onClick={() => setActiveView('filtering')}
            className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 hover:underline transition-all"
          >
            <span>شاهد الكل</span>
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Overflow Container */}
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x">
          {PRODUCTS.slice(0, 5).map((prod) => (
            <div
              key={prod.id}
              className="w-[240px] sm:w-[280px] shrink-0 bg-white border border-slate-250 rounded-2xl overflow-hidden shadow-sm snap-start hover:border-slate-350 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden" onClick={() => onSelectProduct(prod)}>
                <img
                  src={prod.imageUrl}
                  alt={prod.nameAr}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {prod.isHot && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full z-10">BESTSELLER</span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-800 font-extrabold text-[9px] px-2 py-0.5 rounded-full z-10 border border-slate-200">{prod.categoryAr}</span>
              </div>
              
              <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h4
                    className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
                    onClick={() => onSelectProduct(prod)}
                  >
                    {prod.nameAr}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 min-h-[32px]">{prod.descriptionAr}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-600">
                  <span>★</span>
                  <span className="font-bold">{prod.rating}</span>
                  <span className="text-slate-400">({prod.reviewsCount} تقرير)</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900">{prod.price} ر.س</div>
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="p-2 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold transition-all active:scale-95 cursor-pointer"
                    title="أضف إلى السلة"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Bento and Quick Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Cameras */}
        <div
          onClick={() => {
            setActiveView('filtering');
          }}
          className="relative h-[220px] rounded-3xl overflow-hidden border border-slate-200 cursor-pointer group shadow-sm transition-shadow hover:shadow-md"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIJOMsBEj8KPtcmLly5aUkekFpa3w9IDzyAYqHPRT5NMuWBbnv_fpkze12IWT_Nbc_p4RUj00ywHqMfMr7MNB9qoXuisr6x79_hG8G8kiSxuT56NRnw-XPmc5yIj8GgTQlK9RshQMmW_gVYF07UA43p_QU3_rrzlK-Zzu71AknYDm_uNY7aguNc4vximNlMMcX7C_yIW9GSGMmI6Y7ipdYQBIiwJkUbfEPX-Ntf8R2H7MgrGmM8pOkHaJs_eqdshm4nQGYVwsRVGE"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300"
            alt="معدات تصوير"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <h3 className="text-lg font-bold text-white font-sans">📸 كاميرات ومعدات تصوير</h3>
            <p className="text-xs text-slate-200 line-clamp-1">عدسات احترافية تدعم 4k للتصوير البصري والسينمائي</p>
          </div>
        </div>

        {/* Card 2: Audio/Mic */}
        <div
          onClick={() => {
            setActiveView('mic-product');
          }}
          className="relative h-[220px] rounded-3xl overflow-hidden border border-slate-200 cursor-pointer group shadow-sm transition-shadow hover:shadow-md"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1nAir5XBYfoH346kgPHgv3-vaioerCJcYUCOu0JWFQVudQ38d4PGr5W-vkdke9faMuoQ1tdd1jtBovBxSxzW8AobhssGRUR1qnQYVI5haIC_S_lI06hsPSwVbnd-hC9sCqZG6kON3FCoIS3bNJfDLbJ6aPP1f7A_h7Ga76UHhoUbIb6zE6y-YJwUJB1K-JkNIYMYfnv0JnnukqG2Ss7_h_Y_y-ZYGWahOrkpf7Ay5XO_XmxYQIvXBqMjOjZS6__mRmsdlkDpwWDM"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300"
            alt="صوتيات"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <h3 className="text-lg font-bold text-white font-sans">🎤 ميكروفونات وبث رقمي</h3>
            <p className="text-xs text-slate-200 line-clamp-1">أجود بطاقات الصوت والمايكروفونات المكثفة للتسجيل النقي</p>
          </div>
        </div>

        {/* Card 3: Digital LUTs */}
        <div
          onClick={() => {
            setActiveView('digital-product');
          }}
          className="relative h-[220px] rounded-3xl overflow-hidden border border-slate-200 cursor-pointer group shadow-sm transition-shadow hover:shadow-md"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDykGxtpRkIn5reZNucWEs16zez2frnIs8py9uXb0WsaQo2RT2YtcL-fl5-3qhdeWVCgaEXxG5JcNki_pLsNKRU1YqZmy_Wu-1DEfTtD2iBFJ7lEDA_zomjRGqdThoqTeKaWo5U3cfX6bJ__KXiwJo1RnWMFQw5qaxYmH6t2bPDZ-OGUJ5Sua6SVTs5UMQiP_6sjJ_L7d6ayPKgW7oQfQaILImoIjUZ6D4xXMttBjA3LW-0oiiqrpqfh2Tr9d8fGZjflgNJqsbQmIE"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300"
            alt="رقميات"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <h3 className="text-lg font-bold text-white font-sans">⚡ حزم رقمية ومؤثرات صوتية</h3>
            <p className="text-xs text-slate-200 line-clamp-1">لتحرير فوري بأكواد ألوان LUTs ومؤثرات أفلام مميزة</p>
          </div>
        </div>

      </section>

    </div>
  );
};
