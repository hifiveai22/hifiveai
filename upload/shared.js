/* ============================================================
   HIFIVE AI — Shared Components
   Nav · Footer · Scroll Bar · Reveals · Counters
   Updated: 6-Module Architecture (HiAI, HiTalent, HiPeople,
   HiPay, HiGlobal, HiOps)
============================================================ */

/* ── Favicon ── */
(function(){
  var link=document.createElement('link');link.rel='icon';link.type='image/svg+xml';
  link.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#F5F0E8"/><polygon points="16,6 25.5,12.9 21.9,24.1 10.1,24.1 6.5,12.9" stroke="#B07D2E" stroke-width="1.2" fill="none"/><circle cx="16" cy="6" r="2" fill="#B07D2E"/><circle cx="25.5" cy="12.9" r="2" fill="#B07D2E"/><circle cx="21.9" cy="24.1" r="2" fill="#B07D2E"/><circle cx="10.1" cy="24.1" r="2" fill="#B07D2E"/><circle cx="6.5" cy="12.9" r="2" fill="#B07D2E"/><circle cx="16" cy="16" r="1.5" fill="#B07D2E" opacity="0.6"/></svg>');
  document.head.appendChild(link);
  var bar=document.createElement('div');bar.id='scroll-bar';document.body.prepend(bar);
  window.addEventListener('scroll',function(){var p=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;bar.style.width=Math.min(p,100)+'%';},{passive:true});
})();

/* ── Reveal Observer ── */
var _revealObs=null;
function initReveal(){
  if(_revealObs)_revealObs.disconnect();
  _revealObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');_revealObs.unobserve(e.target)}});
  },{threshold:.06,rootMargin:'0px 0px -36px 0px'});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.stagger,.gold-underline').forEach(function(el){_revealObs.observe(el)});
}

/* ── Animated Counter ── */
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(function(el){
    if(el._counted)return;
    var target=parseFloat(el.dataset.count);var suffix=el.dataset.suffix||'';var prefix=el.dataset.prefix||'';
    var dur=1800;var start=performance.now();el._counted=true;
    function step(now){
      var p=Math.min((now-start)/dur,1);var ease=1-Math.pow(1-p,4);
      var val=target%1===0?Math.round(ease*target):(ease*target).toFixed(1);
      el.textContent=prefix+val+suffix;if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
function initCounters(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){animateCounters();obs.unobserve(e.target)}});
  },{threshold:.3});
  document.querySelectorAll('[data-count]').forEach(function(el){obs.observe(el)});
}

/* ── Nav Builder ── */
function buildNav(activePage){
  var pages=[
    {id:'index',label:'Home',href:'home.html'},
    {id:'platform',label:'Platform',href:'platform.html',mega:true},
    {id:'solutions',label:'Solutions',href:'solutions.html'},
    {id:'why',label:'Why Us',href:'why.html'},
    {id:'contact',label:'Contact',href:'contact.html'}
  ];
  var megaItems=[
    {icon:'🧠',label:'HiAI',desc:'Reasoning engine & cross-module intelligence',href:'platform.html#askai'},
    {icon:'🎯',label:'HiTalent',desc:'Talent acquisition & candidate intelligence',href:'platform.html#talent'},
    {icon:'👥',label:'HiPeople',desc:'People lifecycle, onboarding & performance',href:'platform.html#lifecycle'},
    {icon:'💸',label:'HiPay',desc:'Global payroll, compensation & rewards',href:'platform.html#payroll'},
    {icon:'🌍',label:'HiGlobal',desc:'EOR, contractors & cross-border compliance',href:'platform.html#global'},
    {icon:'⚙️',label:'HiOps',desc:'Workspace, assets & IT operations',href:'platform.html#operations'},
    {icon:'📊',label:'Executive Dashboard',desc:'C-Suite command center & KPIs',href:'solutions.html#ceo'},
    {icon:'🔒',label:'Security & Compliance',desc:'SOC 2, ISO 27001, GDPR, zero-trust',href:'platform.html#connections'},
    {icon:'🔗',label:'API & Integrations',desc:'REST API, webhooks, SSO & HRIS sync',href:'platform.html#connections'}
  ];
  var linksHtml=pages.map(function(p){
    var a=p.id===activePage?' active':'';
    if(p.mega){
      return '<div class="nav-item"><a href="'+p.href+'" class="nav-link'+a+'">'+p.label+'<svg viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a><div class="nav-mega"><div class="nav-mega-inner">'+megaItems.map(function(m){return '<a href="'+m.href+'" class="nav-mega-item"><span class="nav-mega-icon">'+m.icon+'</span><span><div class="nav-mega-label">'+m.label+'</div><div class="nav-mega-desc">'+m.desc+'</div></span></a>'}).join('')+'</div></div></div>';
    }
    return '<div class="nav-item"><a href="'+p.href+'" class="nav-link'+a+'">'+p.label+'</a></div>';
  }).join('');
  var mobileHtml=pages.map(function(p){return '<a href="'+p.href+'" class="mobile-link'+(p.id===activePage?' active':'')+'">'+p.label+'</a>'}).join('')+'<div class="mobile-divider"></div><a href="https://cal.com/hifiveai" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:4px;">Book Free HR Audit →</a>';
  document.body.insertAdjacentHTML('afterbegin','<nav id="nav"><a href="home.html" class="nav-logo">HiFive<span>AI</span></a><div class="nav-links">'+linksHtml+'</div><a href="https://cal.com/hifiveai" target="_blank" class="btn btn-primary btn-sm nav-cta">Book Free HR Audit →</a><button class="mobile-toggle" onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'open\')"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3h12M1.5 7.5h12M1.5 12h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Menu</button></nav><div class="mobile-menu" id="mobile-menu">'+mobileHtml+'</div>');
  window.addEventListener('scroll',function(){
    var nav=document.getElementById('nav');if(!nav)return;
    nav.classList.toggle('scrolled',window.scrollY>20);
    var hero=document.getElementById('hero');
    if(hero){nav.classList.toggle('dark-nav',window.scrollY<hero.offsetHeight-100)}
  },{passive:true});
  document.addEventListener('click',function(e){
    var mm=document.getElementById('mobile-menu');var tog=document.querySelector('.mobile-toggle');
    if(mm&&tog&&!mm.contains(e.target)&&!tog.contains(e.target))mm.classList.remove('open');
  });
}

