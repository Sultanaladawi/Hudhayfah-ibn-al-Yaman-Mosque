import { useState, useEffect, useRef } from 'react';
import { shopInfo } from '../data/shopData';
import styles from './Navbar.module.css';

// Inline SVG Icons — no CDN dependency
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const InstaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);


const LINKS = [
  { label: 'الرئيسية',    href: '#home' },
  { label: 'الأنشطة',    href: '#menu' },
  { label: 'معرض الصور', href: '#gallery' },
  { label: 'عن المسجد',   href: '#about' },
  { label: 'التطوع', href: '#careers' },
  { label: 'تواصل معنا', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleTakbeerat = (e) => {
    triggerGoldSparkles(e);
    if (!audioRef.current) {
      audioRef.current = new Audio(process.env.PUBLIC_URL + "/eid_takbeerat.mp3");
      audioRef.current.loop = true;
    }

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    setPlaying(!playing);
  };

  const triggerGoldSparkles = (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.innerText = '⭐';
      particle.style.position = 'fixed';
      particle.style.left = clickX + 'px';
      particle.style.top = clickY + 'px';
      particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '999999';
      particle.style.transition = 'all 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
      
      document.body.appendChild(particle);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 120 + 40;
      const xTranslate = Math.cos(angle) * velocity;
      const yTranslate = Math.sin(angle) * velocity;
      
      setTimeout(() => {
        particle.style.transform = `translate(${xTranslate}px, ${yTranslate}px) scale(0) rotate(${Math.random() * 360}deg)`;
        particle.style.opacity = '0';
      }, 50);
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 1300);
    }
  };
  const DEFAULT_ACHIEVEMENTS = [
    { id: 1, name: 'أحمد محمد الزعبي', grade: 100, reason: 'أتم حفظ سورة البقرة كاملاً بتميز وإتقان', icon: '🏆', date: '2026-05-26' },
    { id: 2, name: 'حلقة الفجر بقيادة الشيخ أسامة الطراونة', grade: null, reason: 'الحلقة النموذجية المتميزة لهذا الأسبوع لمواظبتها على الترتيل والحضور', icon: '🕌', date: '2026-05-26' },
    { id: 3, name: 'يوسف عمر أحمد', grade: 98, reason: 'أتم حفظ جزء عمّ بالتجويد والترتيل بتقدير ممتاز', icon: '📜', date: '2026-05-26' },
    { id: 4, name: 'عبدالرحمن خالد', grade: 95, reason: 'اجتاز اختبار حفظ 5 أجزاء متتالية بتقدير ممتاز جداً', icon: '🌟', date: '2026-05-26' },
    { id: 5, name: 'سند عمار البيطار', grade: 100, reason: 'الفائز الأول في مسابقة الأذان لطلاب الحلقات التمهيدية', icon: '📢', date: '2026-05-26' },
    { id: 6, name: 'حلقة العصر بقيادة الشيخ معاذ الضمور', grade: null, reason: 'حققت أعلى نسبة حضور وانضباط في الحفظ هذا الشهر', icon: '🕌', date: '2026-05-26' }
  ];

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('student_honors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ACHIEVEMENTS;
      }
    }
    localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
    return DEFAULT_ACHIEVEMENTS;
  });

  useEffect(() => {
    const isCoffeeItem = (item) => {
      const name = String(item.product_name || item.name || item.title || '').toLowerCase();
      const reason = String(item.reason || item.description || '').toLowerCase();
      
      const coffeeKeywords = [
        'latte', 'espresso', 'cappuccino', 'flat white', 'long black', 'tea', 'pastry', 
        'americano', 'cortado', 'macchiato', 'mocha', 'chocolate', 'juice', 'smoothie', 
        'cake', 'cheesecake', 'pancakes', 'sandwich', 'icecream', 'toast', 'muffin',
        'hot chocolate', 'breakfast tea', 'brunch', 'natata', 'nata'
      ];
      
      const offerKeywords = [
        'discount', 'off', 'clearance', 'promo', 'special', 'sale', 'employee', 'storewide'
      ];

      const hasCoffeeName = coffeeKeywords.some(kw => name.includes(kw));
      const hasOfferReason = offerKeywords.some(kw => reason.includes(kw));

      return hasCoffeeName || hasOfferReason;
    };

    const handleStorageChange = () => {
      const saved = localStorage.getItem('student_honors');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter(item => !isCoffeeItem(item));
          if (filtered.length > 0) {
            setAchievements(filtered);
          } else {
            setAchievements(DEFAULT_ACHIEVEMENTS);
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('honors_updated', handleStorageChange);
    
    // Initial filter check of what was in localStorage
    const saved = localStorage.getItem('student_honors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter(item => !isCoffeeItem(item));
        if (filtered.length > 0) {
          setAchievements(filtered);
        } else {
          setAchievements(DEFAULT_ACHIEVEMENTS);
          localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
        }
      } catch (e) {}
    }

    fetch('/api/offers')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No connection');
      })
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(item => !isCoffeeItem(item));
          if (filtered.length > 0) {
            const mapped = filtered.map(o => ({
              id: o.id,
              name: o.product_name || o.title || '',
              reason: o.reason || o.description || '',
              grade: o.discount_percent || null,
              icon: (o.product_name || o.title || '').includes('حلقة') ? '🕌' : '⭐',
              date: o.end_date
            }));
            setAchievements(mapped);
            localStorage.setItem('student_honors', JSON.stringify(mapped));
          } else {
            // DB has no valid achievements, fall back
            setAchievements(DEFAULT_ACHIEVEMENTS);
            localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
          }
        }
      })
      .catch(() => {
        // Fallback silently to localStorage
      });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('honors_updated', handleStorageChange);
    };
  }, []);

  const getArabicFormattedDates = () => {
    try {
      const today = new Date();
      const gregOption = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const gregDate = today.toLocaleDateString('ar-JO', gregOption);
      
      const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(today);
      
      return `${gregDate} مـ | ${hijriDate} هـ`;
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        
        {/* Student Achievements / Honors Marquee Banner */}
        <div style={{
          background: 'linear-gradient(95deg, #EEE3C8 0%, #E8D9B8 50%, #EEE3C8 100%)',
          color: '#2D1F0E',
          paddingTop: '6px',
          paddingBottom: '6px', 
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '600',
          letterSpacing: '0.5px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
          borderBottom: '1px solid var(--gold)', // Gold border
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          fontFamily: "'Amiri', 'Tajawal', sans-serif"
        }}>
          <div className="marquee-container" onClick={triggerGoldSparkles} style={{ 
            display: 'inline-block', 
            animation: 'marquee 35s linear infinite',
            cursor: 'pointer'
          }}>
            <span style={{ margin: '0 35px', color: 'var(--gold)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>📅</span> {getArabicFormattedDates()}
            </span>
            <span style={{ color: 'var(--gold)' }}>✦</span>
            {achievements.map((ach) => (
              <span key={ach.id} style={{ margin: '0 35px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="emojiIcon" style={{ fontSize: '1.15rem' }}>{ach.icon}</span>
                <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{ach.name}</span>
                <span style={{ color: '#6B4F35', margin: '0 4px' }}>&mdash;</span>
                <span style={{ color: '#4A3520' }}>{ach.reason}</span>
                {ach.grade && ach.grade > 0 && (
                  <span style={{ 
                    color: 'var(--gold)', 
                    border: '1px solid var(--gold)', 
                    padding: '1px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    marginLeft: '8px',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)'
                  }}>
                    بتقدير {ach.grade}%
                  </span>
                )}
                <span style={{ color: 'var(--gold)', margin: '0 10px' }}>✦</span>
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .marquee-container:hover { animation-play-state: paused; }
          `}</style>
        </div>

        <div className={styles.inner} style={{flexDirection: 'row-reverse'}}>
          <a href="#home" className={styles.logo} aria-label="مسجد حذيفة بن اليمان" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#FBF6EE',
              border: '2px solid var(--gold)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img src="/images/logo.jpg" alt="شعار المسجد" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
            </div>
            <span style={{ 
              fontFamily: "'Amiri', serif", 
              fontSize: '1.65rem', 
              fontWeight: '700',
              color: scrolled ? 'var(--olive)' : '#FEF9F4', 
              textShadow: scrolled ? 'none' : '0 2px 8px rgba(0,0,0,0.85)', 
              whiteSpace: 'nowrap',
              display: 'inline-block',
              lineHeight: '1.2'
            }}>
              مسجد <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>حذيفة بن اليمان</span>
            </span>
          </a>

          <nav aria-label="Main navigation">
            <ul className={styles.navLinks}>
              {LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={styles.navLink}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.navRight}>
            

            <button
              className={`${styles.burger} ${open ? styles.open : ''}`}
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`} role="dialog" aria-label="Navigation">
        <button className={styles.mobileClose} onClick={() => setOpen(false)} aria-label="Close menu">
          <CloseIcon />
        </button>
        <nav>
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          
        </nav>
        <a href={shopInfo.instagram} className={styles.mobileInsta} target="_blank" rel="noopener noreferrer">
          <InstaIcon /> {shopInfo.instagramHandle}
        </a>
      </div>
      {/* Floating Gold Crescent Eid Takbeerat Player */}
      <button 
        onClick={toggleTakbeerat}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          zIndex: 9999,
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          backgroundColor: '#1E1409',
          border: '2px solid #D4AF37',
          color: '#D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: playing ? '0 0 25px #D4AF37' : '0 10px 25px rgba(0,0,0,0.5)',
          transition: 'all 0.4s ease',
          animation: playing ? 'crescentPulse 2s infinite' : 'none',
          outline: 'none'
        }}
        title={playing ? "إيقاف تكبيرات العيد" : "تشغيل تكبيرات العيد المباركة"}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.6rem', lineHeight: '1', animation: playing ? 'spinSpin 5s linear infinite' : 'none' }}>
            🌙
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', marginTop: '2px', color: '#FEF9F4', fontFamily: 'Tajawal' }}>
            {playing ? "توقف" : "تكبيرات"}
          </span>
        </div>
      </button>

      <style>{`
        @keyframes crescentPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 164, 132, 0.7); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(196, 164, 132, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 164, 132, 0); }
        }
        @keyframes spinSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}