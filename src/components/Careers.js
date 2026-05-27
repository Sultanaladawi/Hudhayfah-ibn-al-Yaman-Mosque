import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import styles from './Careers.module.css';
import axios from 'axios';

export default function Careers() {
  const [headerRef, headerVis] = useReveal();
  const [bodyRef, bodyVis] = useReveal();

  const [roles, setRoles] = useState([
    { id: 1, title: 'محفظ قرآن', type: 'تطوع دائم', location: 'المسجد' },
    { id: 2, title: 'مشرف أنشطة', type: 'تطوع مرن', location: 'المسجد والرحلات' },
    { id: 3, title: 'مصور وصانع محتوى', type: 'تطوع مرن', location: 'تغطية الفعاليات' }
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', cover_letter: '' });
  const [errors, setErrors] = useState({});

  // Load real roles from database
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get('/api/careers');
        if (res.data && res.data.length > 0) {
          setRoles(res.data.map(r => ({
            id: r.id,
            title: r.title,
            type: r.type,
            location: r.location,
            description: r.description
          })));
        }
      } catch (err) {
        // fallback to default roles already set
        console.warn('Could not load careers from server, using defaults.');
      }
    };
    fetchRoles();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.trim()) e.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'البريد الإلكتروني غير صحيح';
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    if (!form.cover_letter.trim()) e.cover_letter = 'حدثنا عن نفسك أولاً';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });
    try {
      await axios.post('/api/apply', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: selectedRole?.title || 'متطوع',
        cover_letter: form.cover_letter.trim(),
        resume_url: null
      });
      setStatusMsg({ type: 'success', text: '✅ تم إرسال طلب التطوع بنجاح. جزاك الله خيراً! سنتواصل معك قريباً.' });
      setForm({ name: '', email: '', phone: '', cover_letter: '' });
      setTimeout(() => setSelectedRole(null), 4000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: '❌ حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    textAlign: 'right',
    direction: 'rtl',
    width: '100%',
    padding: '13px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${errors[field] ? '#e74c3c' : 'var(--gold)'}`,
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontFamily: "'Tajawal', sans-serif",
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    marginBottom: errors[field] ? '4px' : '14px',
  });

  const errStyle = {
    color: '#e74c3c',
    fontSize: '0.78rem',
    marginBottom: '10px',
    display: 'block',
    textAlign: 'right',
    fontFamily: "'Tajawal', sans-serif"
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
                  التطوع كـ: <span style={{ color: 'var(--gold)' }}>{selectedRole.title}</span>
                </h3>
                <form onSubmit={handleSubmit} className={styles.form} noValidate>

                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    placeholder="الاسم الكامل *"
                    value={form.name}
                    onChange={handleChange}
                    style={inputStyle('name')}
                  />
                  {errors.name && <span style={errStyle}>{errors.name}</span>}

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني *"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle('email')}
                  />
                  {errors.email && <span style={errStyle}>{errors.email}</span>}

                  {/* Phone */}
                  <input
                    type="tel"
                    name="phone"
                    placeholder="رقم الهاتف * (مثال: 07XXXXXXXX)"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle('phone')}
                  />
                  {errors.phone && <span style={errStyle}>{errors.phone}</span>}

                  {/* Cover Letter */}
                  <textarea
                    name="cover_letter"
                    placeholder="حدثنا عن خبرتك وسبب رغبتك بالتطوع في مسجد حذيفة بن اليمان... *"
                    value={form.cover_letter}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...inputStyle('cover_letter'), resize: 'vertical', minHeight: '100px' }}
                  />
                  {errors.cover_letter && <span style={errStyle}>{errors.cover_letter}</span>}

                  {statusMsg.text && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      marginBottom: '14px',
                      background: statusMsg.type === 'success' ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)',
                      border: `1px solid ${statusMsg.type === 'success' ? '#27ae60' : '#e74c3c'}`,
                      color: statusMsg.type === 'success' ? '#27ae60' : '#e74c3c',
                      fontSize: '0.92rem',
                      fontFamily: "'Tajawal', sans-serif",
                      textAlign: 'right',
                      lineHeight: '1.6'
                    }}>
                      {statusMsg.text}
                    </div>
                  )}

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isSubmitting}
                      style={{ backgroundColor: 'var(--olive)', color: '#fff' }}
                    >
                      {isSubmitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <span style={{
                            width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.5)',
                            borderTopColor: '#fff', borderRadius: '50%',
                            display: 'inline-block', animation: 'spin 0.8s linear infinite'
                          }} />
                          جاري الإرسال...
                        </span>
                      ) : '📨 إرسال طلب التطوع'}
                    </button>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => { setSelectedRole(null); setStatusMsg({ type: '', text: '' }); setErrors({}); setForm({ name: '', email: '', phone: '', cover_letter: '' }); }}
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
              <div
                key={r.id}
                className={`${styles.roleCard} ${selectedRole?.id === r.id ? styles.activeCard : ''}`}
                onClick={() => { setSelectedRole(r); setStatusMsg({ type: '', text: '' }); setErrors({}); setForm({ name: '', email: '', phone: '', cover_letter: '' }); }}
              >
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
