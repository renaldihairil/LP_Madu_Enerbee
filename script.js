/* =============================================
   ENERBEE — Premium JS
============================================= */

// Real, measured header height (topbar + navbar) so layout never depends
// on guessed pixel offsets — recalculated whenever the topbar wraps to a
// second line (small phones) or the viewport is resized.
function updateHeaderHeights() {
  const topbar = document.getElementById('topbar');
  const navbar = document.getElementById('navbar');
  if (!topbar || !navbar) return;
  document.documentElement.style.setProperty('--topbar-h', `${topbar.offsetHeight}px`);
  document.documentElement.style.setProperty('--navbar-h', `${navbar.offsetHeight}px`);
}

// AOS (Animate On Scroll)
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// Countdown Timer (Ends at midnight today)
function startCountdown() {
  const hEl = document.getElementById('cdH');
  const mEl = document.getElementById('cdM');
  const sEl = document.getElementById('cdS');

  if (!hEl || !mEl || !sEl) return;

  function update() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diff = endOfDay - now;

    if (diff <= 0) {
      hEl.innerText = "00"; mEl.innerText = "00"; sEl.innerText = "00";
      return;
    }

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    hEl.innerText = h.toString().padStart(2, '0');
    mEl.innerText = m.toString().padStart(2, '0');
    sEl.innerText = s.toString().padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Scarcity / Slots logic
function initSlots() {
  let slots = 20; // Initial promo slots
  const slotsLeftEl = document.getElementById('slotsLeft');
  const stockNumEl = document.getElementById('stockNum');
  const stockBar = document.getElementById('stockBar');

  function updateDOM() {
    if(slotsLeftEl) slotsLeftEl.innerText = slots;
    if(stockNumEl) stockNumEl.innerText = slots;
    if(stockBar) stockBar.style.width = `${(slots/20) * 100}%`;
  }

  updateDOM();

  // Decrease randomly every 8-15 seconds for demo purposes
  const interval = setInterval(() => {
    if (slots > 3) {
      slots -= 1;
      updateDOM();
    } else {
      clearInterval(interval);
    }
  }, Math.floor(Math.random() * 7000) + 8000);
}

// Social Proof Toast
function initSocialProof() {
  const toast = document.getElementById('spToast');
  if(!toast) return;

  const avatar = document.getElementById('spAvatar');
  const name = document.getElementById('spName');
  const action = document.getElementById('spAction');
  const time = document.getElementById('spTime');

  const orders = [
    { name: "Ahmad R.", loc: "Jakarta", pkg: "Paket 2 Botol", time: "1 menit lalu", color: "#C19A3A" },
    { name: "Budi S.", loc: "Surabaya", pkg: "Paket 3 Botol", time: "3 menit lalu", color: "#8B6914" },
    { name: "Siti N.", loc: "Bandung", pkg: "Paket 1 Botol", time: "5 menit lalu", color: "#5D4037" },
    { name: "Dewi M.", loc: "Medan", pkg: "Paket 2 Botol", time: "8 menit lalu", color: "#A0522D" },
    { name: "Rizky D.", loc: "Semarang", pkg: "Paket 3 Botol", time: "12 menit lalu", color: "#6D4C41" }
  ];

  let currentIndex = 0;

  function showToast() {
    const order = orders[currentIndex];

    // SVG icon is retained, just updating background
    avatar.style.backgroundColor = order.color;
    name.innerText = `${order.name} dari ${order.loc}`;
    action.innerText = order.pkg;
    time.innerText = order.time;

    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 5000); // Hide after 5 seconds

    currentIndex = (currentIndex + 1) % orders.length;
  }

  // Initial delay
  setTimeout(() => {
    showToast();
    setInterval(showToast, 12000); // Show next toast every 12 seconds
  }, 4000);
}

// Sticky navbar shadow + mobile order bar visibility (single scroll listener)
function initScrollEffects() {
  const nav = document.getElementById('navbar');
  const mobileBar = document.getElementById('mobileCta');
  const hero = document.getElementById('home');

  function onScroll() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 44);
    }
    if (mobileBar && hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      mobileBar.classList.toggle('show', window.scrollY > heroBottom - 200);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile hamburger nav
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// FAQ accordion (single item open at a time)
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Modal Logic
function handleOrder(qty, price, title) {
  const modal = document.getElementById('orderModal');
  const mTitle = document.getElementById('modalTitle');
  const mPrice = document.getElementById('modalPrice');
  const waBtn = document.getElementById('modalWA');

  mTitle.innerText = title;
  mPrice.innerText = price;

  const waText = encodeURIComponent(`Halo ENERBEE, saya tertarik dengan promo hari ini untuk pesanan ${title} (${price}). Mohon panduannya.`);
  waBtn.href = `https://wa.me/6281234567890?text=${waText}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target.id !== 'orderModal' && !e.target.closest('.modal__close')) return;
  document.getElementById('orderModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Smooth scroll — offset follows the real, dynamically measured header height
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if(target) {
      e.preventDefault();
      const rootStyle = getComputedStyle(document.documentElement);
      const topbarH = parseFloat(rootStyle.getPropertyValue('--topbar-h')) || 0;
      const navbarH = parseFloat(rootStyle.getPropertyValue('--navbar-h')) || 0;
      const topOffset = target.getBoundingClientRect().top + window.scrollY - (topbarH + navbarH + 16);
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  });
});

// Init all
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderHeights();
  initAOS();
  startCountdown();
  initSlots();
  initSocialProof();
  initScrollEffects();
  initMobileNav();
  initFAQ();
});

window.addEventListener('load', updateHeaderHeights);
window.addEventListener('resize', updateHeaderHeights);
