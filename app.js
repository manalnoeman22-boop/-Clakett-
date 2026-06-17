import { STORIES, BUNDLES, PRODUCTS, FILTER_CATEGORIES, BRANDS, SOCIAL_ALERTS } from './data-static.js';

// ==========================================
// 1. STATE MANAGEMENT
// ==========================================
const state = {
  activeView: 'explore',
  user: null,
  cartItems: JSON.parse(localStorage.getItem('clakett_cart')) || [],
  favorites: JSON.parse(localStorage.getItem('clakett_favs')) || [],
  activeStory: null,
  selectedDetailProduct: null,
  dupConfirmProduct: null,
  couponApplied: false,
  bundleChecked: { mic: true, light: true, arm: true, chroma: true },
  
  // Specific view states
  micProductState: {
    quantity: 1,
    addonArm: true,
    addonAcoustic: false,
    activeImg: PRODUCTS.find(p => p.id === 'p6').imageUrl,
    isPlayingVideo: false
  },
  digitalProductState: {
    isPlayingVideo: false,
    downloadStep: 'idle', // idle, paying, downloading, finished
    downloadProgress: 0
  },
  filters: {
    category: 'all',
    priceMax: 12000,
    search: '',
    rating: 0
  }
};

// ==========================================
// 2. SOCIAL PROOF LIVE INTERVAL
// ==========================================
function startSocialProofLoop() {
  const toastNode = document.getElementById('social-proof-toast');
  const msgNode = document.getElementById('social-proof-message');
  if (!toastNode || !msgNode) return;

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * SOCIAL_ALERTS.length);
    msgNode.textContent = SOCIAL_ALERTS[randomIndex];
    toastNode.classList.remove('hidden');
    
    // Hide after 6 seconds
    setTimeout(() => {
      toastNode.classList.add('hidden');
    }, 6000);
  }, 14000);
}

// ==========================================
// 3. CART OPERATIONS
// ==========================================
function syncCart() {
  localStorage.setItem('clakett_cart', JSON.stringify(state.cartItems));
  renderCartBadge();
  renderSideCartDrawer();
}

function renderCartBadge() {
  const badge = document.getElementById('cart-badge');
  const countSpan = document.getElementById('cart-drawer-count');
  if (!badge) return;

  const totalCount = state.cartItems.reduce((acc, current) => acc + current.quantity, 0);
  badge.textContent = totalCount;
  if (countSpan) countSpan.textContent = totalCount;

  // Tiny flash/bump animation when item is added
  badge.classList.add('scale-115', 'bg-red-500');
  setTimeout(() => {
    badge.classList.remove('scale-115', 'bg-red-500');
  }, 300);
}

function handleAddToCart(product, quantity = 1, addons = []) {
  // Check if identical item is already there
  const existing = state.cartItems.find(item => item.product.id === product.id);
  if (existing) {
    // Show confirmation duplicate alert
    state.dupConfirmProduct = { product, quantity, addons };
    const dupModal = document.getElementById('dup-modal-container');
    if (dupModal) dupModal.classList.remove('hidden');
  } else {
    // Direct add
    addCartItemDirectly(product, quantity, addons);
  }
}

function addCartItemDirectly(product, quantity = 1, addons = []) {
  // Clone product to avoid modifying static database
  const cartItem = {
    product: { ...product },
    quantity,
    addons: [...addons],
    addedTime: Date.now()
  };
  
  // Calculate specific price if addons checked (e.g., in Mic page)
  let extraPrice = 0;
  if (addons.includes('ذراع هيدروليكي معدني (+199 ر.س)')) extraPrice += 199;
  if (addons.includes('عازل هواء احترافي (+99 ر.س)')) extraPrice += 99;
  cartItem.product.price += extraPrice;

  state.cartItems.push(cartItem);
  syncCart();
  showToast(`🛒 تم إضافة "${product.nameAr}" في سلتك مسبقاً!`);
}

function removeCartItem(prodId) {
  state.cartItems = state.cartItems.filter(item => item.product.id !== prodId);
  syncCart();
  showToast('🗑️ تم استبعاد المنتج من السلة.');
}

function updateCartQuantity(prodId, amt) {
  const item = state.cartItems.find(i => i.product.id === prodId);
  if (item) {
    item.quantity += amt;
    if (item.quantity <= 0) {
      removeCartItem(prodId);
    } else {
      syncCart();
    }
  }
}

// ==========================================
// 4. PRETTY TOAST CENTER
// ==========================================
function showToast(msg) {
  const wrapper = document.getElementById('toast-toast-wrapper');
  if (!wrapper) return;

  const el = document.createElement('div');
  el.className = "bg-slate-900/95 border border-slate-800 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in pointer-events-auto text-xs font-semibold select-none";
  el.dir = "rtl";
  el.innerHTML = `
    <span class="text-amber-500">⚡</span>
    <span>${msg}</span>
  `;

  wrapper.appendChild(el);
  setTimeout(() => {
    el.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ==========================================
// 5. AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
function playSampleTone(freq, duration = 0.5) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Choose synth type based on frequency range
    osc.type = freq > 400 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Synth tone cannot be played due to security click bounds", err);
  }
}

// ==========================================
// 6. VIEW NAVIGATION IN SPA
// ==========================================
function setView(viewName) {
  state.activeView = viewName;
  
  // Highlight navigation controls
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('value') === viewName) {
      btn.className = "nav-tab px-4 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 bg-white text-slate-950 shadow-sm";
    } else {
      btn.className = "nav-tab px-4 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 text-slate-500 hover:text-slate-800";
    }
  });

  document.querySelectorAll('.mobile-nav-tab').forEach(btn => {
    if (btn.getAttribute('value') === viewName) {
      btn.className = "mobile-nav-tab shrink-0 px-3.5 py-1.5 text-[11px] font-black rounded-lg cursor-pointer transition-all flex items-center gap-1 bg-amber-500 text-slate-950 shadow-sm";
    } else {
      btn.className = "mobile-nav-tab shrink-0 px-3.5 py-1.5 text-[11px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1 text-slate-600 bg-slate-100 hover:bg-slate-200";
    }
  });

  // Render contents
  const mainNode = document.getElementById('main-content');
  if (!mainNode) return;

  // Add exit transition effect
  mainNode.classList.add('opacity-0', 'transition-opacity', 'duration-150');
  
  setTimeout(() => {
    if (viewName === 'explore') {
      renderExploreView(mainNode);
    } else if (viewName === 'mic-product') {
      renderMicProductView(mainNode);
    } else if (viewName === 'digital-product') {
      renderDigitalProductView(mainNode);
    } else if (viewName === 'filtering') {
      renderFilteringView(mainNode);
    }
    
    mainNode.classList.remove('opacity-0');
    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 150);
}

