import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../AdminContext';
import { UserPlus, Search, Phone, BookOpen, X, Check, ShieldAlert } from 'lucide-react';

const DEFAULT_STUDENTS = [
  { id: 1, name: 'أحمد محمد الزعبي', age: 12, group: 'حلقة الفجر', teacher: 'الشيخ أسامة الجلودي', progress: 'جزء عم', status: 'منتظم', phone: '0791234567' },
  { id: 2, name: 'عمر سعيد الحموي', age: 14, group: 'حلقة العصر', teacher: 'الشيخ همام النجار', progress: 'الجزء الثاني', status: 'منتظم', phone: '0792345678' },
  { id: 3, name: 'يوسف خالد النمر', age: 11, group: 'حلقة الظهر', teacher: 'الشيخ حسن الجلودي', progress: 'جزء تبارك', status: 'غياب متكرر', phone: '0793456789' },
  { id: 4, name: 'إبراهيم راشد السلمان', age: 13, group: 'حلقة الفجر', teacher: 'الشيخ أسامة الجلودي', progress: 'الجزء الخامس', status: 'منتظم', phone: '0794567890' },
  { id: 5, name: 'محمد عبد الله الشمري', age: 10, group: 'حلقة العصر', teacher: 'الشيخ همام النجار', progress: 'جزء عم', status: 'جديد', phone: '0795678901' },
  { id: 6, name: 'زياد أحمد الدوسري', age: 15, group: 'حلقة الظهر', teacher: 'الشيخ حسن الجلودي', progress: 'الجزء العاشر', status: 'منتظم', phone: '0796789012' },
];

const STATUS_STYLE = {
  'منتظم':        { bg: 'rgba(201,168,76,0.12)',  color: '#B8860B' },
  'غياب متكرر':  { bg: 'rgba(231,76,60,0.12)',  color: '#e74c3c' },
  'جديد':         { bg: 'rgba(196,155,117,0.15)', color: '#C49B75' },
};

