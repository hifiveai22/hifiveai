/* ============================================================
   HIFIVE AI — SHARED COMPONENTS v3
============================================================ */

/* ── Inject favicon ── */
(function(){
  const link = document.createElement('link');
  link.rel = 'icon'; link.type = 'image/svg+xml';
  link.href = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#F5F0E8"/>
  <!-- Pentagon outline -->
  <polygon points="16,6 25.5,12.9 21.9,24.1 10.1,24.1 6.5,12.9" stroke="#B07D2E" stroke-width="1.2" fill="none"/>
  <!-- Spokes (network feel) -->
  <line x1="16" y1="16" x2="16" y2="6" stroke="#B07D2E" stroke-width="0.5" opacity="0.4"/>
  <line x1="16" y1="16" x2="25.5" y2="12.9" stroke="#B07D2E" stroke-width="0.5" opacity="0.4"/>
  <line x1="16" y1="16" x2="21.9" y2="24.1" stroke="#B07D2E" stroke-width="0.5" opacity="0.4"/>
  <line x1="16" y1="16" x2="10.1" y2="24.1" stroke="#B07D2E" stroke-width="0.5" opacity="0.4"/>
  <line x1="16" y1="16" x2="6.5" y2="12.9" stroke="#B07D2E" stroke-width="0.5" opacity="0.4"/>
  <!-- Nodes at vertices -->
  <circle cx="16" cy="6" r="2" fill="#B07D2E"/>
  <circle cx="25.5" cy="12.9" r="2" fill="#B07D2E"/>
  <circle cx="21.9" cy="24.1" r="2" fill="#B07D2E"/>
  <circle cx="10.1" cy="24.1" r="2" fill="#B07D2E"/>
  <circle cx="6.5" cy="12.9" r="2" fill="#B07D2E"/>
  <!-- Center node -->
  <circle cx="16" cy="16" r="1.5" fill="#B07D2E" opacity="0.6"/>
</svg>
  `);
  document.head.appendChild(link);

  // Also inject scroll progress bar
  const bar = document.createElement('div');
  bar.id = 'scroll-bar';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── Global reveal observer ── */
let _revealObs = null;
function initReveal() {
  if (_revealObs) _revealObs.disconnect();
  _revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        _revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .stagger, .gold-underline')
    .forEach(el => _revealObs.observe(el));
}

/* ── Animated counter ── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    if (el._counted) return;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    el._counted = true;
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const val = target % 1 === 0 ? Math.round(ease * target) : (ease * target).toFixed(1);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ── Marquee clone ── */
function initMarquees() {
  document.querySelectorAll('.marquee-inner').forEach(inner => {
    if (inner.dataset.cloned) return;
    inner.dataset.cloned = '1';
    const clone = inner.cloneNode(true);
    clone.dataset.cloned = '1';
    inner.parentElement.appendChild(clone);
  });
}

/* ── Logo helper: Google S2 favicon CDN — most reliable ── */
function logoUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

/* ── Nav ── */
function buildNav(activePage) {
  const pages = [
    { id: 'index',     label: 'Home',     href: 'home.html' },
    { id: 'offerings', label: 'Offerings', href: 'offerings.html', mega: true },
    { id: 'why',       label: 'Why Us',   href: 'why.html' },
    { id: 'process',   label: 'Process',  href: 'process.html' },
    { id: 'contact',   label: 'Contact',  href: 'contact.html' },
  ];
  const megaItems = [
    { icon:'🎯', label:'Hiring & Recruitment',     desc:'End-to-end candidate pipeline',      href:'offerings.html#hiring' },
    { icon:'🚀', label:'Onboarding & Offboarding', desc:'Day 1 to final day',                  href:'offerings.html#onboarding' },
    { icon:'📋', label:'Contracts & Documentation',desc:'Fast turnaround',                     href:'offerings.html#contracts' },
    { icon:'⚖️', label:'Compliance & Governance',  desc:'Multi-jurisdiction expertise',        href:'offerings.html#compliance' },
    { icon:'🌍', label:'Global Workforce',          desc:'EOR, contractors, distributed teams', href:'offerings.html#global' },
    { icon:'🎓', label:'Learning & Development',    desc:'LMS setup & training programmes',    href:'offerings.html#ld' },
    { icon:'📊', label:'HR Advisory & Reporting',  desc:'Monthly dashboards & strategy',       href:'offerings.html#advisory' },
  ];

  const linksHtml = pages.map(p => {
    const active = p.id === activePage ? ' active' : '';
    if (p.mega) return `
      <div class="nav-item">
        <a href="${p.href}" class="nav-link${active}">
          ${p.label}
          <svg viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-mega"><div class="nav-mega-inner">
          ${megaItems.map(m=>`
            <a href="${m.href}" class="nav-mega-item">
              <span class="nav-mega-icon">${m.icon}</span>
              <span><div class="nav-mega-label">${m.label}</div><div class="nav-mega-desc">${m.desc}</div></span>
            </a>`).join('')}
        </div></div>
      </div>`;
    return `<div class="nav-item"><a href="${p.href}" class="nav-link${active}">${p.label}</a></div>`;
  }).join('');

  const mobileHtml = pages.map(p =>
    `<a href="${p.href}" class="mobile-link${p.id===activePage?' active':''}">${p.label}</a>`
  ).join('') + `
    <div class="mobile-divider"></div>
    <a href="https://cal.com/hifiveai" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:4px;">Book Free HR Audit →</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="nav">
      <a href="home.html" class="nav-logo">HiFive<span>AI</span></a>
      <div class="nav-links">${linksHtml}</div>
      <a href="https://cal.com/hifiveai" target="_blank" class="btn btn-primary btn-sm nav-cta">Book Free HR Audit →</a>
      <button class="mobile-toggle" onclick="document.getElementById('mobile-menu').classList.toggle('open')">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3h12M1.5 7.5h12M1.5 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        Menu
      </button>
    </nav>
    <div class="mobile-menu" id="mobile-menu">${mobileHtml}</div>
  `);

  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  document.addEventListener('click', e => {
    const mm = document.getElementById('mobile-menu');
    const tog = document.querySelector('.mobile-toggle');
    if (mm && tog && !mm.contains(e.target) && !tog.contains(e.target)) mm.classList.remove('open');
  });

  setTimeout(initReveal, 0);
}

/* ── Footer ── */
function buildFooter() {
  document.body.insertAdjacentHTML('beforeend', `
    <footer>
      <div class="footer-inner">
        <div>
          <div class="footer-brand-name">HiFive<span>AI</span></div>
          <p class="footer-brand-desc">AI-native people operations for growing companies between 5 and 150 people. Covering UAE · UK · Singapore · India · US.</p>
          <div class="footer-geo">
            <span class="footer-geo-pill">🇦🇪 UAE</span>
            <span class="footer-geo-pill">🇬🇧 United Kingdom</span>
            <span class="footer-geo-pill">🇸🇬 Singapore</span>
            <span class="footer-geo-pill">🇮🇳 India</span>
            <span class="footer-geo-pill">🇺🇸 United States</span>
            <span class="footer-geo-pill">🌐 Global</span>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Services</div>
          <a href="offerings.html#hiring"     class="footer-col-link">Hiring & Recruitment</a>
          <a href="offerings.html#onboarding" class="footer-col-link">Onboarding & Offboarding</a>
          <a href="offerings.html#contracts"  class="footer-col-link">Contracts & Docs</a>
          <a href="offerings.html#compliance" class="footer-col-link">Compliance</a>
          <a href="offerings.html#global"     class="footer-col-link">Global Workforce</a>
          <a href="offerings.html#advisory"   class="footer-col-link">HR Advisory</a>
        </div>
        <div>
          <div class="footer-col-title">Company</div>
          <a href="why.html"     class="footer-col-link">Why Us</a>
          <a href="process.html" class="footer-col-link">How It Works</a>
          <a href="contact.html" class="footer-col-link">Contact</a>
        </div>
        <div>
          <div class="footer-col-title">Get Started</div>
          <a href="https://cal.com/hifiveai" target="_blank" class="footer-col-link">Book Free HR Audit</a>
          <a href="mailto:hello@hifiveai.co"  class="footer-col-link">hello@hifiveai.co</a>
          <a href="https://linkedin.com/company/hifiveai" target="_blank" class="footer-col-link">LinkedIn</a>
          <a href="https://hifiveai.co" target="_blank"   class="footer-col-link">hifiveai.co</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-bottom-copy">© 2026 HiFive AI. All rights reserved.</span>
        <div style="display:flex;gap:20px;">
          <a href="#" class="footer-bottom-link">Privacy Policy</a>
          <a href="#" class="footer-bottom-link">Terms</a>
        </div>
      </div>
    </footer>
    <div class="floating-cta" id="floating-cta">
      <a href="https://cal.com/hifiveai" target="_blank" class="btn btn-gold btn-sm" style="box-shadow:0 8px 32px rgba(176,125,46,0.35);">Book Free HR Audit →</a>
    </div>
  `);

  window.addEventListener('scroll', () => {
    const el = document.getElementById('floating-cta');
    if (el) el.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

/* ── DOMContentLoaded bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initMarquees();
  const hash = window.location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }
});