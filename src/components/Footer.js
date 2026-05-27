import { shopInfo, openingHours } from '../data/shopData';
import styles from './Footer.module.css';

const QUICK = [
  { label: 'الرئيسية',    href: '#home' },
  { label: 'الأنشطة والفعاليات',    href: '#menu' },
  { label: 'معرض الصور', href: '#gallery' },
  { label: 'عن المسجد',   href: '#about' },
  { label: 'العمل التطوعي', href: '#careers' },
  { label: 'تواصل معنا', href: '#contact' },
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

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:'6px',flexShrink:0,verticalAlign:'middle'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:'6px',flexShrink:0,verticalAlign:'middle'}}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className={styles.footer} style={{ direction: 'rtl', fontFamily: "'Amiri', 'Tajawal', sans-serif" }}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href="#home" className={styles.logo} aria-label={shopInfo.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none', marginBottom: '20px' }}>
            <span style={{ fontSize: '2.5rem' }}>🕌</span>
            <div>
              <div className={styles.logoName} style={{ fontFamily: "'Amiri', serif", fontSize: '1.6rem', color: '#fff', fontWeight: 'bold' }}>{shopInfo.name}</div>
              <div className={styles.logoCity} style={{ color: 'var(--admin-accent)', fontSize: '0.85rem' }}>{shopInfo.city}، {shopInfo.country}</div>
            </div>
          </a>
          <p className={styles.brandDesc} style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 25px 0' }}>
            الصفحة الرسمية لمسجد حذيفة بن اليمان في الأردن - طبربور. دار القرآن الكريم والأنشطة التربوية والرياضية لشباب وأشبال المسجد. لا توجد أي صحبة في الدنيا تدوم كصحبة المسجد.
          </p>
          <div className={styles.socialGroup} style={{ display: 'flex', gap: '15px' }}>
            <a href={shopInfo.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook" style={{ color: 'var(--admin-accent)', transition: '0.3s' }}>
              <FacebookIcon />
            </a>
            <a href={shopInfo.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram" style={{ color: 'var(--admin-accent)', transition: '0.3s' }}>
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4 style={{ color: 'var(--admin-accent)', marginBottom: '20px', fontFamily: "'Amiri', serif", fontSize: '1.25rem' }}>مواعيد وأوقات المسجد</h4>
          <ul>
            <li className={styles.hoursRow} style={{ color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span>الصلوات الخمس</span>
              <span className={styles.time} style={{ color: 'var(--admin-accent)' }}>يومياً مع الجماعة</span>
            </li>
            <li className={styles.hoursRow} style={{ color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span>حلقات القرآن الكريم</span>
              <span className={styles.time} style={{ color: 'var(--admin-accent)' }}>بعد العصر والفجر</span>
            </li>
            <li className={styles.hoursRow} style={{ color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span>الأنشطة التربوية</span>
              <span className={styles.time} style={{ color: 'var(--admin-accent)' }}>نهاية الأسبوع</span>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 style={{ color: 'var(--admin-accent)', marginBottom: '20px', fontFamily: "'Amiri', serif", fontSize: '1.25rem' }}>روابط سريعة</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {QUICK.map(({ label, href }) => (
              <li key={label} style={{ marginBottom: '10px' }}>
                <a href={href} style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', transition: '0.3s' }}
                   onMouseOver={e => e.target.style.color = 'var(--admin-accent)'}
                   onMouseOut={e => e.target.style.color = '#ccc'}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 style={{ color: 'var(--admin-accent)', marginBottom: '20px', fontFamily: "'Amiri', serif", fontSize: '1.25rem' }}>موقع المسجد والاتصال</h4>
          <div className={styles.mapContainer} style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--admin-border)', height: '110px', marginBottom: '15px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.168707175514!2d35.9189!3d32.001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c9f7a7a7a7a7a%3A0x7a7a7a7a7a7a7a7a!2z2YXYs9is2K8g2K3w2YrZgdmF2Kkg2KjZhiDYp9mE2YrZhdin2YY!5e0!3m2!1sar!2sjo!4v1715000000000!5m2!1sar!2sjo"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mosque Location"
            ></iframe>
          </div>
          <a href={shopInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.address} style={{ display: 'flex', alignItems: 'center', color: '#ccc', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '10px' }}>
            <MapPinIcon />
            <span>{shopInfo.address}</span>
          </a>
          <a href={`mailto:${shopInfo.email}`} className={styles.emailLink} style={{ display: 'flex', alignItems: 'center', color: '#ccc', textDecoration: 'none', fontSize: '0.85rem' }}>
            <EnvelopeIcon /> {shopInfo.email}
          </a>
        </div>
      </div>

      <div className={styles.bottom} style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', color: '#777', fontSize: '0.8rem' }}>
        <span>© {new Date().getFullYear()} {shopInfo.name}. جميع الحقوق محفوظة لبيت الله.</span>
        <span>بإشراف مشايخ المسجد واللجنة التربوية وحلقات التحفيظ.</span>
      </div>
    </footer>
  );
}