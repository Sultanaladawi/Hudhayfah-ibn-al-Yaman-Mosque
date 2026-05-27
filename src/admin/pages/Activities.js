import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../AdminContext';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, MapPin, Clock, Download, Calendar, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DEFAULT_VACANCIES = [
  { id: 1, title: 'مسابقة القرآن الكريم الرمضانية الكبرى', type: 'مسابقة عامة', location: 'مصلى المسجد الرئيسي', description: 'المسابقة السنوية الكبرى لحفظ أجزاء من كتاب الله تعالى مع رصد جوائز قيمة للفائزين الأوائل في كافة المستويات التمهيدية والمتقدمة.', active: 1, created_at: new Date().toISOString() },
  { id: 2, title: 'رحلة عمرة الربيع لطلاب الحلقات الحافظين', type: 'رحلة إيمانية', location: 'مكة المكرمة والمدينة المنورة', description: 'رحلة العمرة التشجيعية المخصصة لطلاب حلقات التحفيظ الذين أتموا حفظ 5 أجزاء فأكثر خلال الفصل الحالي تقديراً لهم وبثاً للهمة.', active: 1, created_at: new Date().toISOString() },
  { id: 3, title: 'دورة تأهيل مخارج الحروف وأحكام الترتيل', type: 'دورة علمية', location: 'مكتبة المسجد الأرضية', description: 'دورة مكثفة برواية حفص عن عاصم تستهدف تصحيح التلاوة وتأصيل مخارج الحروف للطلاب وأهالي الحي بإشراف كوكبة من مشايخنا.', active: 1, created_at: new Date().toISOString() },
  { id: 4, title: 'حفل تكريم وإكرام حفظة كتاب الله تعالى', type: 'احتفالية إيمانية', location: 'ساحة المسجد الخارجية / قاعة التكريم', description: 'المهرجان الاحتفالي السنوي لتوزيع الدروع الذهبية والإكرامات النقدية والعينية على الطلاب الأوائل وأولياء أمورهم الفضلاء.', active: 1, created_at: new Date().toISOString() }
];