// ==========================================
// 7. EXPLORE VIEW RENDERING
// ==========================================
function renderExploreView(container) {
  // Re-calculate live bundle price
  const baseBundlePrice = BUNDLES[0].price; // 1875
  const origPrice = BUNDLES[0].originalPrice; // 2499
  const enabledCount = Object.values(state.bundleChecked).filter(Boolean).length;
  const bundlePrice = Math.round((baseBundlePrice / 4) * enabledCount);
  const bundleOrig = Math.round((origPrice / 4) * enabledCount);

  let storyHTML = STORIES.map(s => `
    <div class="story-bubble flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group" data-story-id="${s.id}">
      <div class="relative p-1 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-red-500 transition-transform duration-300 group-hover:scale-105">
        <div class="p-0.5 rounded-full bg-white">
          <img src="${s.imageUrl}" class="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover bg-slate-100" />
        </div>
        <span class="absolute bottom-0 left-0 bg-red-600 text-[8px] font-bold text-white uppercase px-1.5 rounded-full animate-bounce">Live</span>
      </div>
      <span class="text-[11px] font-extrabold text-slate-600 group-hover:text-amber-600 transition-colors">${s.title}</span>
    </div>
  `).join('');

  let sliderHTML = PRODUCTS.slice(0, 5).map(p => `
    <div class="w-[240px] sm:w-[280px] shrink-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group">
      <div class="relative aspect-[4/3] bg-slate-150 cursor-pointer overflow-hidden open-detail-trigger" data-prod-id="${p.id}">
        <img src="${p.imageUrl}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ${p.isHot ? '<span class="absolute top-3 right-3 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full">BESTSELLER</span>' : ''}
        <span class="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-800 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-slate-200">${p.categoryAr}</span>
      </div>
      <div class="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 hover:text-amber-600 transition-colors cursor-pointer line-clamp-1 open-detail-trigger" data-prod-id="${p.id}">${p.nameAr}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-1 min-h-[32px] font-medium leading-relaxed">${p.descriptionAr}</p>
        </div>
        <div class="flex items-center gap-1 text-[11px] text-amber-600">
          <span>★</span>
          <span class="font-extrabold">${p.rating}</span>
          <span class="text-slate-400">(${p.reviewsCount} تقييم)</span>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div class="text-xs sm:text-sm font-black text-slate-900">${p.price} ر.س</div>
          <button class="add-to-cart-trigger p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all active:scale-95 cursor-pointer" data-prod-id="${p.id}">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Hero Banner -->
    <section class="relative w-full h-[280px] sm:h-[400px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent z-10"></div>
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA66Q4udgwy3RdGhObhZALKHlL2aCGW8jvvJZijwrdqQk1gaoYd7EBXObeosovAdrj_sIK25wgwTEZn1VZ6AHXYoOFvqxXWaLngXOcy5EcJZMpJyDQFOg_bHzzL9TgZflWTUKINFtj4mCiII4MG7--S-PWHYS8c8nuQABYkstCk32SWyFX3t-y12YjMrC8h-EzI2tQnqWO1dtNTEFgdkX7tyHWqLso8MCk9Hyr2B-jdfVj6hOlxTteVomCix-EU-NQo1TIo81IfOOQ" 
           class="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div class="relative z-20 max-w-4xl px-4 text-center space-y-4 animate-scale-up">
        <span class="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-black font-sans">
          تجهيزات البث الاحترافي وحزم المونتاج والمؤثرات الصوتية
        </span>
        <h1 class="text-xl sm:text-3.5xl font-black text-slate-950 leading-snug">
          جهّز استوديوهات الإبداع والقيمنق <br class="hidden sm:inline" /> بلمسة <span class="text-amber-500">احترافية مريحة</span>
        </h1>
        <p class="text-[11px] sm:text-xs text-slate-500 max-w-lg mx-auto leading-relaxed font-semibold">
          تسوق أرقى ميكروفونات البث، حقائب الإضاءة، وحزم الفلاتر السينمائية مع شحن سريع وتوصيل آمن وباقات تفاعلية مذهلة.
        </p>
        <div class="flex flex-wrap justify-center gap-3 pt-1">
          <button id="hero-explore-btn" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-xs transition-all shadow-md cursor-pointer">
            استكشف المتجر ومعدات الدبدبة
          </button>
        </div>
      </div>
    </section>

    <!-- Circle Row Stories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-30 w-full">
      <div class="flex items-center gap-4 overflow-x-auto py-3.5 custom-scrollbar justify-start sm:justify-center">
        ${storyHTML}
      </div>
    </section>

    <!-- Bundle customizer / شيل شيلتك ووفر 25% -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-scale-up w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-9 shadow-xs">
        
        <div class="col-span-1 lg:col-span-5 space-y-4">
          <div class="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/20 text-amber-800 rounded-full px-3 py-0.5 text-[10px] font-black">
            <i data-lucide="sparkles" class="w-3 h-3"></i>
            <span>وفر ٢٥٪ فوراً بالتجميع الحر</span>
          </div>
          <h2 class="text-xl sm:text-3xl font-black text-slate-950 leading-snug">
            شيل شيلتك ووفر 25% مع <br /> <span class="text-amber-500">باقة صانع المحتوى المتكاملة</span>
          </h2>
          <p class="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-semibold">
            قمنا بتوفير باقة ممتازة لإنشاء وبدء تشغيل استوديو اليوتيوب والتصوير. قم باستبعاد المكونات التي لا ترغب بها ليحسب السعر المخفض فورا!
          </p>

          <ul class="space-y-2 text-[11px] font-bold text-slate-600">
            <li class="flex items-center gap-2">
              <i data-lucide="shield-check" class="text-green-600 w-4 h-4"></i>
              <span>شحن سريع متميز لباب المنزل خلال ٤٨ ساعة</span>
            </li>
            <li class="flex items-center gap-2">
              <i data-lucide="shield-check" class="text-green-600 w-4 h-4"></i>
              <span>ضمان سنتين أصلي وشحن سريع لجميع دول الخليج</span>
            </li>
          </ul>

          <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-4 items-baseline justify-between">
            <div>
              <span class="text-[10px] text-slate-400 ml-1">الحساب النهائي:</span>
              <span class="text-xl sm:text-2xl font-black text-slate-950 font-semibold">${bundlePrice} ر.س</span>
              ${enabledCount > 0 ? `<span class="text-xs line-through text-slate-400 mr-2">${bundleOrig} ر.س</span>` : ''}
            </div>
            <button id="btn-add-bundle-custom" ${enabledCount === 0 ? 'disabled' : ''} class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              <span>أضف الباقة للسلة 🛒</span>
            </button>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">تفصيل الباقة:</h3>
            <div class="space-y-3 font-semibold">
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer select-none">
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="bundle-chk-mic" ${state.bundleChecked.mic ? 'checked' : ''} class="accent-amber-500 w-4 h-4" />
                  <span class="text-xs text-slate-800">طقم مايكروفون Elite المصفى</span>
                </div>
                <span class="text-xs text-slate-500 font-mono">625 ر.س</span>
              </label>
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer select-none">
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="bundle-chk-light" ${state.bundleChecked.light ? 'checked' : ''} class="accent-amber-500 w-4 h-4" />
                  <span class="text-xs text-slate-800">سوفت بوكس إضاءة ال- LED</span>
                </div>
                <span class="text-xs text-slate-500 font-mono">425 ر.س</span>
              </label>
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer select-none">
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="bundle-chk-arm" ${state.bundleChecked.arm ? 'checked' : ''} class="accent-amber-500 w-4 h-4" />
                  <span class="text-xs text-slate-800">ذراع هيدروليكية كلاكيت برو</span>
                </div>
                <span class="text-xs text-slate-500 font-mono">425 ر.س</span>
              </label>
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer select-none">
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="bundle-chk-chroma" ${state.bundleChecked.chroma ? 'checked' : ''} class="accent-amber-500 w-4 h-4" />
                  <span class="text-xs text-slate-800">كروما خضراء خلفية مضادة للمياه</span>
                </div>
                <span class="text-xs text-slate-500 font-mono">400 ر.س</span>
              </label>
            </div>
          </div>

          <div class="relative rounded-2xl overflow-hidden border border-slate-100 aspect-video sm:aspect-auto">
            <img src="${BUNDLES[0].imageUrl}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-black bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-md">
              <span class="text-slate-800 leading-none">توصيل سريع مجاني 📦</span>
              <span class="text-amber-600 leading-none">خلال ٤٨ ساعة فقط</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- "الأكثر طلبًا" Slider -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 w-full">
      <div class="flex items-end justify-between">
        <div>
          <span class="text-[9px] text-amber-700 uppercase font-bold tracking-widest font-mono">سيت أب النخبة</span>
          <h2 class="text-lg sm:text-2.5xl font-black text-slate-955">المعدات الأكثر طلباً هذا الأسبوع 🔥</h2>
        </div>
        <button id="explore-see-all-btn" class="text-xs text-amber-600 hover:text-amber-700 font-extrabold flex items-center gap-1 hover:underline transition-all cursor-pointer">
          <span>شاهد الكل</span>
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="flex gap-6 overflow-x-auto pb-4 pt-1 custom-scrollbar snap-x">
        ${sliderHTML}
      </div>
    </section>

    <!-- Bento Grid Categories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div class="bento-category-card relative h-[180px] sm:h-[220px] rounded-3xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-xs group transition-all" data-target-view="filtering">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIJOMsBEj8KPtcmLly5aUkekFpa3w9IDzyAYqHPRT5NMuWBbnv_fpkze12IWT_Nbc_p4RUj00ywHqMfMr7MNB9qoXuisr6x79_hG8G8kiSxuT56NRnw-XPmc5yIj8GgTQlK9RshQMmW_gVYF07UA43p_QU3_rrzlK-Zzu71AknYDm_uNY7aguNc4vximNlMMcX7C_yIW9GSGMmI6Y7ipdYQBIiwJkUbfEPX-Ntf8R2H7MgrGmM8pOkHaJs_eqdshm4nQGYVwsRVGE" 
             class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-5 left-5 right-5 text-white space-y-1">
          <h3 class="text-base sm:text-lg font-black text-white">📸 كاميرات ومعدات تصوير</h3>
          <p class="text-[10px] text-slate-200 font-medium">عدسات احترافية تدعم 4k للتصوير البصري والسينمائي الأرقى</p>
        </div>
      </div>

      <div class="bento-category-card relative h-[180px] sm:h-[220px] rounded-3xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-xs group transition-all" data-target-view="mic-product">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1nAir5XBYfoH346kgPHgv3-vaioerCJcYUCOu0JWFQVudQ38d4PGr5W-vkdke9faMuoQ1tdd1jtBovBxSxzW8AobhssGRUR1qnQYVI5haIC_S_lI06hsPSwVbnd-hC9sCqZG6kON3FCoIS3bNJfDLbJ6aPP1f7A_h7Ga76UHhoUbIb6zE6y-YJwUJB1K-JkNIYMYfnv0JnnukqG2Ss7_h_Y_y-ZYGWahOrkpf7Ay5XO_XmxYQIvXBqMjOjZS6__mRmsdlkDpwWDM" 
             class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-5 left-5 right-5 text-white space-y-1">
          <h3 class="text-base sm:text-lg font-black text-white">🎤 ميكروفونات وبث رقمي</h3>
          <p class="text-[10px] text-slate-200 font-medium">أجود بطاقات الصوت والمايكروفونات المكثفة للتسجيل النقي المريح</p>
        </div>
      </div>

      <div class="bento-category-card relative h-[180px] sm:h-[220px] rounded-3xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-xs group transition-all" data-target-view="digital-product">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDykGxtpRkIn5reZNucWEs16zez2frnIs8py9uXb0WsaQo2RT2YtcL-fl5-3qhdeWVCgaEXxG5JcNki_pLsNKRU1YqZmy_Wu-1DEfTtD2iBFJ7lEDA_zomjRGqdThoqTeKaWo5U3cfX6bJ__KXiwJo1RnWMFQw5qaxYmH6t2bPDZ-OGUJ5Sua6SVTs5UMQiP_6sjJ_L7d6ayPKgW7oQfQaILImoIjUZ6D4xXMttBjA3LW-0oiiqrpqfh2Tr9d8fGZjflgNJqsbQmIE" 
             class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-5 left-5 right-5 text-white space-y-1">
          <h3 class="text-base sm:text-lg font-black text-white">⚡ حزم رقمية ومؤثرات صوتية</h3>
          <p class="text-[10px] text-slate-200 font-medium">لتحرير فوري بأكواد ألوان LUTs ومؤثرات أفلام ممتازة ومباشرة</p>
        </div>
      </div>
    </section>

    <!-- Highlight Story Preview Modal -->
    <div id="story-modal-container" class="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md" id="story-modal-close-backdrop"></div>
      <div id="story-modal-content" class="relative w-full max-w-sm bg-[#0c0f16] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 animate-scale-up">
        <!-- Injected on trigger -->
      </div>
    </div>
  `;

  // Bind Explore listeners
  document.getElementById('hero-explore-btn').addEventListener('click', () => setView('filtering'));
  document.getElementById('explore-see-all-btn').addEventListener('click', () => setView('filtering'));
  
  // Story clicking
  document.querySelectorAll('.story-bubble').forEach(node => {
    node.addEventListener('click', () => {
      const id = node.getAttribute('data-story-id');
      const story = STORIES.find(s => s.id === id);
      openStoryModal(story);
    });
  });

  // Bundle checkboxes
  document.getElementById('bundle-chk-mic').addEventListener('change', (e) => {
    state.bundleChecked.mic = e.target.checked;
    renderExploreView(container);
    lucide.createIcons();
  });
  document.getElementById('bundle-chk-light').addEventListener('change', (e) => {
    state.bundleChecked.light = e.target.checked;
    renderExploreView(container);
    lucide.createIcons();
  });
  document.getElementById('bundle-chk-arm').addEventListener('change', (e) => {
    state.bundleChecked.arm = e.target.checked;
    renderExploreView(container);
    lucide.createIcons();
  });
  document.getElementById('bundle-chk-chroma').addEventListener('change', (e) => {
    state.bundleChecked.chroma = e.target.checked;
    renderExploreView(container);
    lucide.createIcons();
  });

  // Bundle add-to-cart
  const addBtn = document.getElementById('btn-add-bundle-custom');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const p = BUNDLES[0];
      const customBundleProduct = {
        id: 'bundle-pack-discount',
        nameAr: p.nameAr,
        categoryAr: 'سيت أب متكامل',
        price: bundlePrice,
        rating: 5,
        reviewsCount: 221,
        imageUrl: p.imageUrl,
        descriptionAr: p.descriptionAr
      };
      handleAddToCart(customBundleProduct, 1, []);
    });
  }

  // Silders detail click
  document.querySelectorAll('.open-detail-trigger').forEach(node => {
    node.addEventListener('click', () => {
      const id = node.getAttribute('data-prod-id');
      const prod = PRODUCTS.find(p => p.id === id);
      openProductDetailModal(prod);
    });
  });

  // Slider Add to cart click
  document.querySelectorAll('.add-to-cart-trigger').forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = node.getAttribute('data-prod-id');
      const prod = PRODUCTS.find(p => p.id === id);
      handleAddToCart(prod);
    });
  });

  // Bento Navigation
  document.querySelectorAll('.bento-category-card').forEach(node => {
    node.addEventListener('click', () => {
      const target = node.getAttribute('data-target-view');
      setView(target);
    });
  });
}

