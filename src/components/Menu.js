import React from 'react';
import { useReveal } from '../hooks/useReveal';

const ACTIVITIES = [
  {
    id: 1,
    icon: 'fas fa-quran',
    title: 'حلقات تحفيظ القرآن الكريم',
    desc: 'حلقات يومية بعد صلاة العصر والمغرب لجميع المستويات السنية، بإشراف نخبة من المشايخ المتخصصين.',
    color: '#3D2B1F',
    bg: 'rgba(61,43,31,0.07)',
    image: '/images/gallery1.jpg',
  },
  {
    id: 2,
    icon: 'fas fa-futbol',
    title: 'الأنشطة الرياضية',
    desc: 'دوري كرة قدم داخلي أسبوعي، وأنشطة رياضية متنوعة لتنمية الروح التنافسية وتعزيز الصحة.',
    color: '#C49B75',
    bg: 'rgba(196,155,117,0.07)',
    image: '/images/gallery2.jpg',
  },
  {
    id: 3,
    icon: 'fas fa-bus',
    title: 'الرحلات الترفيهية',
    desc: 'رحلات شهرية ومفاجآت للطلاب المتميزين في الحفظ والالتزام، لتشجيع الإنجاز وتعميق الأخوة.',
    color: '#2980b9',
    bg: 'rgba(41,128,185,0.07)',
    image: '/images/gallery3.jpg',
  },
  {
    id: 4,
    icon: 'fas fa-trophy',
    title: 'المسابقات الثقافية والدينية',
    desc: 'مسابقات دورية في القرآن والسيرة النبوية والثقافة الإسلامية مع جوائز قيّمة للفائزين.',
    color: '#8e44ad',
    bg: 'rgba(142,68,173,0.07)',
    image: '/images/gallery4.jpg',
  },
];

export default function Menu() {
  const [headerRef, headerVis] = useReveal();
  const [gridRef, gridVis] = useReveal();

  return (
    <section id="menu" style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #EDE8E0 0%, #F7F3ED 100%)',
      direction: 'rtl',
    }}>
      <div className="section-wrap">

        {/* Header */}
        <div ref={headerRef} className={`reveal ${headerVis ? 'vis' : ''}`} style={{ textAlign: 'right', marginBottom: '60px' }}>
          <div className="label" style={{ color: 'var(--gold)' }}>برامجنا المميزة</div>
          <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
          <h2 className="h2" style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>
            ماذا يقدّم المسجد؟
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', lineHeight: '1.8', marginTop: '12px' }}>
            أكثر من مجرد مسجد — نحن مركز تربوي متكامل يجمع بين العلم الشرعي والنشاط البدني والترفيه الهادف.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className={`reveal ${gridVis ? 'vis' : ''}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '28px',
        }}>
          {ACTIVITIES.map((act, i) => (
            <div key={act.id} style={{
              background: '#fff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: `${i * 60}ms`,
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.10), 0 0 0 2px ${act.color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
            }}
            >
              {/* Image */}
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={act.image}
                  alt={act.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                  onError={e => { e.target.src = '/images/logo.jpg'; }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, ${act.color}cc 0%, transparent 60%)`,
                }} />
                {/* Icon on image */}
                <div style={{
                  position: 'absolute', bottom: '14px', right: '18px',
                  width: '44px', height: '44px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.2rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  <i className={act.icon} />
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: '1.3rem',
                  color: act.color,
                  margin: '0 0 10px 0',
                  fontWeight: '700',
                  lineHeight: '1.3',
                }}>
                  {act.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  lineHeight: '1.75',
                  margin: 0,
                }}>
                  {act.desc}
                </p>
              </div>

              {/* Bottom accent */}
              <div style={{ height: '3px', background: `linear-gradient(90deg, ${act.color}, transparent)` }} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <a href="#contact" className="btn btn-primary" style={{
            fontFamily: "'Amiri', serif", fontSize: '1.15rem', letterSpacing: '0',
            background: 'var(--olive)', color: '#fff', padding: '14px 40px'
          }}>
            <i className="fas fa-phone" style={{ marginLeft: '10px' }} />
            تواصل معنا للتسجيل
          </a>
        </div>

      </div>
    </section>
  );
}