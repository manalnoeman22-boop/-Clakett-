/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Volume2, Star, Film, Eye, Award, CheckCircle2, ChevronRight, Sparkles, Check } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { ProductReviews } from './ProductReviews';

interface DigitalProductViewProps {
  onAddToCart: (product: Product) => void;
  setActiveView: (view: string) => void;
}

export const DigitalProductView: React.FC<DigitalProductViewProps> = ({
  onAddToCart,
  setActiveView,
}) => {
  const digProduct = PRODUCTS.find((p) => p.id === 'p7') || PRODUCTS[6]; // Cinematic Sound & LUT Bundle

  const [sliderVal, setSliderVal] = useState(50); // slider percent 0 to 100
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  
  // Audio state
  const audioContextRef = useRef<AudioContext | null>(null);

  // Download simulation state
  const [downloadStep, setDownloadStep] = useState<'idle' | 'paying' | 'downloading' | 'finished'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const fakeSounds = [
    { id: 'snd1', title: 'Cinematic Whoosh (تأثير الانتقال السينمائي الخاطف)', duration: '0:03', freq: 440, type: 'sine' as OscillatorType },
    { id: 'snd2', title: 'Heavy Impact Bass (ضربة الباس العميقة للهيبة السينمائية)', duration: '0:05', freq: 80, type: 'triangle' as OscillatorType },
    { id: 'snd3', title: 'Atmospheric Rise (التصاعد الجوي لشد الانتباه والوتيرة)', duration: '0:12', freq: 300, type: 'sawtooth' as OscillatorType },
  ];

  // Web Audio Synth Player to actually play the noise and provide an AMAZING interactive experience
  const playSynthSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      if (type === 'sawtooth') {
        // atmospheric slide upwards
        osc.frequency.exponentialRampToValueAtTime(freq * 2.5, ctx.currentTime + duration);
      } else if (type === 'sine') {
        // slide quick down sweep (whoosh)
        osc.frequency.exponentialRampToValueAtTime(freq / 3, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio synthesizer not supported or blocked:', e);
    }
  };

  const handlePlayAudio = (id: string, freq: number, type: OscillatorType) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      playSynthSound(freq, type, type === 'sawtooth' ? 1.5 : 0.8);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, type === 'sawtooth' ? 1500 : 800);
    }
  };

  // Simulate Digital checkout and immediate delivery download bar
  const handlePurchaseAndDownload = () => {
    setDownloadStep('paying');
    setDownloadProgress(0);

    // Simulate Payment Node
    setTimeout(() => {
      setDownloadStep('downloading');
      
      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setDownloadStep('finished');
            }, 600);
            return 100;
          }
          return prev + 8;
        });
      }, 150);

    }, 2000);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-850 py-12 px-4 sm:px-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Hero Digital intro header */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-xl text-right">
            <span className="inline-block bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              ⚡ جيل جديد من الإنتاج الرقمي
            </span>
            <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight leading-tight text-slate-900">
              {digProduct.nameAr}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              تلوين سينمائي وتصميم صوتي مخصص بالكامل ليمنح فيديوهاتك لمسة هوليوودية مهيبة. متطورة بالتعاون مع كبار مخرجي الصوت واللون لتناسب كاميرات الهواتف والـ DSLRs.
            </p>
            <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500">
              <span className="flex items-center gap-1 text-amber-600">⭐ 4.9 (312 تقييم)</span>
              <span>•</span>
              <span className="text-amber-700">حجم الملف: 450MB</span>
              <span>•</span>
              <span className="text-green-600">تحميل مباشر فوري ⚡</span>
            </div>
            
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onAddToCart(digProduct)}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                شراء وحفظ الترخيص التجاري 🎟️
              </button>
              <button
                onClick={handlePurchaseAndDownload}
                className="px-5 py-3 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                تجربة تحميل تجريبي فوري
              </button>
            </div>
          </div>

          {/* Product Cover image or Live Video Player */}
          <div className="relative w-48 sm:w-64 shrink-0 aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 group">
            {isPlayingVideo ? (
              <div className="relative w-full h-full">
                <video
                  src="https://assets.mixkit.co/videos/preview/mixkit-lens-of-a-video-camera-filming-in-a-studio-34293-large.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 px-2 py-1 rounded text-white text-[9px] font-bold transition-all z-10 cursor-pointer"
                >
                  إيقاف مؤقت ✕
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <img
                  src={digProduct.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="bundle cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-all">
                  <div className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play size={20} className="fill-slate-950 ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded shadow-sm">
                  عرض فيديو العينات 🎥
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 text-center bg-white/95 backdrop-blur-md py-1 rounded-lg text-[9px] font-black text-amber-700 shadow-sm border border-slate-100 pointer-events-none z-10">
              صيغة: WAV & CUBE
            </div>
          </div>
        </div>

        {/* Cinematic LUT visualizer split slide */}
        <section className="space-y-4">
          <div className="text-right">
            <span className="text-amber-700 font-extrabold text-xs block">معاينة تلوين الكاميرا LUTs 🎨</span>
            <h2 className="text-lg sm:text-2xl font-black font-sans text-slate-900">اسحب الشريط لملاحظة تصحيح الألوان (قبل وبعد)</h2>
            <p className="text-xs text-slate-500 font-extrabold">قارن مظهر الفلاتر السينمائية الاحترافية في مقابل التصوير الخام الرمادي S-Log.</p>
          </div>

          <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
            
            {/* Base Image (Cinema Cinematic look) */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZB5Ypi9C4iLYzIl895O0qzmyIGaBU4B8qimHVB1JuDOdu2BbpngsxqsSXqza5dLeZMpgdP92Ggd0Q2glsAEUQhQTS3Sxgx124NdHseNkppa49cC64rJjBeINVsUR_zScS_6-dDfXQsOZivOFF7K7EjTFV0PRzL59kALrDauAQFcddfDPBRHBKEmx3dy-IIJ7i7lwna4ejuBlspFYXP9aY8kh6E6f2hn-kly5YGc6tRBlsbLtfObwFWWPPZqKQpB-urmXuDnta7hU"
              className="absolute inset-0 w-full h-full object-cover"
              alt="Corrected grading view"
            />

            {/* RAW flat image overlay dynamically clipped */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`,
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZB5Ypi9C4iLYzIl895O0qzmyIGaBU4B8qimHVB1JuDOdu2BbpngsxqsSXqza5dLeZMpgdP92Ggd0Q2glsAEUQhQTS3Sxgx124NdHseNkppa49cC64rJjBeINVsUR_zScS_6-dDfXQsOZivOFF7K7EjTFV0PRzL59kALrDauAQFcddfDPBRHBKEmx3dy-IIJ7i7lwna4ejuBlspFYXP9aY8kh6E6f2hn-kly5YGc6tRBlsbLtfObwFWWPPZqKQpB-urmXuDnta7hU"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-125 contrast-[0.4]"
                alt="Raw camera log profile view"
              />
            </div>

            {/* Labels overlay */}
            <span className="absolute bottom-4 right-4 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full z-10 shadow-sm">
              بعد التطبيق: Cinematic LUT 🔥
            </span>
            <span className="absolute bottom-4 left-4 bg-slate-900 text-slate-200 font-extrabold text-[10px] px-2.5 py-1 rounded-full z-10 border border-slate-705 shadow-sm">
              قبل التطبيق: S-Log FLAT 📷
            </span>

            {/* Real Interactive range input styled over */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full bg-transparent accent-amber-500 pointer-events-auto cursor-col-resize h-4 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </section>

        {/* "مكتبة المؤثرات الصوتية" with audio play button controls */}
        <section className="space-y-4">
          <div className="text-right">
            <span className="text-amber-700 font-extrabold text-xs block">مؤثرات هوليوودية (تحميل تمثيلي بنماذج الـ Synth) 🎹</span>
            <h2 className="text-lg sm:text-2xl font-black font-sans text-slate-900">عاين نقرة وجاذبية المؤثرات الصوتية المرفقة</h2>
            <p className="text-xs text-slate-500 font-extrabold">انقر للتشغيل والاستماع لتأثيرات السينمائية المهيبة المتضمنة في الحزمة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            {fakeSounds.map((snd) => {
              const isPlaying = playingAudioId === snd.id;
              return (
                <div
                  key={snd.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlayAudio(snd.id, snd.freq, snd.type)}
                      className="h-11 w-11 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    >
                      {isPlaying ? (
                        <div className="flex gap-0.5 items-end justify-center h-4 w-4">
                          <span className="w-0.5 bg-slate-950 h-3 animate-pulse" />
                          <span className="w-0.5 bg-slate-950 h-4 animate-pulse delay-75" />
                          <span className="w-0.5 bg-slate-950 h-2 animate-pulse delay-150" />
                        </div>
                      ) : (
                        <Play size={16} className="fill-slate-950" />
                      )}
                    </button>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight line-clamp-1">{snd.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">طبيعة الموجة: {snd.type} / المدة: {snd.duration}</p>
                    </div>
                  </div>
                  
                  {/* Small wave animation if playing */}
                  {isPlaying && (
                    <Volume2 size={16} className="text-amber-600 animate-bounce" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Ready for download preview simulate */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-sm">
          <h3 className="text-lg sm:text-2xl font-black font-sans text-slate-900">شريط التحميل الفوري الاختباري 🚀</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto font-bold leading-relaxed">
            اختبر سرعة التحميل الخاصة بخوادمنا الرقمية المؤرشفة سحابياً. لا حاجة لبطاقة ائتمانية للاختبار!
          </p>

          <div className="max-w-md mx-auto space-y-4">
            {downloadStep === 'idle' && (
              <button
                onClick={handlePurchaseAndDownload}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>ابدأ محاكاة الفحص والتحميل ⚡</span>
              </button>
            )}

            {downloadStep === 'paying' && (
              <div className="flex flex-col items-center gap-2 py-4">
                <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-extrabold text-slate-600">جاري تفحص البوابة الرقمية وإعداد الروابط السحابية...</span>
              </div>
            )}

            {downloadStep === 'downloading' && (
              <div className="space-y-2 py-2 text-right">
                <div className="flex justify-between text-xs font-extrabold text-slate-600">
                  <span>جاري نقل حزمة المميزات Clakett_Cinematic.zip</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 border border-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-l from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-150"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {downloadStep === 'finished' && (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center space-y-2 animate-scale-up">
                <div className="h-10 w-10 bg-green-500 text-white font-extrabold rounded-full flex items-center justify-center mx-auto text-lg mb-1 shadow-sm">
                  ✓
                </div>
                <h4 className="text-sm font-black text-green-700 font-sans">تم تنزيل الحزمة بنجاح!</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed font-sans">لقد تم توليد وتنزيل ملف الأرشيف بمعدل نقل فائق. تم حفظ تفاصيل الرخصة في لوحة التحكم.</p>
                <button
                  onClick={() => setDownloadStep('idle')}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] rounded-lg border border-slate-200 cursor-pointer shadow-sm"
                >
                  إعادة التجربة
                </button>
              </div>
            )}
          </div>
        </section>

        {/* User Reviews and Ratings section to increase trust and engagement */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="digital-ratings-container">
          <div className="bg-amber-500/5 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-sans">تعليقات وآراء المبدعين والسينمائيين مراجعي الحزمة ⭐</h2>
            <span className="text-amber-800 text-xs font-bold bg-amber-550/10 px-2.5 py-1 rounded-full">٣١٢ تقييم حقيقي</span>
          </div>
          <ProductReviews productId={digProduct.id} />
        </div>

      </div>
    </div>
  );
};
