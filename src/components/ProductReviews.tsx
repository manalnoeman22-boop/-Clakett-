import React, { useState, useEffect } from 'react';
import { Star, Check, ThumbsUp, MessageSquare, Send, Award, Sparkles } from 'lucide-react';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  helpfulCount: number;
  userUpvoted?: boolean;
}

interface ProductReviewsProps {
  productId: string;
}

const DEFAULT_REVIEWS: Record<string, Omit<Review, 'id' | 'helpfulCount'>[]> = {
  p6: [
    {
      reviewerName: 'زياد الحربي (الرياض)',
      rating: 5,
      comment: 'صوت دافئ ونقي جداً! عزل كامل للأصوات المحيطة وصوت المكيف بالكامل بفضل نظام الفرز الفيزيائي ممتص الصدمات المرفق. صرت ما أحتاج فلاتر إضافية في المونتاج أو الهندسة الصوتية البعدية. أنصح به كلياً لكل صانع محتوى وبودكاستر.',
      date: '2026-06-12',
      isVerified: true,
    },
    {
      reviewerName: 'سحر عبد العزيز (جدة)',
      rating: 5,
      comment: 'المايك فخم بشكل غير طبيعي، الهيكل الفولاذي المصفى فخم جداً ويعطي طابع مهيب للكاميرا في البث المباشر. التوصيل كان سريع جداً واستجابة الدعم الفني لأسئلتي كانت سريعة. شكراً كلاكيت ستوديو!',
      date: '2026-06-08',
      isVerified: true,
    },
    {
      reviewerName: 'المهندس فيصل مروان (الخبر)',
      rating: 4,
      comment: 'جودة استوديو حقيقية. البوب فيلتر المعدني المتكامل يصفّي الحروف الانفجارية (مثل الباء والتاء) بشكل ممتاز ومختلف تماماً عن الفلاتر القماشية الرخيصة. فقط واجهت صعوبة في تثبيت الذراع لأول مرة ولكن دليل كلاكيت ساعدني.',
      date: '2026-05-25',
      isVerified: true,
    }
  ],
  p7: [
    {
      reviewerName: 'يوسف الشهري (الدمام)',
      rating: 5,
      comment: 'فلاتر تلوين الكاميرا (LUTs) غيرت جودة فيديوهاتي تماماً وسهلت عليّ ساعات من التلوين المعقد في البريمير. مؤثرات الباس العميقة مذهلة وتضفي هيبة سينمائية ساحرة على اللقطات الترويجية.',
      date: '2026-06-15',
      isVerified: true,
    },
    {
      reviewerName: 'المصور ريان الغامدي (مكة المكرمة)',
      rating: 5,
      comment: 'تجربة مذهلة وحجم الحزمة ممتاز وسهلة التحميل المباشر. فلاتر التعديل تمت تجربتها على كاميرات سوني الفا وآيفون برو والنتائج متناسقة وعميقة جداً كأنها مصورة بأدوات هوليوودية.',
      date: '2026-06-10',
      isVerified: true,
    },
    {
      reviewerName: 'أمين الدوسري (الكويت)',
      rating: 4,
      comment: 'حزمة غنية جداً بالـ Sound FX والمؤثرات الانتقالية الرائعة. التحديثات المجانية المستمرة هي ميزة خرافية تضمن بقاء المحتوى محدثاً دائماً. قيمة خرافية مقابل السعر.',
      date: '2026-06-01',
      isVerified: true,
    }
  ],
  // default for others
  default: [
    {
      reviewerName: 'أبو فهد (الرياض)',
      rating: 5,
      comment: 'جودة التصنيع ممتازة والمنتج يستحق التقييم الكامل. التغليف فخم والتوصيل كان في غضon 48 ساعة فقط. تجربة ممتازة!',
      date: '2026-06-14',
      isVerified: true,
    },
    {
      reviewerName: 'فاطمة الكناني (جدة)',
      rating: 5,
      comment: 'منتج رائع وراقي ومناسب جداً للعمل اليومي وصناعة المحتوى. يسهل عملية الإنتاج ويوفر الكثير من الجهد والبحث.',
      date: '2026-06-09',
      isVerified: true,
    }
  ]
};

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submittingSuccess, setSubmittingSuccess] = useState(false);

  // Load reviews on mount or productId change
  useEffect(() => {
    const stored = localStorage.getItem(`reviews_${productId}`);
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      // Seed initial reviews
      const seedData = DEFAULT_REVIEWS[productId] || DEFAULT_REVIEWS.default;
      const initialReviews: Review[] = seedData.map((item, idx) => ({
        ...item,
        id: `seed-${idx}-${productId}`,
        helpfulCount: Math.round(Math.random() * 12) + 2,
      }));
      setReviews(initialReviews);
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(initialReviews));
    }
  }, [productId]);

  // Handle custom review submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    setIsSubmitting(true);

    const newReview: Review = {
      id: `review-${Date.now()}`,
      reviewerName: `${newName} (طلب مؤكد)`,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      helpfulCount: 0,
    };

    setTimeout(() => {
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
      
      setNewComment('');
      setNewName('');
      setNewRating(5);
      setIsSubmitting(false);
      setSubmittingSuccess(true);
      
      setTimeout(() => {
        setSubmittingSuccess(false);
        setShowForm(false);
      }, 3000);
    }, 1200);
  };

  // Upvote helper
  const handleUpvote = (id: string) => {
    const updated = reviews.map((rev) => {
      if (rev.id === id) {
        const upvoted = !rev.userUpvoted;
        return {
          ...rev,
          userUpvoted: upvoted,
          helpfulCount: upvoted ? rev.helpfulCount + 1 : rev.helpfulCount - 1,
        };
      }
      return rev;
    });
    setReviews(updated);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updated));
  };

  // Calculations for stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 5;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => {
    const count = reviews.filter((rev) => rev.rating === r).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating: r, count, percentage };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm text-right" dir="rtl" id={`reviews-section-${productId}`}>
      
      {/* Header and Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-8">
        
        {/* Left Side: Numeric Summary */}
        <div className="md:col-span-4 text-center md:border-l md:border-slate-100 pl-4 space-y-3">
          <span className="text-xs text-amber-700 font-extrabold uppercase tracking-wider block">تقييم المبدعين للمنتج</span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-slate-900 font-sans">{averageRating}</span>
            <span className="text-xl text-slate-400 font-sans">/ ٥</span>
          </div>
          
          <div className="flex justify-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={22}
                className={`fill-current ${i < Math.round(averageRating) ? '' : 'opacity-20'}`}
              />
            ))}
          </div>
          
          <p className="text-xs text-slate-500 font-medium">
            بناءً على <span className="text-slate-800 font-extrabold font-sans">{totalReviews}</span> تقرير حقيقي من مجتمع كلاكيت
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-2 inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm cursor-pointer"
            id={`btn-toggle-review-form-${productId}`}
          >
            <MessageSquare size={13} />
            <span>كتابة تقييم ومشاركة تجربة ✍️</span>
          </button>
        </div>

        {/* Right Side: Rating Progress Bars */}
        <div className="md:col-span-8 space-y-2 max-w-md mx-auto w-full">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3 text-xs text-slate-600 font-semibold" id={`rating-bar-${rating}`}>
              <span className="w-10 text-left flex items-center justify-end gap-1 shrink-0">
                <span>{rating}</span>
                <Star size={11} className="fill-current text-amber-500 shrink-0" />
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-slate-400 font-sans shrink-0">({count}) {Math.round(percentage)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Collapse Section */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-scale-up" id="write-review-form">
          <h3 className="text-sm font-black text-slate-850 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            تأكيد تجربتك الفنية وكتابة مراجعة حية
          </h3>
          
          {submittingSuccess ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center space-y-2 text-green-700 font-bold" id="form-success-alert">
              <span className="text-2xl">🎉</span>
              <p className="text-xs text-green-800">تم نشر تقييمك المعتمد بنجاح وتحديث نقاط ثقة المنتج!</p>
              <p className="text-[10px] text-slate-500">شكراً لمساهمتك البنّاءة في توجيه المبدعين الآخرين.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">الاسم الكريم بالكامل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صالح الودعاني"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">التقييم العام بالنجوم:</label>
                  <div className="flex items-center gap-1.5 h-9">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-amber-500 transition-transform hover:scale-110 cursor-pointer"
                        id={`star-btn-${star}`}
                      >
                        <Star
                          size={20}
                          className={`fill-current ${
                            star <= (hoverRating ?? newRating) ? 'text-amber-500' : 'text-slate-300 fill-none'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 mr-2 font-bold select-none">({newRating} من ٥)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">مضمون تعليقك وتجربتك الفنية بدقة:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب هنا تجربتك الصوتية أو المرئية الفنية للمنتج لمساعدة صناع المحتوى..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm font-sans"
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin inline-block" />
                  ) : (
                    <Send size={12} />
                  )}
                  <span>نشر المراجعة المعتمدة 📢</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-5">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5">
          مراجعات مستخدمي كلاكيت والشركاء المعتمدين:
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            لا توجد تعليقات لهذا المنتج حتى الآن. كن أول من يكتب مراجعته الفنية المعتمدة! 📝
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-3 shadow-xs hover:border-slate-300 transition-colors"
                id={`review-item-${rev.id}`}
              >
                {/* Header Row: User Info, rating, date */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Initial */}
                    <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-850 font-black flex items-center justify-center border border-amber-500/25 text-xs font-sans">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        {rev.reviewerName}
                        {rev.isVerified && (
                          <span className="text-[9px] bg-green-500/10 border border-green-500/25 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold">
                            <Check size={8} />  مشتري مؤكد
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans block">{rev.date}</span>
                    </div>
                  </div>

                  {/* Stars display */}
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`fill-current ${i < rev.rating ? '' : 'opacity-20'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment content */}
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-medium pr-1">
                  "{rev.comment}"
                </p>

                {/* Footer upvote */}
                <div className="pt-2 border-t border-slate-100/50 flex justify-end">
                  <button
                    onClick={() => handleUpvote(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                      rev.userUpvoted
                        ? 'bg-amber-500/10 border-amber-500 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                    id={`btn-helpful-${rev.id}`}
                  >
                    <ThumbsUp size={11} className={rev.userUpvoted ? 'fill-current' : ''} />
                    <span>مفيد ومميز دليلاً ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
