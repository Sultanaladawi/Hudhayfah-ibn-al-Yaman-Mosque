import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import styles from './Contact.module.css';

export default function Contact() {
  const [infoRef, infoVis] = useReveal();
  const [formRef, formVis] = useReveal();

  const [fields, setFields] = useState({ name: '', phone: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const change = e => {
    const { name, value } = e.target;
    setFields(p => ({ ...p, [name]: value }));
  };

  const submit = async e => {
    e.preventDefault();
    if (!fields.name || !fields.message) return;
    setSubmitting(true);
    
    try {
      const emailValue = fields.email || `${Date.now()}@huzaifa-mosque.com`;
      const combinedMessage = `رقم الهاتف للتواصل: ${fields.phone || 'N/A'}\n\nالرسالة/الاقتراح:\n${fields.message}`;
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: emailValue,
          message: combinedMessage
        })
      });

      if (res.ok) {
        setDone(true);
      } else {
        alert("حدث خطأ أثناء إرسال رسالتكم المباركة. يرجى المحاولة لاحقاً.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      alert("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  };

  const prayerTimes = [
    { day: 'الفجر', open: '04:30 ص', close: 'إقامة: 04:50 ص' },
    { day: 'الظهر', open: '12:35 م', close: 'إقامة: 12:50 م' },
    { day: 'العصر', open: '04:15 م', close: 'إقامة: 04:30 م' },
    { day: 'المغرب', open: '07:45 م', close: 'إقامة: 07:55 م' },
    { day: 'العشاء', open: '09:15 م', close: 'إقامة: 09:30 م' },
  ];

  return (
    <section className={styles.contact} id="contact" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="section-wrap">
        <div className={styles.inner}>
          <div ref={infoRef} className={`${styles.info} reveal ${infoVis ? 'vis' : ''}`}>
            <div className="label" style={{ color: 'var(--gold)' }}>تواصل معنا</div>
            <div className="divider" style={{ backgroundColor: 'var(--olive)', marginRight: 0, marginLeft: 'auto' }} />
            <h2 className="h2" style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>نحن هنا لخدمتكم</h2>
            <p className={styles.infoDesc} style={{ color: 'var(--text-secondary)' }}>
              أبواب المسجد وإدارته مفتوحة للجميع، نسعد باستقبال استفساراتكم واقتراحاتكم.
            </p>

            <div className={styles.contactDetails}>
               <div className={styles.detailItem}>
                  <i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)' }} />
                  <div>
                    <strong style={{ color: 'var(--olive)' }}>الموقع</strong>
                    <p style={{ color: 'var(--text-secondary)' }}>عمان، طبربور، بالقرب من كشك الشرطة</p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <i className="fas fa-phone" style={{ color: 'var(--gold)' }} />
                  <div>
                    <strong style={{ color: 'var(--olive)' }}>الهاتف</strong>
                    <p style={{ color: 'var(--text-secondary)' }}>00962000000000</p>
                  </div>
               </div>
            </div>

            <div className={styles.hoursGrid}>
               <h4 style={{ color: 'var(--olive)', marginBottom: '10px', fontFamily: "'Amiri', serif", fontSize: '1.2rem' }}>أوقات الصلاة المعتمدة</h4>
               {prayerTimes.map(({ day, open, close }) => (
                 <div key={day} className={styles.hourRow} style={{ borderBottomColor: 'var(--divider)' }}>
                   <span style={{ color: 'var(--espresso)', fontWeight: 'bold' }}>{day}</span>
                   <span style={{ color: 'var(--text-secondary)' }}>{open} – {close}</span>
                 </div>
               ))}
            </div>
          </div>

          <div ref={formRef} className={`${styles.formWrap} reveal ${formVis ? 'vis' : ''}`}>
            {!done ? (
              <form onSubmit={submit}>
                <h3 className={styles.formTitle} style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>أرسل رسالة للإدارة</h3>
                
                <div className={styles.fg}>
                  <label htmlFor="name" style={{ color: 'var(--olive)' }}>الاسم الكريم</label>
                  <input id="name" name="name" type="text" placeholder="الاسم ثلاثي" value={fields.name} onChange={change} required style={{ textAlign: 'right' }} />
                </div>

                <div className={styles.fg}>
                  <label htmlFor="phone" style={{ color: 'var(--olive)' }}>رقم الهاتف للتواصل</label>
                  <input id="phone" name="phone" type="tel" placeholder="07XXXXXXXX" value={fields.phone} onChange={change} required style={{ textAlign: 'right' }} />
                </div>

                <div className={styles.fg}>
                  <label htmlFor="email" style={{ color: 'var(--olive)' }}>البريد الإلكتروني (اختياري)</label>
                  <input id="email" name="email" type="email" placeholder="example@domain.com" value={fields.email} onChange={change} style={{ textAlign: 'right' }} />
                </div>

                <div className={styles.fg}>
                  <label htmlFor="message" style={{ color: 'var(--olive)' }}>الرسالة أو الاقتراح</label>
                  <textarea id="message" name="message" rows={4} placeholder="تفضل بكتابة رسالتك..." value={fields.message} onChange={change} required style={{ textAlign: 'right' }} />
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting} style={{ backgroundColor: 'var(--olive)', color: '#fff', width: '100%', marginTop: '10px' }}>
                  {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            ) : (
              <div className={styles.success}>
                <div className={styles.successIcon} style={{ backgroundColor: 'var(--olive)', color: 'var(--gold)' }}><i className="fas fa-check" /></div>
                <h3 style={{ color: 'var(--olive)', fontFamily: "'Amiri', serif" }}>تم استلام رسالتك</h3>
                <p style={{ color: 'var(--text-secondary)' }}>بارك الله فيك، سيتم مراجعة رسالتك والتواصل معك قريباً.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}