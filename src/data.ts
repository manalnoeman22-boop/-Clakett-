/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Bundle } from './types';

export const STORIES = [
  {
    id: 's1',
    title: 'صوتك مسموع',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf_camcIiiWI7z-2pP-zUzAvNucsckTWjADT79z2b2s6FnBBkRYzRCozWE1w7epv9V5tviO12JCaJZTTYke7-TqwWJ8Doec8K62aozbByLZsiXIHyJz1JMqUETbIehRO2ZIjM4qRGhK6muXSP5sXZdCTE9bIH3QZBJVh_eYHENyz22U8kopfkT-Npj437eakFh9LRqqsLcQYz-4NBRq-KHQv1Byxw9V61jebq6s4k4MEtM65Fyd1ZCD4GG_4a_ANC3JiBkjk1WY5g',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJa0OyNCFSryXKec9fNBYxPYP9E2YHhzQDyjB69HMIJBsW9fJfvzhK_i3uJhhxUgBqsU6YGeCUKAUsJJHN6AwGSFJxBnP3c-k2uGiYo6A2kAMpMRryFujqWfi1OP0mMMOT_NRiyY8tyxNuzy5FavIZkCDi6llZ55S0qK4Fth2LcxSNnjiFdQfSyjsnPsSx0nBh8MkThiKo5OJN6invSDyUBqfoCIi7yQdCcAeEpisdYBaZNWPn8rZk4RY_982T9xKczahEGn1eVcE',
    desc: 'احصل على أنقى درجات الصوت مع المايكروفونات الاحترافية وفلاتر العزل الذكية.'
  },
  {
    id: 's2',
    title: 'عدسة احترافية',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjkKIwuDx_EKtk52Av8zctJjcr21uPumTMrqFiB2a-wrakTYi7gpBPij8pTh5fA2QycvE4MI0HwCDydUCbgC4K2vYbaxyh06EZHhJA0gXPjVmujlLus0uoaMkGxpb_CQhCBymL-jXyIFiwr_nFtYx2Oprps58XkDg1HNrj0VdpFJPSDK7zdauSTHzUXoF_G2t7wg3WTSyDfgOiFoZ4OTAWzLwLRBBtbLAf42Yg4piGW-6BAeHCjJOc-5K-fpswzJQEbODXWADckUI',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFIyRhfy8jlXyYJaFO8No53V4SSYyJHNz2vN16P_5vwsJpNrmoQ4cvALiACmoxMOWzpu2X-wNqrJcO41EQV0zh44iW0imecAlq0QpFcFug5HC1Le75DroxfDkufbsWJ9NzFklnaemOjupmgkZdT21yX59vcWAYxHaQkMu9xOZA63HZfhf9zhSM9tvo65b9QaA4u9t8KEw3pz-0HspIcOC3ZsTMWG7ug2XZtVMPy1E9sC9JzRcThpfA-MBonNyGhW3iC6isXD0J9ic',
    desc: 'كاميرات بدقة 4K وعدسات سينمائية تعطي فيديوهاتك مظهراً سينمائياً خلاباً.'
  },
  {
    id: 's3',
    title: 'سيت أب أحلامك',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6cEdFI5nexA-JAku7utU_lmVHwjQCVbUBaV3X_zu5qu75-LK9SIsBT8XAZN3FnUmNSe3UUb6a97ICenVSF3tJ2XNNlGBU0MZzI9g-MTG9y33Vw4yLkClF7sciJ9dzaC62JLXlG8FFl4fYnSkRPSVL2-QW-Pdp6azEUTCUyXOwYQDkKJeI4900fglbOwO8cQSc7831C0_xnbVJECwlaYd4FVFnKSWZOtqgbm4gcDkJ_wjvoQclI56ksOkW7922mtlnsyo9VRjF8bA',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbucFHJv_tfCHnScFsNSrTXHDCRQn7_4ElASeHUfSXWUvB2u4QgNSgExGj9UTEzE5QXI6AVfgssupdi_MEPJq6Ww9iG3AWtRMqOu3CEnTxg1HjJfOJau9KthBMdm3NSKNKvMpWvcI7pTFco2KjF8Owb_xRP-3DzsM0kD976RKHkQqOhQSnlliIgN6tlnLqpXrqnOmlE6z6Z1N0qzCjv6tqh93Xdu26_m_JOxL1E5xOlpt_5Dn8h5crsXmohYq3v3SPKPFHRISixsI',
    desc: 'كيبوردات ميكانيكية، كراسي راحة، طاولات هيدروليكية مجهزة لإبقائك في قمة أدائك.'
  },
  {
    id: 's4',
    title: 'عروض فورية',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB105P2-hUvpPq51Ns0GhAJ_rxbMDtaQ_Bb9xij-YfW_n-jxaRml8USX66kXIj9A024Q4Y_-3JPi3Md2YICTYx1TCsKIlQIQVctU-RtAQZaRPyGyox0WEwjTBwE5DGiORp0Jg4NOInLWinKAm6DwbaJwK-mXfwFXSXw8OcqORv58ZPA3i0OdeR28kpIeDudhKC2u0sfDpNfga9tFyDa7MAumgCbueeYzL54Rqfo7KuenrgXtoaXCW2nj1bp_OfcoBTUNknWISJokqQ',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjAOdqaeRp4xpp0NgLxDBZiD8BpKCOC8CojNUennoY7ZFLu7QReqtSP-L2SW6oyydJwgU6WDlva6Lh1gVTWbErCacFV7emAMZ_Zj1tbOU8gtLp6T6epLQFGGiBwsxu97CX9byuRAHcLF2PZnp8M8hHLp0on4Kt_bgCD85C9Bb08yS1BM2T6UN0c_uD204U1r2XhKZUKnHivN3xgN2H88LnW03MDFG5EGkXUmg3Fng7bk2tVSg9mw4Lp5q9r4blubT9PxLfeTqgOpE',
    desc: 'باقات متكاملة وخصومات حصرية تبدأ من 15% وحتى 30% للأعضاء المسجلين لدينا.'
  },
  {
    id: 's5',
    title: 'خلف الكواليس',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADn9Zrs1-4PoNi5qAD7gf2g3BaYNyRACpFS10BD_E9m57dUWtyOj2vrpXR8QpAbl4U3Cwbt1IzCeMlXF3sOgzvibI5UxJJyTSWV-67IwW0PNPrVQUx3SNfxSDmVmEEPynQNr-5ITi9uXOCqT5lqrstq_OrcIkAoIZFWNwJwA9QLJhzpv4yhZV4ImFPqd1O78u1PLJaBy6-xY_kPKzWcsK3PNJ7srsPobtIrKR6GeKEczjuAwj_NGPd6F4hSugqEu6kpX2FC2fIXe0',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXeXFvX6JvL1K343Z_F986R-gS1A32p2W-nB-2S3z0_nN9qC97XN7U7E_vB-7C-Z8_U9R8w_z0Y_-qO_x0Gv7C-v6Z-Z9C_-f0Y7RzX8w-z0_n9qC-7_Z8v-7C-Z8_Yqp8w',
    desc: 'رحلة تفصيل وتجهيز منتجات كلاكيت ستوديو من حلم الفكرة حتى جدران غرفتك.'
  }
];