function openStoryModal(story) {
  const container = document.getElementById('story-modal-container');
  const inner = document.getElementById('story-modal-content');
  if (!container || !inner) return;

  inner.innerHTML = `
    <div class="relative aspect-[3/4] bg-gray-950">
      <img src="${story.mediaUrl}" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0e111d] via-black/10 to-transparent"></div>
      
      <!-- Close row -->
      <div class="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
        <div class="flex items-center gap-2">
          <div class="p-0.5 rounded-full bg-amber-500">
            <img src="${story.imageUrl}" class="h-8 w-8 rounded-full object-cover bg-gray-900" />
          </div>
          <span class="text-xs font-bold font-mono text-white leading-none">${story.title}</span>
        </div>
        <button id="btn-story-modal-close" class="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white transition-all cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Action row -->
      <div class="absolute bottom-6 left-6 right-6 text-white space-y-3">
        <span class="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-500 text-[9px] font-black px-2 py-0.5 rounded-full">نصائح كلاكيت للمبدعين 💡</span>
        <p class="text-xs text-slate-200 leading-relaxed font-semibold">${story.desc}</p>
        <button id="btn-story-shop" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-1 transition-all cursor-pointer">
          <span>تسوق المنتجات الآن 🛒</span>
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  container.classList.remove('hidden');
  lucide.createIcons();

  document.getElementById('btn-story-modal-close').addEventListener('click', closeStoryModal);
  document.getElementById('story-modal-close-backdrop').addEventListener('click', closeStoryModal);
  document.getElementById('btn-story-shop').addEventListener('click', () => {
    closeStoryModal();
    setView('filtering');
  });
}

function closeStoryModal() {
  const container = document.getElementById('story-modal-container');
  if (container) container.classList.add('hidden');
}

// ==========================================
// 8. MIC ELITE VIEW RENDERING
// ==========================================
function renderMicProductView(container) {
  const p6 = PRODUCTS.find(p => p.id === 'p6');
  
  // Calculate pricing based on options
  let calculatedPrice = p6.price;
  let summaryAddons = [];
  if (state.micProductState.addonArm) {
    calculatedPrice += 199;
    summaryAddons.push('ذراع هيدروليكي معدني (+199 ر.س)');
  }
  if (state.micProductState.addonAcoustic) {
    calculatedPrice += 99;
    summaryAddons.push('عازل هواء احترافي (+99 ر.س)');
  }
  const multiplyTotal = calculatedPrice * state.micProductState.quantity;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full animate-scale-up" dir="rtl">
      
      <!-- Back Link -->
      <div class="mb-6">
        <button id="btn-mic-back" class="text-xs font-bold text-slate-400 hover:text-amber-600 flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span>العودة للرئيسية</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left: Gallery Media -->
        <div class="col-span-1 lg:col-span-6 space-y-4">
          <div class="relative border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-slate-950 aspect-square flex items-center justify-center">
            
            ${state.micProductState.isPlayingVideo ? `
              <video id="p6-video-node" src="https://assets.mixkit.co/videos/preview/mixkit-microphone-on-a-stand-in-a-music-studio-41701-large.mp4" class="w-full h-full object-cover" controls autoplay loop></video>
            ` : `
              <img src="${state.micProductState.activeImg}" class="w-full h-full object-cover" />
            `}

            <!-- Shoppers warning -->
            <div class="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] items-center gap-1.5 flex border border-slate-800 pointer-events-none">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-extrabold text-emerald-400">٢٤ مبدع</span>
              <span class="text-xs font-semibold text-slate-300">يتصفحون هذا المنتج الآن!</span>
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-3">
            <button class="thumb-mic-img rounded-2xl overflow-hidden border-2 cursor-pointer aspect-square ${!state.micProductState.isPlayingVideo && state.micProductState.activeImg === p6.imageUrl ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'}" data-img="${p6.imageUrl}">
              <img src="${p6.imageUrl}" class="w-full h-full object-cover" />
            </button>
            <button class="thumb-mic-img rounded-2xl overflow-hidden border-2 cursor-pointer aspect-square ${!state.micProductState.isPlayingVideo && state.micProductState.activeImg === 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf_camcIiiWI7z-2pP-zUzAvNucsckTWjADT79z2b2s6FnBBkRYzRCozWE1w7epv9V5tviO12JCaJZTTYke7-TqwWJ8Doec8K62aozbByLZsiXIHyJz1JMqUETbIehRO2ZIjM4qRGhK6muXSP5sXZdCTE9bIH3QZBJVh_eYHENyz22U8kopfkT-Npj437eakFh9LRqqsLcQYz-4NBRq-KHQv1Byxw9V61jebq6s4k4MEtM65Fyd1ZCD4GG_4a_ANC3JiBkjk1WY5g' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'}" data-img="https://lh3.googleusercontent.com/aida-public/AB6AXuCf_camcIiiWI7z-2pP-zUzAvNucsckTWjADT79z2b2s6FnBBkRYzRCozWE1w7epv9V5tviO12JCaJZTTYke7-TqwWJ8Doec8K62aozbByLZsiXIHyJz1JMqUETbIehRO2ZIjM4qRGhK6muXSP5sXZdCTE9bIH3QZBJVh_eYHENyz22U8kopfkT-Npj437eakFh9LRqqsLcQYz-4NBRq-KHQv1Byxw9V61jebq6s4k4MEtM65Fyd1ZCD4GG_4a_ANC3JiBkjk1WY5g">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf_camcIiiWI7z-2pP-zUzAvNucsckTWjADT79z2b2s6FnBBkRYzRCozWE1w7epv9V5tviO12JCaJZTTYke7-TqwWJ8Doec8K62aozbByLZsiXIHyJz1JMqUETbIehRO2ZIjM4qRGhK6muXSP5sXZdCTE9bIH3QZBJVh_eYHENyz22U8kopfkT-Npj437eakFh9LRqqsLcQYz-4NBRq-KHQv1Byxw9V61jebq6s4k4MEtM65Fyd1ZCD4GG_4a_ANC3JiBkjk1WY5g" class="w-full h-full object-cover" />
            </button>
            <button class="thumb-mic-img rounded-2xl overflow-hidden border-2 cursor-pointer aspect-square ${!state.micProductState.isPlayingVideo && state.micProductState.activeImg === 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVxc0gKkgYMFn2Psj1K-FsLwjIfjrfAgO1fTOCWuWSbOKKSUhxL4Iw4K9RneEsWzBJfWEiN0iAXnEEcSvs5TAxcnqQTmIbP52-F7Lygo_V30I5iF6Tsn0QSFRiLOLIONAyGzX0oU_YCECuh9lrvy_vtwXpj41b7bOuktKxHBzeNWAvpHLXRIn79wtnU5nTrMRsx94ftgqI8KQNmtvkyELxA2JpbY6-34cXJDqnDosQH5fqp84gaZohovvRHiEDutrVbkX7P84Bzs' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'}" data-img="https://lh3.googleusercontent.com/aida-public/AB6AXuCfVxc0gKkgYMFn2Psj1K-FsLwjIfjrfAgO1fTOCWuWSbOKKSUhxL4Iw4K9RneEsWzBJfWEiN0iAXnEEcSvs5TAxcnqQTmIbP52-F7Lygo_V30I5iF6Tsn0QSFRiLOLIONAyGzX0oU_YCECuh9lrvy_vtwXpj41b7bOuktKxHBzeNWAvpHLXRIn79wtnU5nTrMRsx94ftgqI8KQNmtvkyELxA2JpbY6-34cXJDqnDosQH5fqp84gaZohovvRHiEDutrVbkX7P84Bzs">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfVxc0gKkgYMFn2Psj1K-FsLwjIfjrfAgO1fTOCWuWSbOKKSUhxL4Iw4K9RneEsWzBJfWEiN0iAXnEEcSvs5TAxcnqQTmIbP52-F7Lygo_V30I5iF6Tsn0QSFRiLOLIONAyGzX0oU_YCECuh9lrvy_vtwXpj41b7bOuktKxHBzeNWAvpHLXRIn79wtnU5nTrMRsx94ftgqI8KQNmtvkyELxA2JpbY6-34cXJDqnDosQH5fqp84gaZohovvRHiEDutrVbkX7P84Bzs" class="w-full h-full object-cover" />
            </button>
            <button id="mic-video-toggle-btn" class="rounded-2xl overflow-hidden border-2 cursor-pointer aspect-square ${state.micProductState.isPlayingVideo ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'} bg-slate-900 text-white flex flex-col justify-center items-center gap-1">
              <i data-lucide="video" class="w-5 h-5 text-amber-500"></i>
              <span class="text-[9px] font-black">فيديو حقيقي 🎥</span>
            </button>
          </div>
        </div>

        <!-- Right: Information -->
        <div class="col-span-1 lg:col-span-6 space-y-6">
          <div class="space-y-2">
            <span class="inline-block bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-amber-800 text-[10px] font-black font-sans">
              سلسلة استوديو برو الاحترافية
            </span>
            <h1 class="text-xl sm:text-2.5xl font-black text-slate-950">${p6.nameAr}</h1>
            <p class="text-xs text-slate-405 font-mono">${p6.name}</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex text-amber-500 text-sm">★★★★★</div>
            <span class="text-xs font-bold text-slate-700 font-sans">4.95 (١٩٨ تقييم معتمد)</span>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
            ${p6.descriptionAr}
          </p>

          <!-- Accessories Checkbox Option Blocks -->
          <div class="space-y-3 bg-white border border-slate-250 p-5 rounded-2xl shadow-inner font-semibold">
            <h3 class="text-xs font-black text-slate-800 mb-2">🏷️ تخصيص الإكسسوارات والعلاوات الملحقة:</h3>
            
            <label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="mic-addon-arm" ${state.micProductState.addonArm ? 'checked' : ''} class="accent-amber-500 w-4 h-4 cursor-pointer" />
                <div>
                  <h4 class="text-xs text-slate-900 font-extrabold">ذراع هيدروليكي كلاكيت معدني صامت</h4>
                  <p class="text-[9px] text-slate-400">ذراع عريض هيدروليكي للمهام الدقيقة</p>
                </div>
              </div>
              <span class="text-xs font-mono text-slate-500">+199 ر.س</span>
            </label>

            <label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="mic-addon-foam" ${state.micProductState.addonAcoustic ? 'checked' : ''} class="accent-amber-500 w-4 h-4 cursor-pointer" />
                <div>
                  <h4 class="text-xs text-slate-900 font-extrabold">بوب فلتر وعازل هواء مخملي كلاكيت</h4>
                  <p class="text-[9px] text-slate-400">عازل هواء متعدد الطبقات لحسم تصفية النفس</p>
                </div>
              </div>
              <span class="text-xs font-mono text-slate-500">+99 ر.س</span>
            </label>
          </div>

          <!-- Quantity selection and pricing calculation -->
          <div class="border-t border-slate-250/70 pt-5 space-y-4">
            
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-extrabold text-slate-600">كمية الطلب:</h3>
              <div class="flex items-center border border-slate-250 rounded-xl bg-white overflow-hidden shadow-xs">
                <button id="btn-mic-qty-minus" class="px-3 py-1 bg-slate-50 hover:bg-slate-105 hover:text-red-650 cursor-pointer font-bold text-sm">-</button>
                <span class="px-4 py-1 text-xs font-black text-slate-900" id="mic-qty-val">${state.micProductState.quantity}</span>
                <button id="btn-mic-qty-plus" class="px-3 py-1 bg-slate-50 hover:bg-slate-105 hover:text-emerald-650 cursor-pointer font-bold text-sm">+</button>
              </div>
            </div>

            <!-- Total display and Order Trigger -->
            <div class="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span class="text-[10px] text-slate-400 font-bold block">إجمالي القيمة:</span>
                <span class="text-xl sm:text-2.5xl font-black text-slate-950 font-semibold" id="mic-price-calc-val">${multiplyTotal} ر.س</span>
              </div>
              <button id="btn-mic-add-cart" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
                <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                <span>أضف للسلة الآن 🛒</span>
              </button>
            </div>
            
          </div>

        </div>

      </div>

    </div>
  `;

  // Listeners
  document.getElementById('btn-mic-back').addEventListener('click', () => setView('explore'));
  
  // Thumbnails select
  document.querySelectorAll('.thumb-mic-img').forEach(node => {
    node.addEventListener('click', () => {
      const img = node.getAttribute('data-img');
      state.micProductState.activeImg = img;
      state.micProductState.isPlayingVideo = false;
      renderMicProductView(container);
      lucide.createIcons();
    });
  });

  // Video Toggle
  document.getElementById('mic-video-toggle-btn').addEventListener('click', () => {
    state.micProductState.isPlayingVideo = true;
    renderMicProductView(container);
    lucide.createIcons();
  });

  // Addons Checks
  document.getElementById('mic-addon-arm').addEventListener('change', (e) => {
    state.micProductState.addonArm = e.target.checked;
    renderMicProductView(container);
    lucide.createIcons();
  });
  document.getElementById('mic-addon-foam').addEventListener('change', (e) => {
    state.micProductState.addonAcoustic = e.target.checked;
    renderMicProductView(container);
    lucide.createIcons();
  });

  // Quantities
  document.getElementById('btn-mic-qty-plus').addEventListener('click', () => {
    state.micProductState.quantity += 1;
    renderMicProductView(container);
    lucide.createIcons();
  });
  document.getElementById('btn-mic-qty-minus').addEventListener('click', () => {
    if (state.micProductState.quantity > 1) {
      state.micProductState.quantity -= 1;
      renderMicProductView(container);
      lucide.createIcons();
    }
  });

  // Add to cart
  document.getElementById('btn-mic-add-cart').addEventListener('click', () => {
    handleAddToCart(p6, state.micProductState.quantity, summaryAddons);
  });
}

