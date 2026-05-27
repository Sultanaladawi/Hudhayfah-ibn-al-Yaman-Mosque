import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';
import { BookOpen, Users, MapPin, ArrowLeft } from 'lucide-react';

const PILLARS = [
  { icon: <BookOpen size={22} />, title: 'حلقات التحفيظ', desc: 'حلقات يومية مخصصة لجميع الفئات العمرية لحفظ وتلاوة القرآن الكريم بأحكام التجويد.' },
  { icon: <Users size={22} />, title: 'بيئة تربوية', desc: 'نحرص على بناء جيل واعٍ ومثقف دينياً وأخلاقياً من خلال الأنشطة والمتابعة المستمرة.' },
  { icon: <MapPin size={22} />, title: 'موقعنا', desc: 'عمان، طبربور، بالقرب من كشك الشرطة. موقع يسهل الوصول إليه لأبناء الحي والمناطق المجاورة.' },
];

export default function About() {
  const [imgRef, imgVis] = useReveal();
  const [textRef, textVis] = useReveal();
  const [pilRef, pilVis] = useReveal();

  return (
    <section className={styles.about} id="about" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="section-wrap">
        <div className={styles.twoCol}>
          <div ref={imgRef} className={`${styles.imgWrap} reveal ${imgVis ? 'vis' : ''}`}>
            <div className={styles.imgMain}>
              <img
                src="/images/gallery3.jpg"
                alt="مسجد حذيفة بن اليمان"
                loading="lazy"
                onError={(e) => { e.target.src='/images/logo.jpg' }}
              />
            </div>
            <div className={styles.imgAccent}>
              <img
                src="/images/gallery1.jpg"
                alt="حلقات التحفيظ"
                loading="lazy"
                onError={(e) => { e.target.src='/images/logo.jpg' }}
              />
            </div>
            <div className={styles.badge} style={{ backgroundColor: 'var(--olive)', color: 'var(--gold)', borderColor: 'var(--gold)' }}>
              <span className={styles.badgeText} style={{ color: '#fff' }}>مسجد</span>
              <span className={styles.badgeMain} style={{ color: 'var(--gold)' }}>حذيفة بن اليمان</span>
              <span className={styles.badgeText} style={{ color: '#fff' }}>طبربور</span>
            </div>
          </div>

          <div ref={textRef} className={`${styles.text} reveal ${textVis ? 'vis' : ''}`}>
            <div className="label" style={{ color: 'var(--gold)' }}>عن المسجد</div>
            <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
            <h2 className="h2" style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>منارة العلم والتربية</h2>
            
            <p className={styles.body}>
              يعتبر مسجد حذيفة بن اليمان في طبربور من المساجد الرائدة في احتضان الشباب والأشبال وتوجيههم نحو الخير والصلاح. نسعى دائماً لتوفير بيئة إيمانية متكاملة تجمع بين حفظ القرآن الكريم والأنشطة التربوية والرياضية.
            </p>
            
            <p className={styles.body}>
              يضم المسجد نخبة من المشايخ والمحفظين الذين يبذلون جهوداً مباركة في متابعة الطلاب وتطوير مهاراتهم، بالإضافة إلى تنظيم رحلات ترفيهية ومسابقات ثقافية دورية لتعزيز روح المنافسة والأخوة بين شباب المسجد.
            </p>
            
            <div style={{ marginTop: '2rem', borderRadius: '15px', overflow: 'hidden', border: '2px solid var(--olive)' }}>
              <iframe 
                src="https://maps.google.com/maps?q=%D9%85%D8%B3%D8%AC%D8%AF%20%D8%AD%D8%B0%D9%8A%D9%81%D8%A9%20%D8%A8%D9%86%20%D8%A7%D9%84%D9%8A%D9%85%D8%A7%D9%86%20%D8%B7%D8%A8%D8%B1%D8%A8%D9%88%D8%B1&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="200" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع المسجد"
              ></iframe>
            </div>

            <a href="#contact" className="btn btn-primary" style={{ marginTop: '1.6rem', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'Amiri', serif", fontSize: '1.2rem' }}>
              تواصل معنا <ArrowLeft size={20} />
            </a>
          </div>
        </div>

        <div ref={pilRef} className={`${styles.pillars} reveal ${pilVis ? 'vis' : ''}`}>
          {PILLARS.map((p, i) => (
            <div key={p.title} className={styles.pillar} style={{ animationDelay: `${i * 150}ms`, borderTop: '3px solid var(--gold)' }}>
              <div className={styles.pillarIcon} style={{ color: 'var(--olive)' }}>{p.icon}</div>
              <h3 className={styles.pillarTitle} style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif", fontSize: '1.5rem', fontWeight: 'bold' }}>{p.title}</h3>
              <p className={styles.pillarDesc} style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}