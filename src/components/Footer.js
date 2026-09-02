import { shopInfo } from '../data/shopData';
import styles from './Footer.module.css';

const QUICK = [
  { label: 'الرئيسية',          href: '#home' },
  { label: 'الأنشطة والفعاليات', href: '#menu' },
  { label: 'معرض الصور',        href: '#gallery' },
  { label: 'عن المسجد',          href: '#about' },
  { label: 'العمل التطوعي',      href: '#careers' },
  { label: 'تواصل معنا',         href: '#contact' },
];

const HOURS = [
  { label: 'الصلوات الخمس',     time: 'يومياً مع الجماعة' },
  { label: 'حلقات القرآن الكريم', time: 'بعد العصر والفجر' },
  { label: 'الأنشطة التربوية',   time: 'نهاية الأسبوع' },
];

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ── Shared text styles ── */
const DARK   = '#2D1F0E';   // headings, name
const BODY   = '#4A3018';   // body text & links
const GOLD   = '#B8860B';   // accent / times / hover
const BORDER = 'rgba(184,134,11,0.30)';

const sectionTitle = {
  color: DARK,
  fontFamily: "'Amiri', serif",
  fontSize: '1.2rem',
  fontWeight: '700',
  marginBottom: '18px',
  paddingBottom: '10px',
  borderBottom: `1.5px solid ${BORDER}`,
};

export default function Footer() {
  return (
    <footer className={styles.footer}
      style={{ direction: 'rtl', fontFamily: "'Tajawal', 'Amiri', sans-serif" }}>

      <div className={styles.inner}>

        {/* ── Brand ── */}
        <div className={styles.brand}>
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', marginBottom: '18px' }}>
            <span style={{ fontSize: '2.4rem' }}>🕌</span>
            <div>
              <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.55rem', color: DARK, fontWeight: 'bold', lineHeight: 1.2 }}>
                {shopInfo.name}
              </div>
              <div style={{ color: GOLD, fontSize: '0.82rem', marginTop: '3px' }}>
                {shopInfo.city}، {shopInfo.country}
              </div>
            </div>
          </a>
          <p style={{ color: BODY, fontSize: '0.93rem', lineHeight: 1.75, margin: '0 0 22px 0', maxWidth: '320px' }}>
            الصفحة الرسمية لمسجد حذيفة بن اليمان في الأردن - طبربور. دار القرآن الكريم والأنشطة التربوية والرياضية لشباب وأشبال المسجد. لا توجد أي صحبة في الدنيا تدوم كصحبة المسجد.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { href: shopInfo.facebook,  label: 'Facebook',  Icon: FacebookIcon  },
              { href: shopInfo.instagram, label: 'Instagram', Icon: InstagramIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(184,134,11,0.12)',
                  border: `1px solid ${BORDER}`,
                  color: GOLD, textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#FBF6EE'; }}
                onMouseOut={e  => { e.currentTarget.style.background = 'rgba(184,134,11,0.12)'; e.currentTarget.style.color = GOLD; }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* ── Hours ── */}
        <div className={styles.col}>
          <h4 style={sectionTitle}>مواعيد وأوقات المسجد</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {HOURS.map(({ label, time }) => (
              <li key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: BODY, fontSize: '0.9rem' }}>{label}</span>
                <span style={{ color: GOLD, fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' }}>{time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Quick Links ── */}
        <div className={styles.col}>
          <h4 style={sectionTitle}>روابط سريعة</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {QUICK.map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  style={{ color: BODY, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.25s' }}
                  onMouseOver={e => e.currentTarget.style.color = GOLD}
                  onMouseOut={e  => e.currentTarget.style.color = BODY}
                >
                  <span style={{ color: GOLD, fontSize: '0.65rem', lineHeight: 1 }}>◀</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Map ── */}
        <div className={styles.col}>
          <h4 style={sectionTitle}>موقع المسجد والاتصال</h4>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${BORDER}`, height: 120, marginBottom: 14, boxShadow: '0 4px 14px rgba(139,105,20,0.12)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.168707175514!2d35.9189!3d32.001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c9f7a7a7a7a7a%3A0x7a7a7a7a7a7a7a7a!2z2YXYs9is2K8g2K3w2YrZgdmF2Kkg2KjZhiDYp9mE2YrZhdin2YY!5e0!3m2!1sar!2sjo!4v1715000000000!5m2!1sar!2sjo"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mosque Location"
            />
          </div>
          <a href={shopInfo.mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', color: BODY, textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10, gap: 6 }}>
            📍 <span>{shopInfo.address}</span>
          </a>
          <a href={`mailto:${shopInfo.email}`}
            style={{ display: 'flex', alignItems: 'center', color: BODY, textDecoration: 'none', fontSize: '0.85rem', gap: 6 }}>
            ✉️ {shopInfo.email}
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: 1200, margin: '40px auto 0', padding: '20px 50px',
        borderTop: `1px solid ${BORDER}`,
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
        gap: 12, color: '#6B4F35', fontSize: '0.8rem',
      }}>
        <span>© {new Date().getFullYear()} {shopInfo.name}. جميع الحقوق محفوظة لبيت الله.</span>
        <span>بإشراف مشايخ المسجد واللجنة التربوية وحلقات التحفيظ.</span>
      </div>
    </footer>
  );
}