// ==========================================
// 9. DIGITAL PRODUCT VIEW RENDERING
// ==========================================
function renderDigitalProductView(container) {
  const p7 = PRODUCTS.find(p => p.id === 'p7');

  let synthHTML = `
    <div class="space-y-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-inner font-semibold">
      <h3 class="text-xs font-black text-slate-800 mb-2">🎙️ استمع فورياً لعينات من المؤثرات الصوتية (سنتيزر مباشرة):</h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <button class="play-synth-btn bg-slate-50 hover:bg-amber-50 border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-slate-800 transition-colors cursor-pointer text-right" data-freq="220" data-note="الرعب السينمائي">
          <span class="font-extrabold flex items-center gap-1.5"><i data-lucide="play-circle" class="w-4 h-4 text-amber-500"></i> Cinematic Drop</span>
          <span class="text-[10px] text-slate-400 font-mono">Basstone 220Hz</span>
        </button>
        <button class="play-synth-btn bg-slate-50 hover:bg-amber-50 border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-slate-800 transition-colors cursor-pointer text-right" data-freq="440" data-note="موجة صوت الكلاكيت">
          <span class="font-extrabold flex items-center gap-1.5"><i data-lucide="play-circle" class="w-4 h-4 text-amber-500"></i> Studio Tone</span>
          <span class="text-[10px] text-slate-400 font-mono">Sine 440Hz</span>
        </button>
        <button class="play-synth-btn bg-slate-50 hover:bg-amber-50 border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-slate-800 transition-colors cursor-pointer text-right" data-freq="880" data-note="المؤثر الحماسي">
          <span class="font-extrabold flex items-center gap-1.5"><i data-lucide="play-circle" class="w-4 h-4 text-amber-500"></i> Digital Whoosh</span>
          <span class="text-[10px] text-slate-400 font-mono">Triangle 880Hz</span>
        </button>
        <button class="play-synth-btn bg-slate-50 hover:bg-amber-50 border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-slate-800 transition-colors cursor-pointer text-right" data-freq="110" data-note="الضربة العميقة">
          <span class="font-extrabold flex items-center gap-1.5"><i data-lucide="play-circle" class="w-4 h-4 text-amber-500"></i> Deep Impact</span>
          <span class="text-[10px] text-slate-400 font-mono">Moog 110Hz</span>
        </button>
      </div>
    </div>
  `;

  let downloadHTML = '';
  if (state.digitalProductState.downloadStep === 'paying') {
    downloadHTML = `
      <div class="bg-amber-550/5 border border-amber-500/20 p-5 rounded-2xl text-center space-y-3">
        <div class="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
        <p class="text-xs font-bold text-amber-900">جاري التحقق من ترخيص الدفع السريع الموفر...</p>
      </div>
    `;
  } else if (state.digitalProductState.downloadStep === 'downloading') {
    downloadHTML = `
      <div class="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-3">
        <h4 class="text-xs font-black text-rose-500">● جاري توليد وتحميل حزمة LUTs والـ Sound FX الفورية المجمعة</h4>
        <div class="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full transition-all duration-100" style="width: ${state.digitalProductState.downloadProgress}%"></div>
        </div>
        <p class="text-[10px] font-mono text-slate-400">برجاء عدم إغلاق الصفحة - تم تحميل ${state.digitalProductState.downloadProgress}%</p>
      </div>
    `;
  } else if (state.digitalProductState.downloadStep === 'finished') {
    downloadHTML = `
      <div class="bg-emerald-50 border border-emerald-250 p-5 rounded-2xl text-center space-y-2 text-slate-800">
        <span class="text-2xl">🎉</span>
        <h4 class="text-xs font-black text-emerald-700">اكتمل التوليد وتحميل الحزمة بنجاح تام!</h4>
        <p class="text-[11px] font-bold text-slate-550">قم بالتفقد المباشر لملفات الكمبيوتر أو التنزيلات. تم إرفاق ترخيص الاستخدام السينمائي الـ WAV.</p>
        <button id="btn-reset-download" class="mt-2 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] rounded-lg">إعادة التحميل 🔄</button>
      </div>
    `;
  } else {
    downloadHTML = `
      <div class="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 class="text-xs font-black text-amber-500">🚀 تحميل الحزمة الرقمية الفورية بالبطاقة المباشرة</h4>
          <p class="text-[10px] text-slate-400 leading-relaxed font-semibold">قم بالدخول كعضو تجريبي لتشغيل رابط التحميل المباشر فوراً واختصار أي معاملات مالية للتظاهر!</p>
        </div>
        <button id="btn-trigger-download" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
          تحميل الحزمة فوراً ⚡
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full animate-scale-up" dir="rtl">
      
      <!-- Back Link -->
      <div class="mb-6">
        <button id="btn-digi-back" class="text-xs font-bold text-slate-400 hover:text-amber-600 flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span>العودة للرئيسية</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left: Image & Video Slider -->
        <div class="col-span-1 lg:col-span-6 space-y-4">
          <div class="relative border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-slate-950 aspect-square flex items-center justify-center">
            
            ${state.digitalProductState.isPlayingVideo ? `
              <video id="p7-video-node" src="https://assets.mixkit.co/videos/preview/mixkit-hand-holding-smartphone-taking-photos-of-an-ice-42353-large.mp4" class="w-full h-full object-cover" controls autoplay loop></video>
            ` : `
              <img src="${p7.imageUrl}" class="w-full h-full object-cover" />
            `}

            <!-- Feature Tag -->
            <div class="absolute top-4 right-4 bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-full text-white text-[10px] flex items-center gap-1.5 border border-slate-800">
              <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
              <span class="font-extrabold text-white">ترخيص تجاري دائم مدى الحياة</span>
            </div>
          </div>

          <!-- Slider triggers -->
          <div class="grid grid-cols-2 gap-3">
            <button id="digi-img-trigger" class="py-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${!state.digitalProductState.isPlayingVideo ? 'border-amber-500 bg-amber-50/20 text-slate-800' : 'border-slate-200 text-slate-500 bg-white'}" >
              <i data-lucide="image" class="w-4 h-4"></i>
              <span>صورة الغلاف الرائعة</span>
            </button>
            <button id="digi-vid-trigger" class="py-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${state.digitalProductState.isPlayingVideo ? 'border-amber-500 bg-amber-50/20 text-slate-800' : 'border-slate-200 text-slate-500 bg-white'}" >
              <i data-lucide="film" class="w-4 h-4 text-amber-500"></i>
              <span>عرض تلوين السينما 🎥</span>
            </button>
          </div>
        </div>

        <!-- Right: Audio lists -->
        <div class="col-span-1 lg:col-span-6 space-y-6">
          <div class="space-y-2">
            <span class="inline-block bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-amber-800 text-[10px] font-black font-sans">
              حزم رقمية مذهلة سريعة التنصيب
            </span>
            <h1 class="text-xl sm:text-2.5xl font-black text-slate-950">${p7.nameAr}</h1>
            <p class="text-xs text-slate-405 font-mono">${p7.name}</p>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
            ${p7.descriptionAr}
          </p>

          <!-- Audio preview row block -->
          ${synthHTML}

          <!-- Download simulators widgets -->
          ${downloadHTML}

          <!-- Cart block -->
          <div class="border-t border-slate-150 pt-5 flex items-center justify-between font-bold">
            <div>
              <span class="text-[10px] text-slate-400 block pb-0.5">الحساب الأساسي:</span>
              <span class="text-xl sm:text-2xl font-black text-slate-950">${p7.price} ر.س</span>
            </div>
            <button id="btn-digi-add-cart" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer">
               أضف الحزمة الرقمية للسلة 🛒
            </button>
          </div>

        </div>

      </div>

    </div>
  `;

  // Bind Listeners
  document.getElementById('btn-digi-back').addEventListener('click', () => setView('explore'));
  
  // Image swap
  document.getElementById('digi-img-trigger').addEventListener('click', () => {
    state.digitalProductState.isPlayingVideo = false;
    renderDigitalProductView(container);
    lucide.createIcons();
  });

  // Video swap
  document.getElementById('digi-vid-trigger').addEventListener('click', () => {
    state.digitalProductState.isPlayingVideo = true;
    renderDigitalProductView(container);
    lucide.createIcons();
  });

  // Synth Buttons
  document.querySelectorAll('.play-synth-btn').forEach(node => {
    node.addEventListener('click', () => {
      const freq = parseFloat(node.getAttribute('data-freq'));
      const note = node.getAttribute('data-note');
      playSampleTone(freq, 0.6);
      showToast(`🔊 تم تفعيل نوتة: ${note}`);
    });
  });

  // Trigger Download Simulation
  const triggerDL = document.getElementById('btn-trigger-download');
  if (triggerDL) {
    triggerDL.addEventListener('click', () => {
      // Step 1: paying
      state.digitalProductState.downloadStep = 'paying';
      renderDigitalProductView(container);
      lucide.createIcons();

      setTimeout(() => {
        // Step 2: downloading progress
        state.digitalProductState.downloadStep = 'downloading';
        state.digitalProductState.downloadProgress = 0;
        renderDigitalProductView(container);
        lucide.createIcons();

        const dlInterval = setInterval(() => {
          state.digitalProductState.downloadProgress += 15;
          if (state.digitalProductState.downloadProgress >= 100) {
            state.digitalProductState.downloadProgress = 100;
            state.digitalProductState.downloadStep = 'finished';
            clearInterval(dlInterval);
            renderDigitalProductView(container);
            lucide.createIcons();
          } else {
            const pb = container.querySelector('.bg-amber-500');
            const pr = container.querySelector('.font-mono');
            if (pb) pb.style.width = `${state.digitalProductState.downloadProgress}%`;
            if (pr) pr.textContent = `برجاء عدم إغلاق الصفحة - تم تحميل ${state.digitalProductState.downloadProgress}%`;
          }
        }, 400);

      }, 2000);
    });
  }

  // Reset Download
  const resetBtn = document.getElementById('btn-reset-download');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.digitalProductState.downloadStep = 'idle';
      state.digitalProductState.downloadProgress = 0;
      renderDigitalProductView(container);
      lucide.createIcons();
    });
  }

  // Add to cart digital
  document.getElementById('btn-digi-add-cart').addEventListener('click', () => {
    handleAddToCart(p7);
  });
}

