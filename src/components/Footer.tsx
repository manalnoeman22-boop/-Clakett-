/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzMHkruzOC40Hxqe6o4kv51z0zGsfm_phCdQRbRWLrQV3xIzC1TX1FUl1JQCBbjDYi-ZZ6uEr4PQMvEBLfOBz9-PXrTbFAFuh6Swf74nGOex2LdQxkTfyt5hDCNByl6lSt-V4B_YTpM9S7rN__LsJkCDB2jb7XbJ4bASiwWij9TfUzg3mBqKE0l09HcEnJQdJYVA06cyGkwvN2R28WNzFeka5M5pcfwZ7VDHNER3CjldjrXoCtV6zWPv4AlGbyX8bp4SyRrwSBbcU"
              alt="كلاكيت ستوديو"
              className="h-8 w-auto opacity-90"
            />
            <span className="font-bold text-slate-800 text-lg font-sans">
              كلاكيت <span className="text-amber-500">Creative</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            المنصة الأولى المخصصة بالكامل لصنّاع المحتوى، الستريمرز والمبدعين الرقميين في العالم العربي. نجمع لك جودة التصنيع مع سهولة البرمجة وإدارة مشاريعك.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-slate-800 font-semibold text-sm mb-4">أقسام الاستوديو</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="hover:text-amber-600 transition-colors cursor-pointer">📸 غرف التصوير والكاميرات</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">🎙️ المايكروفونات والصوتيات</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">💡 الإضاءة العلوية وبلاطات الـ LED</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">🎮 كراسي القيمنق والإكسسوارات</li>
          </ul>
        </div>

        {/* Integrations */}
        <div>
          <h4 className="text-slate-800 font-semibold text-sm mb-4">ميزات احترافية</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="hover:text-amber-600 transition-colors cursor-pointer">⚙️ ربط تلقائي بـ Google Drive & Calendar</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">📧 إرسال الفواتير المباشر عبر Gmail</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">📝 مدونة كتابة السكريبتات وحفظ الأفكار</li>
            <li className="hover:text-amber-600 transition-colors cursor-pointer">📦 تتبع سريع للشحنات والدبات</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-800 font-semibold text-sm">النشرة الإخبارية للمبدعين</h4>
          <p className="text-xs text-slate-500">
            اشترك معنا لتصلك أقوى الدروس لتطوير قنواتك، عروض الخصومات الفورية ونصائح المونتاج.
          </p>
          
          <form onSubmit={handleSubscribe} className="relative flex" id="newsletter-form">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2.5 pl-12 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-400"
              required
            />
            <button
              type="submit"
              className="absolute left-1.5 top-1.5 bottom-1.5 px-3 bg-amber-500 hover:bg-amber-600 font-bold text-xs text-black rounded-md flex items-center justify-center transition-all cursor-pointer"
            >
              {subscribed ? <CheckCircle2 size={16} /> : <Mail size={16} />}
            </button>
          </form>
          {subscribed && (
            <span className="text-xs text-green-600 animate-pulse">تم الاشتراك بنجاح! شكراً لانضمامك 🎉</span>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <div>© 2026 كلاكيت ستوديو. جميع الحقوق معززة ومحفوظة. رقم التتبع: 1079787034</div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <span className="hover:underline cursor-pointer">اتفاقية الخدمة</span>
          <span className="hover:underline cursor-pointer font-bold text-amber-600">صنع بحب في فضاء البرمجة</span>
        </div>
      </div>
    </footer>
  );
};
