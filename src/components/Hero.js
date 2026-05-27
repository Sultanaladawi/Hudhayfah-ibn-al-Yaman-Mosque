import { useRef, useState } from 'react';
import styles from './Hero.module.css';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { value: '+150', label: 'طالب مسجّل' },
  { value: '8',    label: 'حلقات تحفيظ' },
  { value: '12+',  label: 'سنة عطاء' },
];

export default function Hero() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    setMuted(prev => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  };

  return (
    <>
    <section className={styles.hero} id="home">

      {/* ── Full-screen background video ── */}
      <video
        ref={videoRef}
        className={styles.bgVideo}
        src="/video8.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ── Dark overlay ── */}
      <div className={styles.overlay} />

      {/* ── Sound toggle button ── */}
      <button className={styles.soundBtn} onClick={toggleSound} title={muted ? 'تشغيل الصوت' : 'كتم الصوت'}>
        {muted ? (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
            <span>شغّل الصوت</span>
          </>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <span>كتم الصوت</span>
          </>
        )}
      </button>

      {/* ── Content ── */}
      <div className={styles.content} style={{ maxWidth: '850px', paddingLeft: '20px', paddingRight: '20px' }}>

        {/* Badge */}
        <div className={styles.badge}>
          <img src="/images/logo.jpg" alt="شعار المسجد" className={styles.badgeImg} />
          <span>المنصة الرسمية - نسخة موسم الأعياد</span>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          مسجد<br />
          <span className={styles.gold}>حذيفة بن اليمان</span>
        </h1>

        <p className={styles.sub}>
          نافذتكم لمتابعة حلقات تحفيظ القرآن الكريم، والأنشطة التربوية والرياضية
          لشباب وأشبال مسجد حذيفة بن اليمان في طبربور — عمان.
        </p>

        {/* CTAs */}
        <div className={styles.ctas}>
          <button className={styles.btnPrimary} onClick={() => navigate('/admin/login')}>
            <i className="fas fa-user-graduate" />
            دخول المشايخ والمعلمين
          </button>
          <a href="#about" className={styles.btnOutline}>
            <i className="fas fa-mosque" />
            تعرّف على المسجد
          </a>
        </div>

        {/* Stats */}
        <div className={styles.stats} style={{ width: '100%' }}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.stat} style={{ flex: 1 }}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Hajj Channel Live Stream Embed Card */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(24, 69, 59, 0.45)',
          backdropFilter: 'blur(12px)',
          border: '2px solid #C49B75',
          borderRadius: '24px',
          padding: '25px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          boxSizing: 'border-box',
          textAlign: 'center',
          animation: 'glowPulse 2.5s infinite alternate'
        }}>
          <h3 style={{ fontFamily: "'Amiri', serif", color: '#C49B75', fontSize: '1.6rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
             🕋 البث المباشر لقناة الحج الفضائية ومناسك عرفة
          </h3>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCos52azQNBgW63_9uDJoPDA&autoplay=0"
              title="Makkah Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          <p style={{ color: '#fff', fontSize: '0.95rem', marginTop: '15px', opacity: 0.85, fontFamily: 'Tajawal', lineHeight: '1.6' }}>
            تابعوا البث المباشر لجموع الحجيج وتكبيرات العيد المباركة من مكة المكرمة والمشاعر المقدسة طوال أيام عشر ذي الحجة وعيد الأضحى المبارك. تقبل الله منا ومنكم صالح الأعمال.
          </p>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <span>اكتشف المزيد</span>
        <i className="fas fa-chevron-down" />
      </div>

      <style>{`
        @keyframes glowPulse {
          0% { box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 5px rgba(196,155,117,0.2); }
          100% { box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(196,155,117,0.5); }
        }
      `}</style>
    </section>
  );
}