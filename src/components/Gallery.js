import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import styles from './Gallery.module.css';

function seededRot(id) {
  const n = typeof id === 'number' ? id : String(id).charCodeAt(0);
  return (((n * 9301 + 49297) % 233280) / 233280) * 12 - 6;
}

function seededTapeRot(id) {
  const n = typeof id === 'number' ? id : String(id).charCodeAt(0);
  return (((n * 6271 + 31337) % 233280) / 233280) * 6 - 3;
}

function usePolaroidReveal() {
  const wallRef = useRef(null);
  const [visibleIds, setVisibleIds] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.polaroidId;
            setVisibleIds((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const cards = wallRef.current?.querySelectorAll('[data-polaroid-id]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return [wallRef, visibleIds];
}

export default function Gallery() {
  const [headerRef, headerVis] = useReveal();
  const [wallRef, visibleIds]  = usePolaroidReveal();

  const galleryImages = [
    { id: 1, src: '/images/gallery5.jpg', alt: 'حلقات التحفيظ', caption: 'تخريج دفعة من حفاظ كتاب الله' },
    { id: 2, src: '/images/gallery6.jpg', alt: 'الأنشطة', caption: 'رحلة ترفيهية لطلاب المركز', size: 'large' },
    { id: 3, src: '/images/gallery7.jpg', alt: 'المسجد من الداخل', caption: 'صلاة التراويح' },
    { id: 4, src: '/images/gallery8.jpg', alt: 'تكريم', caption: 'حفل التكريم السنوي' },
    { id: 5, src: '/images/gallery9.jpg', alt: 'درس علم', caption: 'درس فضيلة الشيخ' },
    { id: 6, src: '/images/gallery10.jpg', alt: 'أنشطة رياضية', caption: 'دوري كرة القدم المصغر', size: 'large' },
  ];

  return (
    <section className={styles.gallery} id="gallery" style={{ direction: 'rtl' }}>
      <div className="section-wrap">
        <div
          ref={headerRef}
          className={`${styles.header} reveal ${headerVis ? 'vis' : ''}`}
        >
          <div className="label" style={{ color: 'var(--gold)' }}>معرض الصور</div>
          <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
          <h2 className="h2" style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>أجواء المسجد والأنشطة</h2>
          <p className={styles.headerSub}>
            مقتطفات من حلقات التحفيظ، والأنشطة الترفيهية، والمحاضرات العلمية في رحاب مسجد حذيفة بن اليمان.
          </p>
        </div>

        <div ref={wallRef} className={styles.wall}>
          {galleryImages.map((img) => {
            const rot      = seededRot(img.id);
            const tapeRot  = seededTapeRot(img.id);
            const isLarge  = img.size === 'large';
            const isVis    = visibleIds.has(String(img.id));

            return (
              <div
                key={img.id}
                data-polaroid-id={img.id}
                className={`
                  ${styles.polaroid}
                  ${isLarge ? styles.large : styles.normal}
                  ${isVis   ? styles.visible : ''}
                `}
                style={{
                  '--rot':      `${rot}deg`,
                  '--tape-rot': `${tapeRot}deg`,
                }}
              >
                <div className={styles.photo}>
                  <img src={img.src} alt={img.alt} loading="lazy" onError={(e) => { e.target.src='/images/logo.png' }} />
                </div>

                <div className={styles.caption}>
                  <span style={{ fontFamily: "'Amiri', serif", fontWeight: 'bold', fontSize: '1.2rem', color: '#2c3e50' }}>{img.caption || img.alt}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '60px' }}>
          <div style={{ textAlign: 'right', marginBottom: '30px' }}>
            <div className="label" style={{ color: 'var(--gold)' }}>مرئيات مختارة</div>
            <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
            <h2 className="h2" style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>من أجواء المسجد</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            alignItems: 'start'
          }}>
            {[1,2,3,4,5,6,7].map(n => (
              <div key={n} style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#000',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; }}
              >
                <video
                  src={`/video${n}.mp4#t=0.1`}
                  controls
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    maxHeight: '500px',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                  playsInline
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}