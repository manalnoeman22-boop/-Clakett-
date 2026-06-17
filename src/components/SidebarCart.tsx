/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Sparkles, FolderHeart } from 'lucide-react';
import { CartItem, SavedSetup } from '../types';

interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  savedSetups: SavedSetup[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  onAddSavedSetupToCart: (setup: SavedSetup) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export const SidebarCart: React.FC<SidebarCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  savedSetups,
  updateQuantity,
  removeFromCart,
  onAddSavedSetupToCart,
  onCheckout,
  isCheckingOut,
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'setups'>('cart');

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" dir="rtl">
      {/* Overlay Background */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
 
      {/* Drawer content */}
      <div className="relative w-full max-w-md h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl z-10 animate-slide-in">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <X size={20} className="text-slate-500 hover:text-slate-900 cursor-pointer" onClick={onClose} />
            <h3 className="text-slate-800 font-sans font-extrabold text-lg">سلة الإبداع 🎬</h3>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-500/20">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} منتجات
          </span>
        </div>
 
        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('cart')}
            className={`py-3.5 text-xs font-semibold text-center border-b-2 transition-all ${
              activeTab === 'cart'
                ? 'border-amber-500 text-amber-700 bg-amber-500/[0.02] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🛒 المشتريات الحالية
          </button>
          <button
            onClick={() => setActiveTab('setups')}
            className={`py-3.5 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'setups'
                ? 'border-amber-500 text-amber-700 bg-amber-500/[0.02] font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderHeart size={14} />
            سيت أبات محفوظة ({savedSetups.length})
          </button>
        </div>
 
        {/* Dynamic content scroll area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'cart' ? (
            cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
                <span className="text-5xl">🛒</span>
                <p className="text-sm font-bold text-slate-800">السلة فارغة حالياً</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  أضف بعض المعدات أو جرب طقم كلاكيت صانع المحتوى لتوفير 25٪ فوراً ودخول عالم النجومية.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl transition-all hover:border-slate-300"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.nameAr}
                      className="h-16 w-16 rounded-lg object-cover bg-slate-100 border border-slate-200"
                    />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.nameAr}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">
                          {item.product.categoryAr}
                        </span>
                      </div>
 
                      <div className="flex items-center justify-between mt-2">
                        {/* Selector Controls */}
                        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-md py-1 px-2 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-extrabold text-slate-800 min-w-[12px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-xs font-black text-slate-800">{item.product.price * item.quantity} ر.س</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            savedSetups.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
                <span className="text-5xl">🎨</span>
                <p className="text-sm font-bold text-slate-800">لا توجد سيت أبات محفوظة</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  يمكنك حفظ تركيبات السيت أب المخصصة الخاصة بك بمجرد تسجيل الدخول وإنشاء تصميمك في صفحة صانع السيت أب!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSetups.map((setup) => (
                  <div
                    key={setup.id}
                    className="bg-white border border-slate-200 hover:border-amber-500/30 p-4 rounded-xl space-y-3 shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          <Sparkles size={14} className="text-amber-600" />
                          {setup.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">تم الحفظ في: {new Date(setup.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <span className="text-sm font-extrabold text-amber-700">{setup.totalPrice} ر.س</span>
                    </div>
 
                    <div className="text-[11px] text-slate-650 leading-relaxed">
                      <strong>المحتويات:</strong> {setup.items.join(' + ')}
                    </div>
 
                    <button
                      onClick={() => onAddSavedSetupToCart(setup)}
                      className="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-700 border border-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      إعادة سحب السيت أب للسلة 🛒
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
 
        {/* Cart/Checkout calculations - Stick to the bottom of Drawer */}
        {activeTab === 'cart' && cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold text-slate-800">{total} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>الشحن (شحن آمن سريع خلال 48 ساعة):</span>
                <span className="text-green-600 font-extrabold">مجاني 🚀</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2 text-slate-800 font-sans font-extrabold">
                <span className="text-amber-750">المجموع الكلي:</span>
                <span className="text-lg text-slate-900 font-black">{total} ر.س</span>
              </div>
            </div>
 
            <button
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              id="checkout-submit-btn"
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري معالجة الطلب الآمن...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>إتمام الشراء والدفع الآمن</span>
                </>
              )}
            </button>
          </div>
        )}
 
      </div>
    </div>
  );
};