/* ── Footer Builder ── */
function buildFooter(){
  document.body.insertAdjacentHTML('beforeend',
    '<footer><div class="footer-inner"><div><div class="footer-brand-name">HiFive<span>AI</span></div><p class="footer-brand-desc">The AI-native People Operating System for the modern enterprise. Six interconnected modules. One continuously learning intelligence layer.</p><div class="footer-geo"><span class="footer-geo-pill">🇦🇪 UAE</span><span class="footer-geo-pill">🇬🇧 United Kingdom</span><span class="footer-geo-pill">🇸🇬 Singapore</span><span class="footer-geo-pill">🇮🇳 India</span><span class="footer-geo-pill">🇺🇸 United States</span><span class="footer-geo-pill">🌐 Global</span></div></div><div><div class="footer-col-title">Platform</div><a href="platform.html#askai" class="footer-col-link">HiAI</a><a href="platform.html#talent" class="footer-col-link">HiTalent</a><a href="platform.html#lifecycle" class="footer-col-link">HiPeople</a><a href="platform.html#payroll" class="footer-col-link">HiPay</a><a href="platform.html#global" class="footer-col-link">HiGlobal</a><a href="platform.html#operations" class="footer-col-link">HiOps</a></div><div><div class="footer-col-title">Company</div><a href="solutions.html" class="footer-col-link">Solutions</a><a href="why.html" class="footer-col-link">Why HiFive</a><a href="contact.html" class="footer-col-link">Contact</a></div><div><div class="footer-col-title">Get Started</div><a href="https://cal.com/hifiveai" target="_blank" class="footer-col-link">Book Free HR Audit</a><a href="mailto:hello@hifiveai.co" class="footer-col-link">hello@hifiveai.co</a><a href="https://linkedin.com/company/hifiveai" target="_blank" class="footer-col-link">LinkedIn</a><a href="https://hifiveai.co" target="_blank" class="footer-col-link">hifiveai.co</a></div></div><div class="footer-bottom"><span class="footer-bottom-copy">© 2026 HiFive AI. All rights reserved.</span><div style="display:flex;gap:20px"><a href="#" class="footer-bottom-link">Privacy Policy</a><a href="#" class="footer-bottom-link">Terms</a><a href="#" class="footer-bottom-link">Security</a></div></div></footer><div class="floating-cta" id="floating-cta"><a href="https://cal.com/hifiveai" target="_blank" class="btn btn-gold btn-sm" style="box-shadow:0 8px 32px rgba(176,125,46,.35)">Book Free HR Audit →</a></div>'
  );
  window.addEventListener('scroll',function(){var el=document.getElementById('floating-cta');if(el)el.classList.toggle('visible',window.scrollY>400)},{passive:true});
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded',function(){
  initReveal();initCounters();
  var hash=window.location.hash;
  if(hash){var el=document.querySelector(hash);if(el)setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'start'})},300)}
});