// ==========================================
// 10. FILTERING VIEW RENDERING (STORE)
// ==========================================
function renderFilteringView(container) {
  // Filter core products
  const filtered = PRODUCTS.filter(p => {
    // category check
    if (state.filters.category !== 'all' && p.category !== state.filters.category) return false;
    // price check
    if (p.price > state.filters.priceMax) return false;
    // search check
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inAr = p.nameAr.toLowerCase().includes(q);
      const inDesc = p.descriptionAr.toLowerCase().includes(q);
      if (!inName && !inAr && !inDesc) return false;
    }
    // rating check
    if (p.rating < state.filters.rating) return false;

    return true;
  });

  // Categories html
  let catBtns = FILTER_CATEGORIES.map(cat => {
    const active = state.filters.category === cat.id;
    return `
      <button class="filter-cat-badge px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${active ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}" data-cat-id="${cat.id}">
        ${cat.titleAr}
      </button>
    `;
  }).join('');

  // Sorter cards grid
  let gridHTML = '';
  if (filtered.length === 0) {
    gridHTML = `
      <div class="col-span-full py-16 text-center space-y-3 bg-white border border-slate-200 rounded-3xl p-8">
        <span class="text-3xl">🔍</span>
        <h3 class="text-base font-black text-slate-850">لا يوجد منتجات تطابق خيارات الفلترة الحالية</h3>
        <p class="text-xs text-slate-450 font-medium">جرّب رفع الحد الأقصى للسعر أو تعديل عبارة البحث لتظهر لك نتائج مناسبة.</p>
        <button id="btn-reset-filters" class="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-black rounded-xl">إعادة تصفير خيارات البحث 🔄</button>
      </div>
    `;
  } else {
    gridHTML = filtered.map(p => {
      const isFav = state.favorites.includes(p.id);
      return `
        <div class="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
          
          <div class="relative aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden open-detail-trigger" data-prod-id="${p.id}">
            <img src="${p.imageUrl}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            ${p.isHot ? '<span class="absolute top-3 right-3 bg-red-650 text-white font-black text-[9px] px-2 py-0.5 rounded-full">BESTSELLER</span>' : ''}
            
            <span class="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-800 font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-slate-200">${p.categoryAr}</span>
            
            <!-- Favorite button -->
            <button class="fav-trigger absolute top-3 left-3 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-600 transition-colors" data-prod-id="${p.id}">
              <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}"></i>
            </button>
          </div>

          <div class="p-5 flex flex-col justify-between flex-grow space-y-3">
            <div>
              <h4 class="text-sm font-extrabold text-slate-900 hover:text-amber-600 transition-colors open-detail-trigger line-clamp-1" data-prod-id="${p.id}">${p.nameAr}</h4>
              <p class="text-xs text-slate-405 font-medium line-clamp-2 mt-1 min-h-[36px] leading-relaxed">${p.descriptionAr}</p>
            </div>

            <div class="flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
              <span>★</span>
              <span>${p.rating}</span>
              <span class="text-slate-400">(${p.reviewsCount} تقييم معتمد)</span>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between font-bold">
              <span class="text-sm font-black text-slate-900">${p.price} ر.س</span>
              <button class="add-to-cart-trigger px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-slate-950 text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer" data-prod-id="${p.id}">
                <i data-lucide="shopping-cart" class="w-4.5 h-4.5"></i>
                <span>أضف للسلة</span>
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full animate-scale-up" dir="rtl">
      
      <!-- Top header layout -->
      <div class="space-y-2 mb-8">
        <h1 class="text-xl sm:text-2.5xl font-black text-slate-950">حقيبة المتجر والفلترة الحرة 🌐</h1>
        <p class="text-xs text-slate-500 font-semibold font-sans">تصفح معدات الصوت، الإضاءة، وحزم العزل والتلوين السينمائي بأسعار منافسة.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar filters panel -->
        <div class="col-span-1 lg:col-span-3 bg-white border border-slate-200 p-5 rounded-3xl space-y-6">
          
          <!-- Search box -->
          <div class="space-y-2">
            <h4 class="text-xs font-black text-slate-700">🔍 ابحث بالاسم أو المحتوى:</h4>
            <input type="text" id="filter-search-input" value="${state.filters.search}" placeholder="كاميرا، مايك، لمبة LED..." class="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-right focus:outline-none focus:border-amber-500 leading-none placeholder:text-slate-400" />
          </div>

          <!-- Price range slider -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs font-black">
              <span class="text-slate-700">💰 الحد الأقصى للسعر:</span>
              <span class="text-amber-600 font-mono">${state.filters.priceMax} ر.س</span>
            </div>
            <input type="range" id="filter-price-slider" min="150" max="12000" step="50" value="${state.filters.priceMax}" class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            <div class="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
              <span>١٥٠ ر.س</span>
              <span>١٢,٠٠٠ ر.س</span>
            </div>
          </div>

          <!-- Rating selector slider -->
          <div class="space-y-2 flex flex-col font-bold text-xs">
            <h4 class="text-xs font-black text-slate-700">⭐ التقييم الأدنى من النجوم:</h4>
            <select id="filter-rating-select" class="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="0" ${state.filters.rating === 0 ? 'selected' : ''}>الكل (بما في ذلك التقييمات البسيطة)</option>
              <option value="4.6" ${state.filters.rating === 4.6 ? 'selected' : ''}>من 4.6 نجمة وأكثر ⭐</option>
              <option value="4.8" ${state.filters.rating === 4.8 ? 'selected' : ''}>من 4.8 نجمة وأكثر ⭐⭐</option>
              <option value="4.9" ${state.filters.rating === 4.9 ? 'selected' : ''}>من 4.9 نجمة وأكثر ⭐⭐⭐</option>
            </select>
          </div>

        </div>

        <!-- Main Product Grid Container -->
        <div class="col-span-1 lg:col-span-9 space-y-6">
          
          <!-- View category badges row in store -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
            ${catBtns}
          </div>

          <!-- Sorted Products grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            ${gridHTML}
          </div>

        </div>

      </div>

    </div>
  `;

  // Bind Listeners
  const searchInput = document.getElementById('filter-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      renderFilteringView(container);
      lucide.createIcons();
      // Keep focus
      document.getElementById('filter-search-input').focus();
    });
  }

  const priceSlider = document.getElementById('filter-price-slider');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.filters.priceMax = parseInt(e.target.value);
      renderFilteringView(container);
      lucide.createIcons();
    });
  }

  const ratingSelect = document.getElementById('filter-rating-select');
  if (ratingSelect) {
    ratingSelect.addEventListener('change', (e) => {
      state.filters.rating = parseFloat(e.target.value);
      renderFilteringView(container);
      lucide.createIcons();
    });
  }

  // Category selection badges
  document.querySelectorAll('.filter-cat-badge').forEach(node => {
    node.addEventListener('click', () => {
      const catId = node.getAttribute('data-cat-id');
      state.filters.category = catId;
      renderFilteringView(container);
      lucide.createIcons();
    });
  });

  // Reset Filters click
  const rstFlt = document.getElementById('btn-reset-filters');
  if (rstFlt) {
    rstFlt.addEventListener('click', () => {
      state.filters = { category: 'all', priceMax: 12000, search: '', rating: 0 };
      renderFilteringView(container);
      lucide.createIcons();
    });
  }

  // Details triggered click
  document.querySelectorAll('.open-detail-trigger').forEach(node => {
    node.addEventListener('click', () => {
      const id = node.getAttribute('data-prod-id');
      const prod = PRODUCTS.find(p => p.id === id);
      openProductDetailModal(prod);
    });
  });

  // Cart Add click
  document.querySelectorAll('.add-to-cart-trigger').forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = node.getAttribute('data-prod-id');
      const prod = PRODUCTS.find(p => p.id === id);
      handleAddToCart(prod);
    });
  });

  // Favorite button clicked inside store
  document.querySelectorAll('.fav-trigger').forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = node.getAttribute('data-prod-id');
      handleToggleFavorite(id);
    });
  });
}