export const BUNDLES: Bundle[] = [
  {
    id: 'b1',
    nameAr: 'باقة صانع المحتوى المتكاملة',
    descriptionAr: 'وفر 25٪ فوراً مع الباقة الأكثر مبيعاً التي ستغنيك عن أي استوديو خارجي. تشمل إضاءة سينمائية، مايك رقمي فاخر، وحوامل سريعة التجهيز.',
    itemsAr: [
      'مايكروفون Elite Streaming للبث',
      'إضاءة ستوديو سوفت بوكس احترافية 850 لومن',
      'ذراع مايكروفون هيدروليكي',
      'كروما خضراء خلفية 2*3 متر'
    ],
    price: 1875,
    originalPrice: 2499,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQW9wSO-dOjrZy3XLvrcSV558HdhDq843qae6aKAGWE4Lt5NoCiE8nG5hUt5gaMtOyqJipamcwHhsh1G48hcig8ZD6QSXyOP5ShGRWzcF-Tlsq1UDj0_OwGAhmPmWeWv7GgYZsYEFS_4vP-gLQ0UDiIoKyd_nhYcieuIYRWB5WzBrtucqeb5Yulbqa06PDZwWD1EIapNS2m2L_0Tq63-n2wuj2sEAttRQcmBYwOV1nY0y1F6NfLUnBD63tm4mAATVihO22kiveRsg',
    tagAr: 'الأكثر توفيراً'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sony Alpha 7 IV Cinema',
    nameAr: 'كاميرا سوني الفا Alpha a7 IV',
    category: 'cameras',
    categoryAr: 'معدات التصوير',
    price: 10499,
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7_wTMMnsxvvurdLd0_4sd47XvSoe_1Eq01LVd_STU4vPznlHJv_nBp4hW67zN8dTRfCO8jhECOnKmIkTZEOuQWi8WKKbY0UsG617yXYjkO2HuNmFXVJ_hv3HcbQWvYOvSvHiPlQXdcgXAiKPCZwmyX3lvX6BqfUMmXWrD-gL3A1REdLlbwag3v-hzQKQy5hUQ34b3TUxDFvWGGstbG2YAVoMkzxF9KUOL194bSKEvcY7oQPtWnPK7lUfORr5xX25Ud4f2Guachto',
    descriptionAr: 'الحل الأمثل لصناع الفيديو والسينمائيين المستقلين. بدقة 33 ميجابكسل وتصوير 4K عالي الجودة لنتائج مبهرة.',
    bulletsAr: [
      'مستشعر Exmor R CMOS متطور كامل الإطار 33 ميجابكسل',
      'تركيز تلقائي في الوقت الفعلي للعين (بشر، حيوانات، طيور)',
      'تسجيل فيديو 4K بمعدل 60 إطار بالثانية بدون تشويش',
      'مدخل صوت احترافي XLR ومثبت اهتزاز خماسي المحاور'
    ],
    specs: {
      'المستشعر': 'Full-frame (35.9 x 23.9 mm)',
      'دقة الفيديو': '4K UHD at 60p, 10-bit',
      'الربط': 'Wi-Fi, Bluetooth, USB-C PD',
      'الوزن': '658 جرام شامل البطارية'
    },
    isHot: true
  },
  {
    id: 'p2',
    name: 'Clakett Pro Gaming Chair',
    nameAr: 'كرسي كلاكيت برو المريح للقيمنق',
    category: 'accessories',
    categoryAr: 'مستلزمات قيمنق',
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 88,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVxc0gKkgYMFn2Psj1K-FsLwjIfjrfAgO1fTOCWuWSbOKKSUhxL4Iw4K9RneEsWzBJfWEiN0iAXnEEcSvs5TAxcnqQTmIbP52-F7Lygo_V30I5iF6Tsn0QSFRiLOLIONAyGzX0oU_YCECuh9lrvy_vtwXpj41b7bOuktKxHBzeNWAvpHLXRIn79wtnU5nTrMRsx94ftgqI8KQNmtvkyELxA2JpbY6-34cXJDqnDosQH5fqp84gaZohovvRHiEDutrVbkX7P84Bzs',
    descriptionAr: 'صُمم خصيصاً لجلسات التصوير الطويلة ومباريات القيمنق الحامية. يمنحك راحة ودعماً مثالياً لفقرات الظهر.',
    bulletsAr: [
      'إكسسوارات قماشية مخملية فاخرة تمنع التعرق التام',
      'مسند للقدمين مدمج ومساند يد رباعية الأبعاد قابلة للتعديل',
      'قاعدة فولاذية متينة تتحمل أوزاناً تصل لـ 150 كغم',
      'عجلات صامتة تمنع خدش الأرضيات الخشبية'
    ],
    specs: {
      'الخامة': 'قماش مخملي فائق التبريد',
      'التحمل': 'حتى 150 كجم',
      'زاوية الانحناء': '90 إلى 155 درجة',
      'الضمان': 'سنتين متكاملة'
    },
    isHot: true
  },
  {
    id: 'p3',
    name: 'Studio Light Softbox Kit',
    nameAr: 'مجموعة حقيبة إضاءة السوفت بوكس',
    category: 'lighting',
    categoryAr: 'معدات الإضاءة',
    price: 850,
    rating: 4.7,
    reviewsCount: 64,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVKpFkGQb08zYLFg6bCuB5EcsAS7dBfL3_n_P-8EYdCKVzzGCqRr9MVQQkHdNuQkihQigr6en2Khi4UQmLAqJYKQScRgi9ro-OMCQsQkNlKpvFcBHu2OpTWw6MTqIXanMh3-l_aT3Stka6pYHLUMOcYB8U3YQ6hCFC4C3_sQb_gWtl9CcdDtb1CXEZ710STDu-YGYsyWJbEluUJvPZgvTWhRRAWr24Wxr4zFdCfoYbBdO-_IYhLVL3hyr9qpZGBRfDtsLwLzhsGxI',
    descriptionAr: 'إضاءة مبهرة تمنع الظلال وتظهر ملامح وجهك بدقة سينمائية للتيك توك واليوتيوب وبثوث الألعاب.',
    bulletsAr: [
      'لمبة LED ذكية باستطاعة 85 واط وتحكم سحابي بالحرارة والسطوع',
      'عاكسات فضية مع غطاء خافض للخطوط يوفر إضاءة ناعمة وصافية',
      'حامل ثلاثي القوائم من الألمنيوم خفيف الوزن قابل للتعديل',
      'حقيبة تنقل فاخرة مضادة للمياه والخدوش لحماية الإضاءة'
    ],
    specs: {
      'السطوع': '850 لومن مع حرارة قابلة للتنقل',
      'درجة الحرارة': '3200K - 5600K',
      'الجهد الكهربائي': '110-240 فولت',
      'الارتفاع المقسم': 'من 70 سم حتى 200 سم'
    }
  },
  {
    id: 'p4',
    name: 'Elite Mechanical Keyboard',
    nameAr: 'كيبورد النخبة الميكانيكي الفاخر',
    category: 'accessories',
    categoryAr: 'مستلزمات قيمنق',
    price: 599,
    rating: 4.8,
    reviewsCount: 110,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj63nEkzSgIwkLPiUK3oncP7iN51lvVt8M5QU2cY5d9Fb6HQVhVf25kMiJR33OBVWy-_thXVkWzmvbP5pAJg-DujjcNv2qLsY9r_oC0m6HbSK45UY_YXKKXrvcHBkdRc8kIANDc5xoFIvJnHffV9C6J7Fe03M3zsKs2tehpkLsGinoGsnDUaiWayHayXkfJTZd-YvL83AXyrgo1EU9xttjdN10S0sCKSlxwlp1MNfLVWw5DqDTQk12ZA2IPcC_zLoSS9A_IOiPAhs',
    descriptionAr: 'استجابة فائقة السرعة مع نقرات صوتية ممتعة. كيبورد معدني يضمن لك السيطرة التامة على اللعب والإنتاج.',
    bulletsAr: [
      'سويتشات بنية صامتة مستجيبة للغاية للإنتاجية والقيمنق السريع',
      'إضاءة RGB ديناميكية مذهلة بأكثر من 18 نمطاً تفاعلياً',
      'هيكل معدني قوي مقاوم للارتطام واهتزازات الاستخدام',
      'أغطية أزرار مزودة بنظام نقش دوار مزدوج لا يزول بمرور السنوات'
    ],
    specs: {
      'نوع السويتشات': 'Brown Outemu Linear Switches',
      'الربط': 'لاسلكي/USB-C/إصدار بلوتوث 5.2',
      'البطارية': '4000 ميللي أمبير تدوم لشهر كامل',
      'حجم الهيكل': 'TKL تصميم مدمج 75٪'
    }
  },
  {
    id: 'p5',
    name: 'Studio Monitor Headphones',
    nameAr: 'سماعات احترافية لمراقبة الصوت',
    category: 'audio',
    categoryAr: 'معدات الصوت',
    price: 449,
    rating: 4.6,
    reviewsCount: 52,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqqK7Rlq6iuguEjdsG2LliBKgQhkNm_3PxR8bs2rWuJF2MIPV3sLSc-r2LiUqy-Z--IBbl2KOZWp98dvpG3DM75h0WXoBRUvS4uSLow3x4FX_95GE0uXtCWiZLX3Y5bfHvXpGr_n4B5JjWcfG_I2gdv0sWxNoUXXLVyWct5DspmplE94EVYZllsqJJgJKqwcbtbhINlc7eaof65OcUNjniGmsB3_zDxVAXZeywn7OXgp31rQCDJ7nuwiz9RhrUCc1RgoQS7NGQ7OQ',
    descriptionAr: 'سماعات مغلقة تسمع من خلالها أدق الترددات والمؤثرات دون أي تسريب في المايكروفون الخاص بك.',
    bulletsAr: [
      'محركات نيوديميوم كبيرة بقدرة 50 مم لترددات صوتية دقيقة',
      'عزل فيزيائي ممتاز يحيط بالأذن لمنع تسرب الصوت الخارجي',
      'وسادات قطيفة سميكة تسمح بتهوية جيدة لراحة أبدية',
      'كابل حلزوني قوي قابل للإزالة بطول يصل إلى 3 أمتار للحرية'
    ]
  },
  {
    id: 'p6',
    name: 'Elite Streaming Mic Kit',
    nameAr: 'طقم مايكروفون البث الاحترافي Elite',
    category: 'audio',
    categoryAr: 'معدات الصوت',
    price: 1299,
    rating: 4.95,
    reviewsCount: 198,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDvJGk-KbxQbDphBmcJAN5T0Yh-bfJYcgIN2zwFr1fNOuqF0TI-uNMya1YYuz7UjXubox97XeBXNuVFE6gTms0MegmesthU10dCu_-9sP1qvSmGNTdFKtyOFcxVXw5TmHSJmB97ZNl1mPjoxbsBaSQnagyQwN00Wq4su6t5azJ_kqyiNx_PbOFFLKm6oCb1J2pIz6ptq6LlVQRO2t_0VNgpGl7E9qot7ZfO1ZCJnZAWXBuiYdWZDRG4Z0ep4oGd2iet-raS4O0K_c',
    descriptionAr: 'سجّل ونقّ صوتك مباشرة مثل كبار المؤديين والستريمرز. جودة استوديو متكاملة بامتياز.',
    bulletsAr: [
      'كبسولة مايك قوية ثنائية الحجم لالتقاط تفاصيل صوتية دافئة ونقية',
      'بطاقة صوت مدمجة خافضة للضوضاء وبث USB-C سلس دون تعريفات تعقيد',
      'يتضمن بوب فلتر معدني شبكي فاخر لمنع فرقعة الحروف المزعجة',
      'حامل مكتبي ممتص للصدمات يمنع وصول حركات لوحة المفاتيح والاهتزازات'
    ],
    specs: {
      'الاستجابة الترددية': '20 Hz - 20,000 Hz',
      'النمط القطبي': 'كارديويد (Cardioid)',
      'معدل العينات': '192 kHz / 24-bit',
      'مخرج السماعات': '3.5 مم للمراقبة دون تأخير'
    },
    isHot: true
  },
  {
    id: 'p7',
    name: 'Cinematic Sound & LUT Bundle',
    nameAr: 'مجموعة السينما الشاملة: LUTs و Sound FX',
    category: 'digital',
    categoryAr: 'منتجات رقمية',
    price: 199,
    rating: 4.9,
    reviewsCount: 312,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZB5Ypi9C4iLYzIl895O0qzmyIGaBU4B8qimHVB1JuDOdu2BbpngsxqsSXqza5dLeZMpgdP92Ggd0Q2glsAEUQhQTS3Sxgx124NdHseNkppa49cC64rJjBeINVsUR_zScS_6-dDfXQsOZivOFF7K7EjTFV0PRzL59kALrDauAQFcddfDPBRHBKEmx3dy-IIJ7i7lwna4ejuBlspFYXP9aY8kh6E6f2hn-kly5YGc6tRBlsbLtfObwFWWPPZqKQpB-urmXuDnta7hU',
    descriptionAr: 'اختصر ساعات التعديل في المونتاج! احصل بلمسة واحدة على تلوين سينمائي واشتراك بمؤثرات صوتية هوليوودية مهيبة.',
    bulletsAr: [
      'أكثر من 35 فلاتر تلوين (LUTs) متوافقة مع Premiere, FCPX, Resolve',
      'مكتبة تضم 150+ ممثلاً من المؤثرات الصوتية عالية الدقة 4K Wav',
      'تحديثات مجانية مستمرة مدى الحياة تضمن لك البقاء في ريادة المحتوى',
      'ترخيص تجاري كامل لاستخدامها في إعلانات اليوتيوب وشاشات السينما'
    ]
  }
];

