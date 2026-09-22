/* =============================================
   ENERBEE â€” Premium JS
============================================= */

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

// Sticky Navbar effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if(nav) {
    if (window.scrollY > 44) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 114;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  });
});

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  startCountdown();
  initSlots();
  initSocialProof();
});