function handleToggleFavorite(prodId) {
  const index = state.favorites.indexOf(prodId);
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast('🤍 تم استبعاد المنتج من قائمتك المفضلة.');
  } else {
    state.favorites.push(prodId);
    showToast('❤️ تم إضافة المنتج لمفضلتك الشخصية!');
  }
  localStorage.setItem('clakett_favs', JSON.stringify(state.favorites));
  if (state.activeView === 'filtering') {
    renderFilteringView(document.getElementById('main-content'));
    lucide.createIcons();
  }
}

// ==========================================
// 11. DYNAMIC DETAILS MODAL RENDERING
// ==========================================
function openProductDetailModal(product) {
  const modal = document.getElementById('detail-modal-container');
  if (!modal) return;
  state.selectedDetailProduct = product;

  // Render modal layout
  let bulletsHTML = (product.bulletsAr || []).map(b => `
    <li class="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-550 shrink-0 mt-2"></span>
      <span>${b}</span>
    </li>
  `).join('');

  // Specs HTML
  let specsHTML = '';
  if (product.specs) {
    specsHTML = Object.entries(product.specs).map(([key, val]) => `
      <div class="flex items-center justify-between py-2 border-b border-slate-100 text-xs font-semibold">
        <span class="text-slate-400">${key}:</span>
        <span class="text-slate-800 font-extrabold">${val}</span>
      </div>
    `).join('');
  } else {
    specsHTML = `<p class="text-xs text-slate-400 font-semibold py-4 text-center">لا توجد مواصفات فنية إضافية لهذا المنتج.</p>`;
  }

  // Reviews list HTML
  let revsHTML = (product.reviews || []).map(r => `
    <div class="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 text-xs">
      <div class="flex items-center justify-between font-bold">
        <span class="text-slate-800 font-black">${r.name}</span>
        <span class="text-amber-500 font-serif">${'★'.repeat(r.stars)}</span>
      </div>
      <p class="text-[11px] text-slate-500 font-semibold leading-relaxed">${r.comment}</p>
    </div>
  `).join('');

  if (!product.reviews || product.reviews.length === 0) {
    revsHTML = `<p class="reviews-empty-message text-xs text-slate-400 font-semibold py-4 text-center">لا توجد تقييمات مسبقة. كن أول من يكتب تقييماً معتمداً! ✍️</p>`;
  }

  modal.innerHTML = `
    <div class="absolute inset-0 cursor-pointer" id="detail-modal-close-backdrop"></div>
    <div class="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 animate-scale-up z-10 text-slate-850 flex flex-col md:flex-row gap-6">
      
      <!-- Close button -->
      <button id="btn-detail-modal-close" class="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Left aspect image -->
      <div class="w-full md:w-5/12 aspect-square md:aspect-auto md:h-64/ rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
        <img src="${product.imageUrl}" class="w-full h-full object-cover" />
      </div>

      <!-- Right information details -->
      <div class="w-full md:w-7/12 flex flex-col justify-between space-y-4">
        
        <div class="space-y-2">
          <span class="inline-block bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-800 text-[9px] font-black">${product.categoryAr}</span>
          <h2 class="text-base sm:text-lg font-black text-slate-950">${product.nameAr}</h2>
          <p class="text-xs text-slate-500 font-semibold leading-relaxed">${product.descriptionAr}</p>
        </div>

        <!-- Custom specifications sliding tabs wrapper -->
        <div class="border-t border-b border-slate-150 py-3 space-y-3">
          
          <div class="flex border-b border-slate-100">
            <button id="tab-btn-bullets" class="active-subtab pb-2 px-3 text-xs font-black text-amber-600 border-b-2 border-amber-500">المزايا العامة</button>
            <button id="tab-btn-specs" class="pb-2 px-3 text-xs font-bold text-slate-400 hover:text-slate-700">المواصفات الفنية</button>
            <button id="tab-btn-reviews" class="pb-2 px-3 text-xs font-bold text-slate-400 hover:text-slate-700">التعليقات والتقييمات (${product.reviews ? product.reviews.length : 0})</button>
          </div>

          <!-- Tab Content Views -->
          <div id="subtab-content-panel" class="max-h-40 overflow-y-auto custom-scrollbar">
            <!-- Render bullets lists by default -->
            <ul class="space-y-1.5">${bulletsHTML}</ul>
          </div>

        </div>

        <!-- Bottom add buttons -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <span class="text-[9px] text-slate-405 font-semibold block">سعر الحساب الفوري:</span>
            <span class="text-base sm:text-lg font-black text-slate-900">${product.price} ر.س</span>
          </div>
          <button id="btn-modal-add-cart" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            <span>أضف للسلة الآن</span>
          </button>
        </div>

      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();

  // Modal Closers
  document.getElementById('btn-detail-modal-close').addEventListener('click', closeProductDetailModal);
  document.getElementById('detail-modal-close-backdrop').addEventListener('click', closeProductDetailModal);

  // Modal Add Core Cart
  document.getElementById('btn-modal-add-cart').addEventListener('click', () => {
    handleAddToCart(product);
    closeProductDetailModal();
  });

  // Tab buttons bindings
  const contentNode = document.getElementById('subtab-content-panel');
  
  const bBtn = document.getElementById('tab-btn-bullets');
  const sBtn = document.getElementById('tab-btn-specs');
  const rBtn = document.getElementById('tab-btn-reviews');

  function resetModalTabs() {
    [bBtn, sBtn, rBtn].forEach(b => {
      b.className = "pb-2 px-3 text-xs font-bold text-slate-400 hover:text-slate-700";
    });
  }

  bBtn.addEventListener('click', () => {
    resetModalTabs();
    bBtn.className = "pb-2 px-3 text-xs font-black text-amber-600 border-b-2 border-amber-500";
    contentNode.innerHTML = `<ul class="space-y-1.5">${bulletsHTML}</ul>`;
  });

  sBtn.addEventListener('click', () => {
    resetModalTabs();
    sBtn.className = "pb-2 px-3 text-xs font-black text-amber-600 border-b-2 border-amber-500";
    contentNode.innerHTML = `<div class="space-y-1">${specsHTML}</div>`;
  });

  rBtn.addEventListener('click', () => {
    resetModalTabs();
    rBtn.className = "pb-2 px-3 text-xs font-black text-amber-600 border-b-2 border-amber-500";
    
    // Review panels + adding form
    contentNode.innerHTML = `
      <div class="space-y-4">
        
        <!-- Reviews list -->
        <div class="space-y-2.5" id="modal-reviews-list-wrapper">
          ${revsHTML}
        </div>

        <!-- Add reviews form -->
        <form id="write-review-form" class="p-3 border border-slate-150 rounded-2xl space-y-2.5 bg-slate-50">
          <h4 class="text-xs font-black text-slate-700">✍️ أضف تقييمك الشخصي:</h4>
          
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="rev-form-name" placeholder="الاسم الكامل" class="bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none" required />
            
            <select id="rev-form-stars" class="bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              <option value="5">★★★★★ (ممتاز جداً)</option>
              <option value="4">★★★★☆ (جيد جداً)</option>
              <option value="3">★★★☆☆ (عادي/متوسط)</option>
              <option value="2">★★☆☆☆ (سيء بعض الشيء)</option>
            </select>
          </div>

          <textarea id="rev-form-comment" placeholder="رأيك الصادق بخصوص تجربة وخدمة صوت هذا المنتج..." class="w-full bg-white border border-slate-205 rounded-lg p-2 text-xs focus:outline-none text-right" rows="2" required></textarea>
          
          <div class="text-left">
            <button type="submit" class="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] rounded-lg shadow cursor-pointer">إرسال التقييم المعتمد</button>
          </div>
        </form>

      </div>
    `;

    // Bind dynamic reviews form submit inside details modal view!
    const rForm = document.getElementById('write-review-form');
    rForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inName = document.getElementById('rev-form-name').value;
      const inStars = parseInt(document.getElementById('rev-form-stars').value);
      const inComment = document.getElementById('rev-form-comment').value;

      if (!product.reviews) product.reviews = [];
      const newReview = { name: inName, stars: inStars, comment: inComment };
      product.reviews.push(newReview);
      
      // Re-calculate ratings variables
      product.reviewsCount = (product.reviewsCount || 0) + 1;
      showToast('✍️ شكراً على مشاركتك تقييمك الصادق! تم اعتماده مباشرة.');
      
      // Update reviews tab view on details modal live!
      rBtn.click();
    });
  });
}

function closeProductDetailModal() {
  const modal = document.getElementById('detail-modal-container');
  if (modal) modal.classList.add('hidden');
  state.selectedDetailProduct = null;
}

// ==========================================
// 12. SIDEBAR OVERLAY CART DRAWER RENDERING
// ==========================================
function renderSideCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  if (!container) return;

  if (state.cartItems.length === 0) {
    container.innerHTML = `
      <div class="py-20 text-center space-y-3.5 select-none text-slate-400">
        <i data-lucide="shopping-bag" class="h-10 w-10 text-slate-300 mx-auto animate-bounce-slow"></i>
        <h3 class="text-xs font-black text-slate-500">سلة مشترياتك خاوية الآن</h3>
        <p class="text-[10px] text-slate-400 font-medium">ابدأ الآن بتصفح المتجر وإضافة أرقى معدات كلاكيت في سلتك الموفرة.</p>
        <button id="btn-cart-drawer-start" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-wrap text-xs font-black rounded-xl">استكشف المتجر 🛒</button>
      </div>
    `;
    lucide.createIcons();

    const startBtn = document.getElementById('btn-cart-drawer-start');
    if (startBtn) startBtn.addEventListener('click', () => {
      toggleCart();
      setView('filtering');
    });

    updateCartPricingSummary(0);
    return;
  }

  // List Items
  let itemsHTML = state.cartItems.map(item => {
    let addonsText = '';
    if (item.addons && item.addons.length > 0) {
      addonsText = `<p class="text-[9px] text-amber-600 font-extrabold pb-1">مضاف: ${item.addons.join(', ')}</p>`;
    }

    return `
      <div class="flex gap-4 items-center bg-white border border-slate-200 rounded-2xl p-3 shadow-inner relative group">
        
        <!-- Image product -->
        <img src="${item.product.imageUrl}" class="w-14 h-14 rounded-xl object-cover bg-slate-50" />

        <!-- Info details -->
        <div class="flex-grow min-w-0">
          <h4 class="text-xs font-black text-slate-900 truncate leading-snug">${item.product.nameAr}</h4>
          ${addonsText}
          <div class="text-[10px] font-black font-semibold text-slate-500">${item.product.price} ر.س <span class="text-slate-400 font-medium">لكل وحدة</span></div>
        </div>

        <!-- Quantity adjusters -->
        <div class="flex flex-col items-center gap-1 shrink-0">
          <div class="flex items-center border border-slate-205 rounded-lg overflow-hidden bg-white">
            <button class="cart-item-qty-btn px-2.5 py-0.5 text-xs font-bold leading-none bg-slate-50 hover:bg-slate-100" data-prod-id="${item.product.id}" data-amt="-1">-</button>
            <span class="px-2 text-xs font-black text-slate-800 font-serif">${item.quantity}</span>
            <button class="cart-item-qty-btn px-2.5 py-0.5 text-xs font-bold leading-none bg-slate-50 hover:bg-slate-100" data-prod-id="${item.product.id}" data-amt="1">+</button>
          </div>
          <button class="cart-item-remove-btn text-[9px] font-bold text-red-500 hover:underline hover:text-red-700 cursor-pointer pt-0.5" data-prod-id="${item.product.id}">
            إزالة 🗑️
          </button>
        </div>

      </div>
    `;
  }).join('');

  container.innerHTML = itemsHTML;
  lucide.createIcons();

  // Quantities adjusters click bind
  container.querySelectorAll('.cart-item-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prod-id');
      const amt = parseInt(btn.getAttribute('data-amt'));
      updateCartQuantity(id, amt);
    });
  });

  // Remove elements click bind
  container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prod-id');
      removeCartItem(id);
    });
  });

  // Calculations subtotal
  const subtotal = state.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  updateCartPricingSummary(subtotal);
}

function updateCartPricingSummary(subtotal) {
  const subTotalNode = document.getElementById('cart-subtotal');
  const indNode = document.getElementById('discount-indicator');
  const amtNode = document.getElementById('cart-discount-amount');
  const totalNode = document.getElementById('cart-total');

  if (!subTotalNode || !totalNode) return;

  subTotalNode.textContent = `${subtotal} ر.س`;

  // Apply discounts logic
  let discountValue = 0;
  if (state.couponApplied || state.user) {
    discountValue = Math.round(subtotal * 0.1); // 10%
    if (indNode) indNode.classList.remove('hidden');
    if (amtNode) amtNode.textContent = `-${discountValue} ر.س`;
  } else {
    if (indNode) indNode.classList.add('hidden');
  }

  const calculatedTotal = subtotal - discountValue;
  totalNode.textContent = `${calculatedTotal} ر.س`;
}

function toggleCart() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const drawer = document.getElementById('cart-drawer');
  if (!backdrop || !drawer) return;

  const isOpen = backdrop.classList.contains('pointer-events-auto');
  if (isOpen) {
    // slideout close
    backdrop.classList.replace('opacity-100', 'opacity-0');
    backdrop.classList.replace('pointer-events-auto', 'pointer-events-none');
    drawer.classList.add('-translate-x-full');
  } else {
    // slidein open
    backdrop.classList.replace('opacity-0', 'opacity-100');
    backdrop.classList.replace('pointer-events-none', 'pointer-events-auto');
    drawer.classList.remove('-translate-x-full');
    renderSideCartDrawer();
  }
}

// ==========================================
// 13. LOGIN FLOW & USER CARD ACTIONS
// ==========================================
function updateProfileWidget() {
  const widget = document.getElementById('user-profile-widget');
  if (!widget) return;

  if (state.user) {
    widget.innerHTML = `
      <div class="flex items-center gap-2 border border-slate-200 bg-slate-50 py-1 px-2.5 rounded-xl text-xs font-semibold select-none shadow-inner">
        <img src="${state.user.photoURL}" class="h-6 w-6 rounded-lg object-cover ring-2 ring-amber-500/10" />
        <span class="text-slate-800 font-extrabold hidden sm:inline truncate max-w-[80px]">${state.user.displayName}</span>
        <button id="btn-app-logout" class="text-rose-500 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center justify-center p-0.5" title="تسجيل الخروج">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
    lucide.createIcons();
    document.getElementById('btn-app-logout').addEventListener('click', handleLogoutFlow);
  } else {
    widget.innerHTML = `
      <button id="btn-trigger-login-modal" class="px-3.5 py-2 hover:bg-slate-50 text-slate-700 border border-slate-200 bg-white shadow-xs rounded-xl font-extrabold text-xs flex items-center gap-1 transition-colors cursor-pointer select-none">
        <i data-lucide="user" class="w-3.5 h-3.5"></i>
        <span>تسجيل الدخول</span>
      </button>
    `;
    lucide.createIcons();
    document.getElementById('btn-trigger-login-modal').addEventListener('click', () => {
      const modal = document.getElementById('auth-modal-container');
      if (modal) modal.classList.remove('hidden');
    });
  }
  
  // Recalculate cart since discounts shift when user changes
  if (state.cartItems.length > 0) renderSideCartDrawer();
}

