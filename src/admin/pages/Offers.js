import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Plus, Trash2, Calendar, Sparkles, X, Edit2, Download, BookOpen, Star } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    product_name: '', // Student/Class Name
    discount_percent: '', // Mastery Grade %
    reason: '', // Memorization milestone / Achievement
    end_date: '', // Achievement Date
    active: 1
  });

  const colors = {
    bg: 'var(--admin-bg)',
    card: 'var(--admin-card)',
    accent: 'var(--admin-accent)',
    text: '#ffffff',
    border: 'var(--admin-border)',
    input: 'rgba(255,255,255,0.04)'
  };

  const DEFAULT_ACHIEVEMENTS = [
    { id: 1, product_name: 'أحمد محمد الزعبي', discount_percent: 100, reason: 'أتم حفظ سورة البقرة كاملاً بتميز وإتقان', end_date: '2026-05-26', active: 1 },
    { id: 2, product_name: 'حلقة الفجر بقيادة الشيخ أسامة الطراونة', discount_percent: null, reason: 'الحلقة النموذجية المتميزة لهذا الأسبوع لمواظبتها على الترتيل والحضور', end_date: '2026-05-26', active: 1 },
    { id: 3, product_name: 'يوسف عمر أحمد', discount_percent: 98, reason: 'أتم حفظ جزء عمّ بالتجويد والترتيل بتقدير ممتاز', end_date: '2026-05-26', active: 1 },
    { id: 4, product_name: 'عبدالرحمن خالد', discount_percent: 95, reason: 'اجتاز اختبار حفظ 5 أجزاء متتالية بتقدير ممتاز جداً', end_date: '2026-05-26', active: 1 },
    { id: 5, product_name: 'سند عمار البيطار', discount_percent: 100, reason: 'الفائز الأول في مسابقة الأذان لطلاب الحلقات التمهيدية', end_date: '2026-05-26', active: 1 },
    { id: 6, product_name: 'حلقة العصر بقيادة الشيخ معاذ الضمور', discount_percent: null, reason: 'حققت أعلى نسبة حضور وانضباط في الحفظ هذا الشهر', end_date: '2026-05-26', active: 1 }
  ];

  const isCoffeeItem = (item) => {
    const name = String(item.product_name || item.name || '').toLowerCase();
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

  const fetchOffers = async () => {
    setLoading(true);
    // 1. Try to load from localStorage first for instant response
    const saved = localStorage.getItem('student_honors');
    let localData = DEFAULT_ACHIEVEMENTS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude any coffee items from localStorage too
        const filteredLocal = parsed.filter(item => !isCoffeeItem(item));
        if (filteredLocal.length > 0) {
          localData = filteredLocal.map(p => ({
            id: p.id,
            product_name: p.name || p.product_name,
            discount_percent: p.grade !== undefined ? p.grade : p.discount_percent,
            reason: p.reason,
            end_date: p.date || p.end_date,
            active: p.active ?? 1
          }));
        } else {
          localData = DEFAULT_ACHIEVEMENTS;
          localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
        }
      } catch (e) {
        localData = DEFAULT_ACHIEVEMENTS;
      }
    } else {
      localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }
    setOffers(localData);
    setLoading(false);

    // 2. Try to fetch from API in background
    try {
      const res = await axios.get('/api/offers');
      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(item => !isCoffeeItem(item));
        if (filtered.length > 0) {
          setOffers(filtered);
          localStorage.setItem('student_honors', JSON.stringify(filtered));
        } else {
          // If the DB only has old coffee items, fall back to our beautiful achievements
          setOffers(DEFAULT_ACHIEVEMENTS);
          localStorage.setItem('student_honors', JSON.stringify(DEFAULT_ACHIEVEMENTS));
        }
      }
    } catch (err) {
      // Ignore API errors, stay with localStorage
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenModal = (mode, offer = null) => {
    setModalMode(mode);
    if (mode === 'edit' && offer) {
      setCurrentId(offer.id);
      const formattedDate = offer.end_date ? new Date(offer.end_date).toISOString().split('T')[0] : '';
      setFormData({
        product_name: offer.product_name || '',
        discount_percent: offer.discount_percent || '',
        reason: offer.reason || '',
        end_date: formattedDate,
        active: offer.active ?? 1
      });
    } else {
      setFormData({
        product_name: '',
        discount_percent: '',
        reason: '',
        end_date: new Date().toISOString().split('T')[0],
        active: 1
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPercent = formData.discount_percent ? parseInt(formData.discount_percent) : null;
    
    // 1. Update localStorage instantly
    let updatedOffers = [...offers];
    if (modalMode === 'add') {
      const newHonor = {
        id: Date.now(), // Unique local ID
        product_name: formData.product_name,
        discount_percent: cleanPercent,
        reason: formData.reason,
        end_date: formData.end_date,
        active: 1
      };
      updatedOffers.unshift(newHonor);
    } else {
      updatedOffers = updatedOffers.map(o => o.id === currentId ? {
        ...o,
        product_name: formData.product_name,
        discount_percent: cleanPercent,
        reason: formData.reason,
        end_date: formData.end_date
      } : o);
    }
    
    setOffers(updatedOffers);
    localStorage.setItem('student_honors', JSON.stringify(updatedOffers));
    // Dispatch custom event to notify Navbar.js instantly in same window
    window.dispatchEvent(new Event('honors_updated'));
    setShowModal(false);

    // 2. Try to update database in background
    try {
      if (modalMode === 'add') {
        await axios.post('/api/offers', formData);
      } else {
        await axios.put(`/api/offers/${currentId}`, formData);
      }
      fetchOffers(); // Refresh from DB if connected
    } catch (err) {
      // Ignore background error, it stays in localStorage!
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الإنجاز/التكريم؟")) {
      // 1. Update localStorage instantly
      const updatedOffers = offers.filter(o => o.id !== id);
      setOffers(updatedOffers);
      localStorage.setItem('student_honors', JSON.stringify(updatedOffers));
      // Dispatch custom event to notify Navbar.js instantly
      window.dispatchEvent(new Event('honors_updated'));

      // 2. Try to update database in background
      try {
        await axios.delete(`/api/offers/${id}`);
      } catch (err) {
        // Ignore background error
      }
    }
  };

  const exportPDF = async () => {
    try {
      if (offers.length === 0) {
        alert("لا يوجد إنجازات لتصديرها.");
        return;
      }

      await axios.post('/api/log-action', { 
        action: 'Export PDF', 
        details: 'قام المسؤول بتصدير لوحة شرف إنجازات الطلاب إلى PDF.' 
      });

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(45, 41, 38);
      doc.text('Quran Academy - Student Honors Board', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Amman' })}`, 14, 32);
      doc.text('Official record of student achievements, memorization milestones, and honors.', 14, 38);

      const tableColumn = ["Student / Group Name", "Mastery %", "Memorization Achievement", "Honor Date"];
      const tableRows = offers.map(o => [
        o.product_name || 'N/A',
        o.discount_percent ? `${o.discount_percent}%` : 'Outstanding',
        o.reason || 'No description',
        o.end_date ? new Date(o.end_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Amman' }) : 'Continuous'
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [122, 142, 116], textColor: [255, 255, 255] }
      });
      doc.save(`Academy_Student_Honors_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error generating PDF: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "مستمر";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "تاريخ غير صالح"; 
    return date.toLocaleDateString('ar-JO', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: colors.input,
    border: `1px solid ${colors.border}`,
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: '0.3s',
    textAlign: 'right',
    direction: 'rtl'
  };

  const labelStyle = {
    display: 'block',
    color: colors.accent,
    marginBottom: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'right'
  };

  return (
    <div className="dashboard-fade-in" style={{ 
      color: '#fff', 
      backgroundColor: colors.bg, 
      minHeight: '100vh', 
      padding: '40px 10px 40px 5px',
      position: 'relative',
      direction: 'rtl',
      fontFamily: "'Amiri', 'Tajawal', sans-serif"
    }}>
      {/* Premium Background Elements */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% -20%, #1e2f1c 0%, #070504 70%)` }} />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <style>{`
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); z-index: 0; opacity: 0.04; animation: float 25s infinite alternate ease-in-out; }
        .orb-1 { width: 600px; height: 600px; background: #7A8E74; top: -200px; right: -100px; }
        .orb-2 { width: 500px; height: 500px; background: #1b3d2b; bottom: -100px; left: -100px; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }
        .page-badge { background: #131c12; border: 1px solid var(--admin-border); padding: 12px 25px; border-radius: 18px; display: inline-flex; align-items: center; gap: 12px; margin: 20px 0; }
        .page-badge span { font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
        .premium-row {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          cursor: pointer;
        }
        .premium-row:hover {
          background-color: rgba(122, 142, 116, 0.12) !important;
          transform: translateY(-5px) scale(1.005) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important;
          border-color: rgba(122, 142, 116, 0.5) !important;
          position: relative;
          z-index: 10;
        }
      `}</style>
      
      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: colors.card, width: '100%', maxWidth: '500px', borderRadius: '24px', border: `1px solid ${colors.border}`, padding: '40px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '25px', left: '25px', backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
              <X size={24} />
            </button>
            <h2 style={{ color: '#fff', margin: '0 0 30px 0', fontFamily: "'Amiri', serif", textAlign: 'right' }}>
              {modalMode === 'add' ? 'إضافة إنجاز لطالب (لوحة الشرف)' : 'تعديل بيانات الإنجاز'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>اسم الطالب أو الحلقة</label>
                <input 
                  style={inputStyle} 
                  value={formData.product_name} 
                  onChange={e => setFormData({...formData, product_name: e.target.value})} 
                  placeholder="مثال: الطالب أحمد محمد الزعبي / حلقة الفجر" required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>نسبة الحفظ والإتقان %</label>
                  <input 
                    type="number" style={inputStyle} 
                    value={formData.discount_percent} 
                    onChange={e => setFormData({...formData, discount_percent: e.target.value})} 
                    placeholder="مثال: 100 أو 95 (اختياري)"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>تاريخ الإنجاز والتكريم</label>
                  <input 
                    type="date"
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'center' }} 
                    value={formData.end_date} 
                    onChange={e => setFormData({...formData, end_date: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>تفاصيل ما تم حفظه وإنجازه</label>
                <textarea 
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})} 
                  placeholder="مثال: أتم حفظ سورة البقرة كاملاً بتميز وإتقان وتلاوة خاشعة..." required
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 2, padding: '16px', backgroundColor: colors.accent, color: colors.bg, border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Tajawal' }}>
                  {modalMode === 'add' ? 'حفظ وإضافة للوحة الشرف' : 'تحديث البيانات'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', backgroundColor: 'transparent', color: '#fff', border: `1px solid ${colors.border}`, borderRadius: '15px', cursor: 'pointer', fontFamily: 'Tajawal' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontFamily: "'Amiri', serif", fontSize: '2.5rem', color: colors.accent, lineHeight: 1 }}>
            مسجد حذيفة بن اليمان
          </div>

          <div className="page-badge">
            <Award size={24} color={colors.accent} style={{ marginLeft: '10px' }} />
            <span>لوحة الشرف وإنجازات الطلاب</span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 500, marginTop: '5px' }}>
            التحكم بلوحة شرف إنجازات الطلاب وحفظهم للقرآن الكريم، والتي تظهر في شريط الشرف العلوي للموقع.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={exportPDF}
            style={{ 
              backgroundColor: 'rgba(196, 164, 132, 0.1)', 
              color: colors.accent, 
              border: `1px solid ${colors.accent}`, 
              padding: '14px 28px', borderRadius: '14px', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              transition: '0.3s',
              fontFamily: 'Tajawal'
            }}>
            <Download size={20} /> تصدير لوحة الشرف
          </button>
          <button 
            onClick={() => handleOpenModal('add')}
            style={{ backgroundColor: colors.accent, color: colors.bg, border: 'none', padding: '14px 28px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(196, 164, 132, 0.2)', fontFamily: 'Tajawal' }}>
            <Plus size={20} /> إضافة إنجاز جديد للوحة الشرف
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: colors.accent, padding: '100px' }}>
          <p>جاري تحميل لوحة الشرف وإنجازات الطلاب...</p>
        </div>
      ) : (
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px',
          alignItems: 'stretch'
        }}>
          {offers.length > 0 ? offers.map((offer) => (
            <div key={offer.id} className="premium-row" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '24px', 
              border: `1px solid rgba(196, 164, 132, 0.15)`,
              padding: '30px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'absolute', top: '25px', left: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleOpenModal('edit', offer)} style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', opacity: 0.7 }}>
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(offer.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.7 }}>
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: 'rgba(122, 142, 116, 0.15)', padding: '15px', borderRadius: '16px', height: 'fit-content' }}>
                  <BookOpen color="var(--olive-light)" size={24} />
                </div>
                <div style={{ flex: 1, paddingLeft: '45px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem', lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: "'Amiri', serif" }}>
                    {offer.product_name}
                  </h3>
                  <div style={{ color: colors.accent, fontSize: '0.95rem', fontWeight: 'bold', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Tajawal' }}>
                    <Star size={16} /> 
                    {offer.discount_percent ? `درجة الإتقان: ${offer.discount_percent}%` : 'إنجاز متميز'}
                  </div>
                </div>
              </div>

              <p style={{ color: '#bbb', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '30px', minHeight: '60px', flexGrow: 1, textAlign: 'right' }}>
                {offer.reason}
              </p>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '0.9rem', direction: 'rtl' }}>
                <Calendar size={16} />
                <span>تاريخ الإنجاز: <b style={{ color: colors.accent }}>{formatDate(offer.end_date)}</b></span>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', backgroundColor: colors.card, borderRadius: '24px', border: `1px dashed ${colors.border}` }}>
              <Award size={48} color={colors.border} style={{ marginBottom: '20px' }} />
              <h3 style={{ color: colors.accent, fontSize: '1.5rem' }}>لا يوجد إنجازات مسجلة بلوحة الشرف</h3>
              <p style={{ color: '#777' }}>اضغط على "إضافة إنجاز جديد" لإدراج أول إنجاز لطالب في لوحة الشرف.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Offers;