export default function Students() {
  const { admin } = useAdminContext();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('student_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STUDENTS;
      }
    }
    localStorage.setItem('student_records', JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  });

  const [form, setForm] = useState({
    name: '',
    age: '',
    group: '',
    teacher: admin ? admin.name : '',
    phone: ''
  });

  // Automatically sync form's default teacher field based on logged in admin
  useEffect(() => {
    if (admin) {
      setForm(prev => ({
        ...prev,
        teacher: admin.name
      }));
    }
  }, [admin]);

  // Load all Sheikhs from local storage to list them in the dropdown
  const [sheikhsList, setSheikhsList] = useState([]);
  useEffect(() => {
    const defaultSheikhs = [
      'الشيخ أسامة الجلودي',
      'الشيخ همام النجار',
      'الشيخ حسن الجلودي',
      'الشيخ حمزة أبو الرب',
      'الشيخ براء الجلودي',
      'الشيخ مصعب الجلودي',
      'الشيخ همام ربابعة',
      'الشيخ أحمد زقيرات',
      'الشيخ عبد الله زيادة'
    ];
    const saved = localStorage.getItem('sheikhs_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = Array.from(new Set([...defaultSheikhs, ...parsed.map(s => s.name)]));
        setSheikhsList(merged);
      } catch (e) {
        setSheikhsList(defaultSheikhs);
      }
    } else {
      setSheikhsList(defaultSheikhs);
    }
  }, []);

  // Filter students based on SEARCH query AND sheikh role permissions
  const filtered = students.filter(s => {
    // 1. Search Query filter
    const matchesSearch = s.name.includes(search) || s.group.includes(search) || s.teacher.includes(search);
    if (!matchesSearch) return false;

    // 2. Sheikh permissions filter: Regular sheikhs can ONLY see their own students!
    if (admin && admin.role === 'admin') {
      const normalName = admin.name.toLowerCase().trim();
      const studentTeacher = String(s.teacher || '').toLowerCase().trim();
      return normalName.includes(studentTeacher) || studentTeacher.includes(normalName);
    }
    
    // Super Admins can see everyone
    return true;
  });

  const handleAdd = () => {
    if (!form.name || !form.group) {
      alert("الرجاء تعبئة اسم الطالب والحلقة!");
      return;
    }
    const newStudent = {
      id: Date.now(),
      name: form.name,
      age: parseInt(form.age) || 12,
      group: form.group,
      teacher: admin && admin.role === 'admin' ? admin.name : form.teacher,
      progress: 'جزء عم',
      status: 'جديد',
      phone: form.phone || 'N/A'
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('student_records', JSON.stringify(updated));

    // Log this action for Super Admin's Team Activity log
    try {
      axios.post('/api/log-action', {
        action: 'إضافة طالب',
        details: `قام ${admin.name} بتسجيل الطالب "${form.name}" في "${form.group}"`
      });
    } catch (e) {}

    // Reset Form
    setForm({
      name: '',
      age: '',
      group: '',
      teacher: admin ? admin.name : '',
      phone: ''
    });
    setShowAdd(false);
  };

  const handleStatusChange = (studentId, newStatus) => {
    const updated = students.map(s => s.id === studentId ? { ...s, status: newStatus } : s);
    setStudents(updated);
    localStorage.setItem('student_records', JSON.stringify(updated));
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Amiri', 'Tajawal', sans-serif", backgroundColor: 'transparent', position: 'relative' }}>
      {/* Premium Background Elements */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% -20%, #1e2f1c 0%, #070504 70%)` }} />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <style>{`
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); z-index: 0; opacity: 0.04; animation: float 25s infinite alternate ease-in-out; }
        .orb-1 { width: 600px; height: 600px; background: #7A8E74; top: -200px; right: -100px; }
        .orb-2 { width: 500px; height: 500px; background: #1b3d2b; bottom: -100px; left: -100px; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontFamily: "'Amiri', serif", fontSize: '2.5rem', color: 'var(--admin-accent)', margin: '0 0 6px 0' }}>
            شاشة إدارة الطلاب
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem' }}>
            {admin?.role === 'super_admin' ? `إجمالي الطلاب المسجلين بالمسجد: ${students.length} طالب` : `أنت تستعرض طلاب حلقاتك فقط (المجموع: ${filtered.length} طالب)`}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, var(--admin-accent), #a47c4f)',
          color: 'var(--admin-bg)', border: 'none', borderRadius: '12px',
          padding: '14px 24px', cursor: 'pointer',
          fontSize: '1rem', fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(196,164,132,0.25)',
          transition: 'all 0.3s ease',
        }}>
          <UserPlus size={18} />
          إضافة طالب جديد للمسجد
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن طالب بالاسم أو الحلقة أو اسم الشيخ..."
            style={{
              width: '100%', padding: '12px 44px 12px 14px',
              border: '1px solid var(--admin-border)', borderRadius: '12px',
              fontSize: '0.9rem', outline: 'none', background: 'rgba(255,255,255,0.02)',
              color: '#fff', boxSizing: 'border-box', textAlign: 'right',
            }}
          />
        </div>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--admin-card)', borderRadius: '24px', padding: '40px',
            width: '100%', maxWidth: '485px', direction: 'rtl',
            border: '1px solid var(--admin-border)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Amiri', serif", color: 'var(--admin-accent)', margin: 0, fontSize: '1.6rem' }}>
                تسجيل طالب جديد بالحلقات
              </h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>اسم الطالب ثلاثياً</label>
                <input
                  type="text" placeholder="مثال: يوسف أحمد العمري"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>العمر</label>
                  <input
                    type="number" placeholder="العمر"
                    value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'center', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>الحلقة</label>
                  <input
                    type="text" placeholder="مثال: حلقة الفجر"
                    value={form.group} onChange={e => setForm(p => ({ ...p, group: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>الشيخ المشرف</label>
                {admin?.role === 'super_admin' ? (
                  <select
                    value={form.teacher} onChange={e => setForm(p => ({ ...p, teacher: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#fff', cursor: 'pointer' }}
                  >
                    {sheikhsList.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text" value={admin?.name} disabled
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.01)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>رقم هاتف ولي الأمر</label>
                <input
                  type="tel" placeholder="مثال: 079XXXXXXXX"
                  value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button onClick={handleAdd} style={{
                flex: 2, padding: '14px', background: 'var(--admin-accent)', color: 'var(--admin-bg)',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <Check size={18} /> تسجيل الطالب رسمياً
              </button>
              <button onClick={() => setShowAdd(false)} style={{
                flex: 1, padding: '14px', background: 'transparent', color: '#fff',
                border: '1px solid var(--admin-border)', borderRadius: '12px', cursor: 'pointer',
              }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table of Students */}
      <div style={{
        background: 'var(--admin-card)', borderRadius: '24px',
        border: '1px solid var(--admin-border)', overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--admin-border)' }}>
                {['#', 'الطالب كرمه الله', 'العمر', 'الحلقة القرآنية', 'المحفظ المشرف', 'التقدم الحالي', 'الحالة الحالية', 'هاتف ولي الأمر'].map(h => (
                  <th key={h} style={{
                    padding: '16px 20px', textAlign: 'right',
                    fontSize: '0.85rem', color: 'var(--admin-accent)',
                    fontWeight: '700', letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ transition: 'background 0.2s', borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '16px 20px', color: '#888', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--admin-accent) 0%, #a47c4f 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--admin-bg)', fontWeight: '800', fontSize: '1rem',
                        flexShrink: 0,
                      }}>
                        {s.name[0]}
                      </div>
                      <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#ccc', fontSize: '0.9rem' }}>{s.age} سنة</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--admin-accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      <BookOpen size={14} /> {s.group}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#ccc', fontSize: '0.9rem' }}>{s.teacher}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--admin-accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>{s.progress}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                        background: STATUS_STYLE[s.status]?.bg || 'rgba(255,255,255,0.05)',
                        color: STATUS_STYLE[s.status]?.color || '#fff',
                        border: 'none', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      <option value="منتظم" style={{ backgroundColor: '#1a1a1a', color: '#B8860B' }}>منتظم</option>
                      <option value="غياب متكرر" style={{ backgroundColor: '#1a1a1a', color: '#e74c3c' }}>غياب متكرر</option>
                      <option value="جديد" style={{ backgroundColor: '#1a1a1a', color: '#C49B75' }}>جديد</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <a href={`tel:${s.phone}`} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      color: 'var(--admin-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold'
                    }}>
                      <Phone size={14} /> {s.phone}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
            <ShieldAlert size={48} style={{ opacity: 0.3, marginBottom: '15px', color: 'var(--admin-accent)' }} />
            <p style={{ fontSize: '1.1rem' }}>لا توجد نتائج مطابقة لعملية البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
