/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SidebarCart } from './components/SidebarCart';
import { HomeView } from './components/HomeView';
import { MicProductView } from './components/MicProductView';
import { DigitalProductView } from './components/DigitalProductView';
import { FilteringView } from './components/FilteringView';
import { ProductCardDetailModal } from './components/ProductCardDetailModal';
import { Product, CartItem, SavedSetup } from './types';
import {
  googleSignIn,
  logout,
  initAuth,
  saveCartToFirestore,
  getCartFromFirestore,
  getSavedSetups,
  googleProvider,
  auth
} from './firebase';

export default function App() {
  const [activeView, setActiveView] = useState<string>('explore');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Cart operations & setups
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Favorites (ids list)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Detailed selected product card modal state
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Social Proof notice alert toast
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Double add confirmation dialog state
  const [dupConfirmProduct, setDupConfirmProduct] = useState<{product: Product, selectedAddons?: string[]} | null>(null);

  // Check initial Auth session
  useEffect(() => {
    initAuth(
      (userSnap, tokenVal) => {
        setUser(userSnap);
        setAccessToken(tokenVal);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
  }, []);

  // Fetch Cart and Setups on login
  useEffect(() => {
    const syncDatabase = async () => {
      if (user) {
        const storedCart = await getCartFromFirestore(user.uid);
        if (storedCart && storedCart.length > 0) {
          setCartItems(storedCart);
        }
        const storedSetups = await getSavedSetups(user.uid);
        setSavedSetups(storedSetups);
      } else {
        setCartItems([]);
        setSavedSetups([]);
      }
    };
    syncDatabase();
  }, [user]);

  // Save Cart to Firestore whenever it changes
  useEffect(() => {
    if (user && cartItems.length > 0) {
      saveCartToFirestore(user.uid, cartItems);
    }
  }, [cartItems, user]);

  // Social Proof Alerts Cycle
  useEffect(() => {
    const mockToasts = [
      'اشترى فيصل من الخبر باقة صانع المحتوى المتكاملة قبل دقيقة 🎬',
      'قام ماجد من الرياض للتو بشراء طقم مايك Elite 🎙️',
      'حملت سارة من جدة حزمة السينما الرقمية بنجاح ووفرت سريعا ⚡',
      'انضم محمد من مكة المكرمة إلى قائمة المبدعين المميزين للتو 🌟'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setActiveToast(mockToasts[idx]);
      idx = (idx + 1) % mockToasts.length;

      // clear after 6s
      setTimeout(() => {
        setActiveToast(null);
      }, 6000);

    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        setAuthError(null);
      }
    } catch (e: any) {
      console.error('Initial login error:', e);
      // Capture popup errors specifically to trigger the elegant inline helper/bypass
      if (e?.code === 'auth/popup-closed-by-user' || e?.message?.includes('popup') || e?.message?.includes('closed')) {
        setAuthError('popup-closed');
      } else {
        setAuthError('generic-error');
      }
    }
  };

  const handleDemoLogin = () => {
    const mockUser = {
      uid: 'demo-user-123',
      displayName: 'مبدع كلاكيت الافتراضي',
      email: 'guest@clakett.com',
      photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB06mTSxC7eTZRK-K4VQQaCIIuMab922qzXRgLC8A4W0dnrJG0gtg_SfxfQ38OAkbWjPXf7cl-88bRzHRjwGJd1ubA-CSLH9A0khMhr34eXqKx0zZ_r-yUUo46hA_NS48NEVX65JUYSTS8IKMS9KlmtWOuZNbmsdZ-VkW7JhcP2I5ph1bYUjWFcPkJIRrE8s7GV1h2M7tt6dNaf51b2TeY05Bx8XzM6fV3kJ9igqGhgEXQKKZWxRETEhtTHqBzwderEF_jG8TgqSjk',
    } as any;
    setUser(mockUser);
    setAccessToken('mock-access-token-123');
    setNeedsAuth(false);
    setAuthError(null);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("هل ترغب في تسجيل الخروج وتصفية الجلسة؟");
    if (!confirmed) return;
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setCartItems([]);
      setSavedSetups([]);
    } catch (e) {
      console.error(e);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, selectedAddons?: string[], bypassConfirm = false) => {
    // Check if product is already in the cart to confirm duplication
    const isDuplicate = cartItems.some((item) => item.product.id === product.id);

    if (isDuplicate && !bypassConfirm) {
      setDupConfirmProduct({ product, selectedAddons });
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, selectedAddons }];
    });
    
    // Popup small toast
    setActiveToast(`تمت إضافة "${product.nameAr}" إلى السلة 🛒`);
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const handleConfirmDuplicateAdd = () => {
    if (dupConfirmProduct) {
      handleAddToCart(dupConfirmProduct.product, dupConfirmProduct.selectedAddons, true);
      setDupConfirmProduct(null);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleAddSavedSetupToCart = (setup: SavedSetup) => {
    // Add multiple products to cart representing setup
    setup.items.forEach(itemName => {
      const mockProduct: Product = {
        id: `setup-item-${Math.random()}`,
        name: itemName,
        nameAr: itemName,
        category: 'accessories',
        categoryAr: 'سيت أب محفوظ',
        price: Math.round(setup.totalPrice / setup.items.length),
        rating: 4.8,
        reviewsCount: 12,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVxc0gKkgYMFn2Psj1K-FsLwjIfjrfAgO1fTOCWuWSbOKKSUhxL4Iw4K9RneEsWzBJfWEiN0iAXnEEcSvs5TAxcnqQTmIbP52-F7Lygo_V30I5iF6Tsn0QSFRiLOLIONAyGzX0oU_YCECuh9lrvy_vtwXpj41b7bOuktKxHBzeNWAvpHLXRIn79wtnU5nTrMRsx94ftgqI8KQNmtvkyELxA2JpbY6-34cXJDqnDosQH5fqp84gaZohovvRHiEDutrVbkX7P84Bzs',
        descriptionAr: 'منتج مخصص مدرج من تصميم السيت أب المحفوظ.',
        bulletsAr: [],
      };
      handleAddToCart(mockProduct);
    });
    setCartOpen(false);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCartItems([]);
      setCartOpen(false);
      alert("تهانينا! 🎉 تم تأكيد ومعالجة طلبك الفني الآمن بنجاح. سنرسل لك مسودة التبع والموعد بالبريد الإلكتروني.");
    }, 3000);
  };

  const handleSelectProduct = (product: Product) => {
    if (product.id === 'p6') {
      setActiveView('mic-product');
    } else if (product.id === 'p7') {
      setActiveView('digital-product');
    } else {
      setSelectedDetailProduct(product);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-black text-slate-800">
      
      {/* Universal Head */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartCount}
        toggleCart={() => setCartOpen(!cartOpen)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container with transitions */}
      <main className="flex-1 w-full bg-slate-50 self-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {activeView === 'explore' && (
              <HomeView
                onAddToCart={handleAddToCart}
                setActiveView={setActiveView}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeView === 'mic-product' && (
              <MicProductView
                onAddToCart={handleAddToCart}
                setActiveView={setActiveView}
              />
            )}
            {activeView === 'digital-product' && (
              <DigitalProductView
                onAddToCart={handleAddToCart}
                setActiveView={setActiveView}
              />
            )}
            {activeView === 'filtering' && (
              <FilteringView
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cart side drawer */}
      <SidebarCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        savedSetups={savedSetups}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        onAddSavedSetupToCart={handleAddSavedSetupToCart}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />

      {/* Floating alert notice */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-xl flex items-center gap-2.5 animate-slide-in-left max-w-sm">
          <span className="text-xl">🎬</span>
          <span className="text-xs font-semibold text-slate-800">{activeToast}</span>
        </div>
      )}

       {/* Product detailed showcase card modal under 'خلي لكل منتج بطاقة عرض' */}
      <ProductCardDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Duplication confirmation modal */}
      {dupConfirmProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-800" dir="rtl">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setDupConfirmProduct(null)} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 text-right space-y-5 animate-scale-up z-10">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-xl">⚠️</span>
              <h2 className="text-base font-black text-slate-950">تأكيد إضافة المنتج مكرراً</h2>
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              لقد قمت بإضافة <span className="font-extrabold text-amber-600">"{dupConfirmProduct.product.nameAr}"</span> مسبقاً في سلة مشترياتك. 
              <br />
              هل ترغب بالتأكيد في إضافة نسخة أخرى من هذا المنتج إلى السلة؟
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setDupConfirmProduct(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                إلغاء الأمر
              </button>
              <button
                onClick={handleConfirmDuplicateAdd}
                className="px-5 py-2.5 text-xs font-black bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-600 transition-all shadow-md cursor-pointer"
              >
                نعم، أضف نسخة أخرى
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Error & Setup Popup-blocked guidance modal */}
      {authError && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-slate-800" dir="rtl">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setAuthError(null)} />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 text-right space-y-5 animate-scale-up z-10">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h2 className="text-base font-black text-slate-950">تنبيه بخصوص تسجيل الدخول</h2>
                <span className="text-[10px] text-amber-600 font-bold">حالة الـ Iframe والنافذة المنبثقة</span>
              </div>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              <p>
                يبدو أن متصفحك قد قام <span className="font-bold text-rose-600">بحظر النافذة المنبثقة</span> الخاصة بتسجيل الدخول الآمن من Google، أو تم إغلاقها قبل اكتمال العملية.
              </p>
              <p className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-amber-900 text-xs font-medium">
                💡 نظرًا لأن التطبيق يعمل ضمن نافذة معاينة آمنة (Iframe)، يوصى بـ <strong>المتابعة الفورية كعضو افتراضي</strong> لتجربة كافة الميزات وحفظ سلتك محلياً بشكل ممتاز وتلقائي بضغطة واحدة!
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setAuthError(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                إغلاق النافذة
              </button>
              <button
                onClick={() => {
                  setAuthError(null);
                  handleLogin();
                }}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                إعادة المحاولة 🔄
              </button>
              <button
                onClick={() => {
                  setAuthError(null);
                  handleDemoLogin();
                }}
                className="px-5 py-2.5 text-xs font-black bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-600 transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <span>الدخول الفوري كعضو تجريبي 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Foot */}
      <Footer />
    </div>
  );
}
