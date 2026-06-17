/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, LogIn, LogOut, Menu, X, Sliders, LayoutDashboard, Compass, Radio, Film } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  cartCount: number;
  toggleCart: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cartCount,
  toggleCart,
  user,
  onLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'الرئيسية', icon: Compass },
    { id: 'mic-product', label: 'مايك Elite', icon: Radio },
    { id: 'digital-product', label: 'حزمة الصوت', icon: Film },
    { id: 'filtering', label: 'المتجر والفلترة', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 hover:text-slate-900 md:hidden animate-pulse"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div
            onClick={() => setActiveView('explore')}
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            id="brand-logo"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzMHkruzOC40Hxqe6o4kv51z0zGsfm_phCdQRbRWLrQV3xIzC1TX1FUl1JQCBbjDYi-ZZ6uEr4PQMvEBLfOBz9-PXrTbFAFuh6Swf74nGOex2LdQxkTfyt5hDCNByl6lSt-V4B_YTpM9S7rN__LsJkCDB2jb7XbJ4bASiwWij9TfUzg3mBqKE0l09HcEnJQdJYVA06cyGkwvN2R28WNzFeka5M5pcfwZ7VDHNER3CjldjrXoCtV6zWPv4AlGbyX8bp4SyRrwSBbcU"
              alt="كلاكيت ستوديو"
              className="h-9 w-auto rounded-md object-contain"
            />
            <span className="font-sans font-bold text-lg tracking-tight text-slate-800 hidden sm:inline">
              كلاكيت <span className="text-amber-500 font-extrabold">ستوديو</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Linkages */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id={`nav-${item.id}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Interactions */}
        <div className="flex items-center gap-3">
          {/* Setup builder CTA */}
          <button
            onClick={() => setActiveView('filtering')}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            id="header-setup-builder"
          >
            صانع السيت أب
          </button>

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 transition-all cursor-pointer"
            id="cart-trigger"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Auth Selector */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-left items-end">
                <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">{user.displayName}</span>
                <span className="text-[10px] text-slate-500 max-w-[120px] truncate">{user.email}</span>
              </div>
              <img
                src={user.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB06mTSxC7eTZRK-K4VQQaCIIuMab922qzXRgLC8A4W0dnrJG0gtg_SfxfQ38OAkbWjPXf7cl-88bRzHRjwGJd1ubA-CSLH9A0khMhr34eXqKx0zZ_r-yUUo46hA_NS48NEVX65JUYSTS8IKMS9KlmtWOuZNbmsdZ-VkW7JhcP2I5ph1bYUjWFcPkJIRrE8s7GV1h2M7tt6dNaf51b2TeY05Bx8XzM6fV3kJ9igqGhgEXQKKZWxRETEhtTHqBzwderEF_jG8TgqSjk'}
                alt={user.displayName || 'Creator'}
                className="h-8.5 w-8.5 rounded-full border border-amber-500/50 cursor-pointer object-cover"
                onClick={() => setActiveView('explore')}
              />
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="تسجيل الخروج"
                id="btn-logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="gsi-material-button transition-transform hover:scale-[1.02]"
              id="header-sign-in"
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div className="gsi-material-button-icon" style={{ width: '18px', height: '18px' }}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute right-0 left-0 top-full bg-white border-b border-slate-200 p-4 md:hidden flex flex-col gap-2 transition-all shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              setActiveView('filtering');
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold rounded-lg bg-slate-900 text-white mt-2 shadow-sm cursor-pointer"
            id="mobile-setup-builder"
          >
            صانع السيت أب
          </button>
        </div>
      )}
    </header>
  );
};