function handleLoginFlowDemo() {
  state.user = {
    displayName: 'عضو تجريبي 🚀',
    photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf_camcIiiWI7z-2pP-zUzAvNucsckTWjADT79z2b2s6FnBBkRYzRCozWE1w7epv9V5tviO12JCaJZTTYke7-TqwWJ8Doec8K62aozbByLZsiXIHyJz1JMqUETbIehRO2ZIjM4qRGhK6muXSP5sXZdCTE9bIH3QZBJVh_eYHENyz22U8kopfkT-Npj437eakFh9LRqqsLcQYz-4NBRq-KHQv1Byxw9V61jebq6s4k4MEtM65Fyd1ZCD4GG_4a_ANC3JiBkjk1WY5g'
  };
  localStorage.setItem('clakett_user', JSON.stringify(state.user));
  updateProfileWidget();
  showToast('🎉 أهلاً بك! تم الدخول كعضو تجريبي. تم تفعيل خصم الـ ١٠٪ تلقائيا!');
  closeAuthModal();
}

function handleLogoutFlow() {
  state.user = null;
  localStorage.removeItem('clakett_user');
  updateProfileWidget();
  showToast('🚪 تم تسجيل الخروج بنجاح.');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-container');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 14. INITIATE ENTIRE STATIC APPLET ON LOAD
// ==========================================
function init() {
  // Sync user state from storage
  const savedUser = localStorage.getItem('clakett_user');
  if (savedUser) state.user = JSON.parse(savedUser);

  // Set initial view
  setView('explore');
  updateProfileWidget();
  renderCartBadge();
  startSocialProofLoop();

  // BIND DRAWER TRIGGERS
  document.getElementById('btn-toggle-cart').addEventListener('click', toggleCart);
  document.getElementById('btn-close-cart').addEventListener('click', toggleCart);
  document.getElementById('cart-drawer-backdrop').addEventListener('click', toggleCart);

  // HEADER LINK LOGO TRIGGERS TITLE
  document.getElementById('header-logo-btn').addEventListener('click', () => setView('explore'));

  // NAVIGATION TAB BUTTONS BINDINGS
  document.getElementById('btn-tab-explore').addEventListener('click', () => setView('explore'));
  document.getElementById('btn-tab-mic').addEventListener('click', () => setView('mic-product'));
  document.getElementById('btn-tab-digital').addEventListener('click', () => setView('digital-product'));
  document.getElementById('btn-tab-filtering').addEventListener('click', () => setView('filtering'));

  document.getElementById('m-tab-explore').addEventListener('click', () => setView('explore'));
  document.getElementById('m-tab-mic').addEventListener('click', () => setView('mic-product'));
  document.getElementById('m-tab-digital').addEventListener('click', () => setView('digital-product'));
  document.getElementById('m-tab-filtering').addEventListener('click', () => setView('filtering'));

  // PROMO COUPON APPLICATION
  document.getElementById('btn-apply-coupon').addEventListener('click', () => {
    const inp = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-success-msg');
    if (!inp) return;
    const value = inp.value.trim().toUpperCase();
    
    if (value === 'CLAKETT10') {
      state.couponApplied = true;
      if (msg) msg.classList.remove('hidden');
      if (state.cartItems.length > 0) renderSideCartDrawer();
      showToast('🎉 مبارك! طبق كود الخصم ١٠٪ على مجموع الحساب!');
    } else {
      showToast('⚠️ كود الخصم غير المعترف به. جرب كود الفضاء CLAKETT10.');
    }
  });

  // DUPLICATE CONFIRMATION BUTTONS BINDINGS
  document.getElementById('btn-dup-cancel').addEventListener('click', () => {
    document.getElementById('dup-modal-container').classList.add('hidden');
    state.dupConfirmProduct = null;
  });

  document.getElementById('btn-dup-confirm').addEventListener('click', () => {
    document.getElementById('dup-modal-container').classList.add('hidden');
    if (state.dupConfirmProduct) {
      const { product, quantity, addons } = state.dupConfirmProduct;
      
      const inItems = state.cartItems.find(item => item.product.id === product.id);
      if (inItems) {
        // Multiply count
        inItems.quantity += quantity;
        syncCart();
        showToast(`⚡ تم تكرار ومضاعفة "${product.nameAr}" في سلتك بنجاح!`);
      }
      state.dupConfirmProduct = null;
    }
  });
  document.getElementById('dup-close-backdrop').addEventListener('click', () => {
    document.getElementById('dup-modal-container').classList.add('hidden');
    state.dupConfirmProduct = null;
  });

  // MEMBERS AUTH MODAL TRIGGERS
  document.getElementById('btn-auth-demo').addEventListener('click', handleLoginFlowDemo);
  document.getElementById('btn-auth-google').addEventListener('click', handleLoginFlowDemo); // Simple proxy to ease demo login
  document.getElementById('btn-close-auth').addEventListener('click', closeAuthModal);
  document.getElementById('btn-close-auth-backdrop').addEventListener('click', closeAuthModal);

  // NEWSLETTER FOOT SUBMIT
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = document.getElementById('newsletter-email');
    const success = document.getElementById('newsletter-success');
    if (inp && inp.value) {
      if (success) success.classList.remove('hidden');
      setTimeout(() => {
        if (success) success.classList.add('hidden');
        inp.value = '';
      }, 4000);
      showToast('🎉 شكراً لاشتراكك بنشرتنا الإخبارية للمبدعين!');
    }
  });

  // FULL CHECKOUT TRANSACTION INTERACTION
  document.getElementById('btn-checkout-sim').addEventListener('click', () => {
    if (state.cartItems.length === 0) {
      showToast('⚠️ سلتك خالية! يرجى إضافة منتج واحد على الأقل قبل المتابعة لإجراء الدفع.');
      return;
    }
    
    const wrapper = document.getElementById('checkout-modal-container');
    const ldr = document.getElementById('checkout-loader');
    const succ = document.getElementById('checkout-success');

    if (!wrapper || !ldr || !succ) return;

    // Show wrapper with loader
    ldr.classList.remove('hidden');
    succ.classList.add('hidden');
    wrapper.classList.remove('hidden');

    setTimeout(() => {
      // Transition to success state
      ldr.classList.add('hidden');
      succ.classList.remove('hidden');
      playSampleTone(400, 0.4); // Sweet chime synthesis tone
      
      // Flush cart completely
      state.cartItems = [];
      syncCart();
    }, 2800);
  });

  document.getElementById('btn-checkout-success-close').addEventListener('click', () => {
    document.getElementById('checkout-modal-container').classList.add('hidden');
  });
}

// Fire init when document is loaded
window.addEventListener('DOMContentLoaded', init);