export default function Activities() {
  const { admin } = useAdminContext();
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('activity_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_VACANCIES;
      }
    }
    localStorage.setItem('activity_records', JSON.stringify(DEFAULT_VACANCIES));
    return DEFAULT_VACANCIES;
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'مسابقة عامة',
    location: 'المسجد',
    description: '',
    active: 1
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/careers');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setJobs(res.data);
        localStorage.setItem('activity_records', JSON.stringify(res.data));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const exportPDF = async () => {
    try {
      if (jobs.length === 0) {
        alert("لا يوجد فعاليات لتصديرها.");
        return;
      }

      await axios.post('/api/log-action', { 
        action: 'تصدير PDF', 
        details: 'قام المشرف بتصدير كشف فعاليات وأنشطة المسجد إلى PDF.' 
      });

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(45, 41, 38);
      doc.text('Mosque Activities & Announcements Record', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Amman' })}`, 14, 32);
      doc.text('Official log of educational circles events and active community programs.', 14, 38);

      const tableColumn = ["Event Title", "Category / Type", "Location", "Announced Date"];
      const tableRows = jobs.map(job => [
        job.title || 'Untitled',
        job.type || 'N/A',
        job.location || 'N/A',
        new Date(job.created_at || Date.now()).toLocaleDateString('en-GB', { timeZone: 'Asia/Amman' })
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [24, 69, 59], textColor: [255, 255, 255] }
      });
      doc.save(`Mosque_Activities_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error generating PDF: " + error.message);
    }
  };

  const handleOpenModal = (mode, job = null) => {
    setModalMode(mode);
    if (mode === 'edit' && job) {
      setCurrentId(job.id);
      setFormData({
        title: job.title,
        type: job.type,
        location: job.location,
        description: job.description,
        active: job.active
      });
    } else {
      setFormData({ title: '', type: 'مسابقة عامة', location: 'مصلى المسجد الرئيسي', description: '', active: 1 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedJobs = [...jobs];
    
    if (modalMode === 'add') {
      const newAct = {
        id: Date.now(),
        title: formData.title,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        active: 1,
        created_at: new Date().toISOString()
      };
      updatedJobs.unshift(newAct);
    } else {
      updatedJobs = updatedJobs.map(j => j.id === currentId ? {
        ...j,
        title: formData.title,
        type: formData.type,
        location: formData.location,
        description: formData.description
      } : j);
    }

    setJobs(updatedJobs);
    localStorage.setItem('activity_records', JSON.stringify(updatedJobs));
    setShowModal(false);

    // Save to server database in background
    try {
      if (modalMode === 'add') {
        await axios.post('/api/careers', formData);
      } else {
        await axios.put(`/api/careers/${currentId}`, formData);
      }
      fetchJobs();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا النشاط/الفعالية؟")) {
      const updatedJobs = jobs.filter(j => j.id !== id);
      setJobs(updatedJobs);
      localStorage.setItem('activity_records', JSON.stringify(updatedJobs));

      try {
        await axios.delete(`/api/careers/${id}`);
      } catch (err) {}
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--admin-border)', color: '#fff', outline: 'none', marginBottom: '15px',
    textAlign: 'right', direction: 'rtl'
  };

  return (
    <div className="dashboard-fade-in" style={{ 
      color: '#fff', 
      backgroundColor: 'transparent', 
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
          <h1 style={{ fontFamily: "'Amiri', serif", fontSize: '2.5rem', color: 'var(--admin-accent)', margin: '0 0 6px 0', lineHeight: 1 }}>
            لوحة الأنشطة والفعاليات الإيمانية
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 500, marginTop: '5px' }}>
            إدارة مسابقات القرآن الكريم، الرحلات الترفيهية للطلاب، وحفلات التكريم السنوية.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={exportPDF}
            style={{ 
              backgroundColor: 'rgba(196, 164, 132, 0.1)', 
              color: 'var(--admin-accent)', 
              border: `1px solid var(--admin-accent)`, 
              padding: '14px 28px', borderRadius: '14px', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              transition: '0.3s'
            }}>
            <Download size={20} /> تصدير الفعاليات
          </button>
          
          {admin?.role === 'super_admin' && (
            <button onClick={() => handleOpenModal('add')} style={{ backgroundColor: 'var(--admin-accent)', color: 'var(--admin-bg)', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(196, 164, 132, 0.2)' }}>
              <Plus size={20} /> إضافة نشاط/فعالية جديدة
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && admin?.role === 'super_admin' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: 'var(--admin-card)', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '40px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
              <h2 style={{ color: 'var(--admin-accent)', margin: 0, fontFamily: 'Amiri' }}>إعلان عن فعالية/نشاط جديد</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>اسم النشاط / الفعالية</label>
              <input style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="مثال: مسابقة حفظ سورة البقرة الكبرى" />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>تصنيف الفعالية</label>
                  <select 
                    style={{ ...inputStyle, backgroundColor: '#1a1a1a', cursor: 'pointer' }} 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="مسابقة عامة">مسابقة عامة</option>
                    <option value="رحلة إيمانية">رحلة إيمانية</option>
                    <option value="دورة علمية">دورة علمية</option>
                    <option value="احتفالية إيمانية">احتفالية إيمانية</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>مكان الفعالية</label>
                  <input style={inputStyle} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="مثال: مصلى المسجد الرئيسي" />
                </div>
              </div>

              <label style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>تفاصيل النشاط والإعلان</label>
              <textarea style={{ ...inputStyle, minHeight: '100px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="اكتب وصفاً شاملاً للفعالية ومواعيد التسميع أو التجمع..." />

              <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--admin-accent)', color: 'var(--admin-bg)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Tajawal', fontSize: '1rem' }}>
                {modalMode === 'add' ? 'نشر الإعلان والفعالية' : 'تحديث بيانات الإعلان'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Mosque Activities */}
      {loading ? (
        <div style={{ color: 'var(--admin-accent)', padding: '100px', textAlign: 'center' }}>جاري تحميل لوحة الأنشطة والفعاليات...</div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
          {jobs.length > 0 ? jobs.map(job => (
            <div key={job.id} className="premium-row" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '24px', 
              padding: '35px', 
              border: `1px solid rgba(196, 164, 132, 0.15)`, 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {admin?.role === 'super_admin' && (
                <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleOpenModal('edit', job)} style={{ background: 'rgba(196,164,132,0.1)', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: '0.3s' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(job.id)} style={{ background: 'rgba(220,53,69,0.1)', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: '0.3s' }}><Trash2 size={16} /></button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ background: 'rgba(24, 69, 59, 0.15)', padding: '18px', borderRadius: '20px', border: '1px solid rgba(196, 164, 132, 0.1)' }}>
                  <Calendar color="var(--admin-accent)" size={28} />
                </div>
                <div style={{ paddingLeft: '50px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontFamily: "'Amiri', serif" }}>{job.title}</h3>
                  <div style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', marginTop: '5px', fontFamily: 'Tajawal' }}>
                    <Sparkles size={13} style={{ marginLeft: '5px', display: 'inline-block' }} /> {job.type}
                  </div>
                </div>
              </div>

              <div style={{ color: '#aaa', fontSize: '0.92rem', marginBottom: '25px', display: 'flex', gap: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="var(--admin-accent)" /> {job.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="var(--admin-accent)" /> {new Date(job.created_at || Date.now()).toLocaleDateString('ar-JO')}</span>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(196, 164, 132, 0.2) 0%, transparent 100%)', marginBottom: '25px' }}></div>
              
              <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: '1.7', margin: 0, opacity: 0.9, textAlign: 'right', flexGrow: 1 }}>{job.description}</p>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', backgroundColor: 'var(--admin-card)', borderRadius: '30px', border: `1px dashed var(--admin-border)` }}>
              <Calendar size={48} color="var(--admin-border)" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: 'var(--admin-accent)', fontSize: '1.5rem' }}>لا توجد أنشطة معلنة حالياً</h3>
              <p style={{ color: '#777' }}>اضغط على "إضافة فعالية جديدة" لنشر أول إعلان بالمسجد.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