export const PLATFORMS = [
  { id: 'all', titleAr: 'الكل 🌐' },
  { id: 'youtube', titleAr: 'اليوتيوب 🎬' },
  { id: 'tiktok', titleAr: 'التيك توك 📱' },
  { id: 'twitch', titleAr: 'التويتش 🎮' }
];

export const BRANDS = ['Rode', 'Sony', 'Elgato', 'Logitech', 'Clakett', 'Sony Alpha'];
export const FILTER_CATEGORIES = [
  { id: 'cameras', titleAr: 'معدات تصوير' },
  { id: 'audio', titleAr: 'ميكروفونات وصوتيات' },
  { id: 'lighting', titleAr: 'إضاءة واستوديو' },
  { id: 'chroma', titleAr: 'كروما وخلفيات' },
  { id: 'digital', titleAr: 'منتجات رقمية وحزم' }
];

export const SOCIAL_ALERTS = [
  'اشترى ماجد من الرياض باقة الستريمر المتكاملة قبل دقيقتين 🎮',
  'قامت لمى من جدة بشراء "مجموعة السينما الشاملة LUTs" للتو ⚡',
  'سعيد من الدمام أضاف طقم المايك Elite Streaming لسلة الشراء 🎤',
  'اشترى فيصل من مكة كرسي كلاكيت الاحترافي قبل 5 دقائق 🎬',
  'طلب خالد من الظهران كاميرا سوني المتطورة مع شحن سريع 🚀'
];
