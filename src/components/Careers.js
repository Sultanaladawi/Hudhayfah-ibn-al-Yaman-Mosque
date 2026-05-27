import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import styles from './Careers.module.css';

export default function Careers() {
  const [headerRef, headerVis] = useReveal();
  const [bodyRef, bodyVis] = useReveal();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const roles = [
    { id: 1, title: 'محفظ قرآن', type: 'تطوع دائم', location: 'المسجد' },
    { id: 2, title: 'مشرف أنشطة', type: 'تطوع مرن', location: 'المسجد والرحلات' },
    { id: 3, title: 'مصور وصانع محتوى', type: 'تطوع مرن', location: 'تغطية الفعاليات' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submit
    setTimeout(() => {
      setStatusMsg({ type: 'success', text: 'تم إرسال طلب التطوع بنجاح. جزاك الله خيراً!' });
      setIsSubmitting(false);
      setTimeout(() => setSelectedRole(null), 3000);
    }, 1500);
  };

  return (
    <section className={styles.careers} id="careers" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="section-wrap">
        <div ref={headerRef} className={`${styles.header} reveal ${headerVis ? 'vis' : ''}`}>
          <div className="label" style={{ color: 'var(--gold)' }}>شاركنا الأجر</div>
          <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
          <h2 className={styles.mainTitle} style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>فرص التطوع</h2>
        </div>

        <div ref={bodyRef} className={`${styles.body} reveal ${bodyVis ? 'vis' : ''}`}>
          <div className={styles.left}>
            {selectedRole ? (
              <div className={styles.formContainer}>
                <h3 className={styles.applyingFor} style={{ color: 'var(--olive)' }}>
                  التطوع كـ: <span>{selectedRole.title}</span>
                </h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <input type="text" placeholder="الاسم الكامل" required className={styles.inputField} style={{ textAlign: 'right' }} />
                  <input type="tel" placeholder="رقم الهاتف" required className={styles.inputField} style={{ textAlign: 'right' }} />
                  <textarea placeholder="حدثنا عن خبرتك وسبب رغبتك بالتطوع..." required className={styles.textAreaField} style={{ textAlign: 'right' }} />
                  
                  {statusMsg.text && (
                    <p className={statusMsg.type === 'error' ? styles.errorMsg : styles.successMsg}>
                      {statusMsg.text}
                    </p>
                  )}

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting} style={{ backgroundColor: 'var(--olive)', color: '#fff' }}>
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setSelectedRole(null)}>
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={styles.introContainer}>
                <p className={styles.intro} style={{ color: 'var(--text-secondary)' }}>
                  يبحث مسجد حذيفة بن اليمان دائماً عن الطاقات الشبابية والكوادر المحبة للخير، للمساهمة في بناء جيل قرآني وتربوي متميز. 
                  سواء كنت محفظاً، أو مصوراً، أو مشرفاً، فإن لك بصمة وأجراً لا ينقطع بإذن الله.
                </p>
                <div className={styles.applyBox} style={{ borderColor: 'var(--gold)' }}>
                  <span className={styles.applyText} style={{ color: 'var(--olive)' }}>تواصل مباشر:</span>
                  <a href="tel:+962000000000" className={styles.applyEmail} style={{ color: 'var(--gold)' }}>
                    <i className="fas fa-phone" /> 00962000000000
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={styles.right}>
            <div className={styles.rolesLabel} style={{ color: 'var(--olive)' }}>المجالات المتاحة حالياً</div>
            {roles.map(r => (
              <div key={r.id} className={`${styles.roleCard} ${selectedRole?.id === r.id ? styles.activeCard : ''}`} onClick={() => setSelectedRole(r)}>
                <div className={styles.roleIcon} style={{ color: 'var(--gold)' }}>
                  <i className="fas fa-hand-holding-heart" />
                </div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleTitle} style={{ color: 'var(--olive)' }}>{r.title}</div>
                  <div className={styles.roleType} style={{ color: 'var(--text-secondary)' }}>{r.type} / {r.location}</div>
                </div>
                <div className={styles.roleArrow} style={{ color: 'var(--gold)' }}>
                  <i className="fas fa-arrow-left" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
