import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../AdminContext';
import { Plus, Users, Clock, BookOpen, X, Check, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const DEFAULT_CLASSES = [
  { id: 1, name: 'حلقة الفجر', teacher: 'الشيخ أسامة الجلودي', students: 22, time: 'بعد الفجر — 5:30 ص', level: 'متوسط وحافظ', color: '#2D1F0E' },
  { id: 2, name: 'حلقة الضحى', teacher: 'الشيخ همام النجار', students: 18, time: '9:00 ص — 11:00 ص', level: 'مبتدئ', color: '#C49B75' },
  { id: 3, name: 'حلقة الظهر', teacher: 'الشيخ حسن الجلودي', students: 25, time: 'بعد الظهر — 1:00 م', level: 'جميع المستويات', color: '#2980b9' },
  { id: 4, name: 'حلقة العصر', teacher: 'الشيخ همام النجار', students: 30, time: 'بعد العصر — 4:30 م', level: 'متقدم', color: '#8e44ad' },
  { id: 5, name: 'حلقة المغرب', teacher: 'الشيخ أسامة الجلودي', students: 28, time: 'بعد المغرب — 8:00 م', level: 'مبتدئ ومتوسط', color: '#e67e22' },
  { id: 6, name: 'حلقة العشاء', teacher: 'الشيخ حسن الجلودي', students: 20, time: 'بعد العشاء — 9:30 م', level: 'الأشبال', color: '#B8860B' },
];

export default function Circles() {
  const { admin } = useAdminContext();
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('circle_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CLASSES;
      }
    }
    localStorage.setItem('circle_records', JSON.stringify(DEFAULT_CLASSES));
    return DEFAULT_CLASSES;
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', teacher: '', time: '', level: '' });

  // Automatically sync form default teacher for sheikh
  useEffect(() => {
    if (admin) {
      setForm(prev => ({
        ...prev,
        teacher: admin.name
      }));
    }
  }, [admin]);

  // Load all sheikhs for Super Admin circle assignments
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

  const handleAdd = () => {
    if (!form.name || !form.time) {
      alert("الرجاء إدخال اسم الحلقة ووقتها!");
      return;
    }
    const newCircle = {
      id: Date.now(),
      name: form.name,
      teacher: admin && admin.role === 'admin' ? admin.name : form.teacher || sheikhsList[0],
      time: form.time,
      level: form.level || 'جميع المستويات',
      students: 0,
      color: ['#2D1F0E', '#C49B75', '#2980b9', '#8e44ad', '#e67e22', '#B8860B'][classes.length % 6]
    };

    const updated = [...classes, newCircle];
    setClasses(updated);
    localStorage.setItem('circle_records', JSON.stringify(updated));

    // Log the event for super admin
    try {
      axios.post('/api/log-action', {
        action: 'إضافة حلقة',
        details: `قام ${admin.name} بإنشاء حلقة جديدة: "${form.name}" بإشراف "${newCircle.teacher}"`
      });
    } catch (e) {}

    setForm({ name: '', teacher: admin ? admin.name : '', time: '', level: '' });
    setShowAdd(false);
  };

  // Filter circles to display only supervised ones for regular Sheikhs
  const filtered = classes.filter(c => {
    if (admin && admin.role === 'admin') {
      const normalName = admin.name.toLowerCase().trim();
      const circleTeacher = String(c.teacher || '').toLowerCase().trim();
      return normalName.includes(circleTeacher) || circleTeacher.includes(normalName);
    }
    return true; // Super Admin sees all
  });

  const totalStudents = filtered.reduce((s, c) => s + c.students, 0);

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
            حلقات تحفيظ القرآن الكريم
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem' }}>
            {admin?.role === 'super_admin' ? `${filtered.length} حلقات تحفيظ نشطة • ${totalStudents} طالب مسجّل إجمالياً` : `أنت تشرف على ${filtered.length} حلقات قرآنية نشطة`}
          </p>
        </div>
        
        {admin?.role === 'super_admin' && (
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, var(--admin-accent), #a47c4f)',
            color: 'var(--admin-bg)', border: 'none', borderRadius: '12px',
            padding: '14px 24px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(196,164,132,0.25)',
          }}>
            <Plus size={18} />
            إضافة حلقة جديدة للمسجد
          </button>
        )}
      </div>

      {/* Add Circle Modal (Super Admin only) */}
      {showAdd && admin?.role === 'super_admin' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--admin-card)', borderRadius: '24px', padding: '40px',
            width: '100%', maxWidth: '465px', direction: 'rtl',
            border: '1px solid var(--admin-border)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Amiri', serif", color: 'var(--admin-accent)', margin: 0, fontSize: '1.6rem' }}>
                إنشاء حلقة تحفيظ جديدة
              </h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>اسم الحلقة</label>
                <input
                  type="text" placeholder="مثال: حلقة الفجر"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>الشيخ المحفظ المشرف</label>
                <select
                  value={form.teacher} onChange={e => setForm(p => ({ ...p, teacher: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#fff', cursor: 'pointer' }}
                >
                  {sheikhsList.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>موعد حلقة التسميع</label>
                <input
                  type="text" placeholder="مثال: بعد العصر — 4:30 م"
                  value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>مستوى حلقة الطلاب</label>
                <input
                  type="text" placeholder="مثال: مبتدئ / متوسط / متقدم / حافظ"
                  value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
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
                <Check size={18} /> إنشاء حلقة جديدة
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

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px',
      }}>
        {filtered.map((c) => (
          <div key={c.id} style={{
            background: 'var(--admin-card)',
            borderRadius: '24px',
            border: '1px solid var(--admin-border)',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = `0 16px 40px ${c.color}35`;
            e.currentTarget.style.borderColor = c.color;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = 'var(--admin-border)';
          }}
          >
            {/* Top color bar */}
            <div style={{ height: '6px', background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />

            <div style={{ padding: '28px' }}>
              {/* Title + icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Amiri', serif", fontSize: '1.45rem', color: c.color, margin: '0 0 6px 0', fontWeight: 'bold' }}>
                    {c.name}
                  </h3>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.88rem', fontWeight: 'bold' }}>المشرف: {c.teacher}</p>
                </div>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  background: c.color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={22} color={c.color} />
                </div>
              </div>

              {/* Info rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                  <Clock size={16} color={c.color} />
                  {c.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                  <Users size={16} color={c.color} />
                  {c.students} طالب مسجّل حالياً
                </div>
              </div>

              {/* Level badge & Progress Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                  background: c.color + '15', color: c.color,
                }}>
                  المستوى: {c.level}
                </span>
                {/* Visual Progress/Capacity bar */}
                <div style={{ width: '90px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${Math.min((c.students / 35) * 100, 100)}%`,
                    background: c.color, borderRadius: '5px'
                  }} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', color: '#888' }}>
            <ShieldAlert size={48} style={{ opacity: 0.3, marginBottom: '15px', color: 'var(--admin-accent)' }} />
            <p style={{ fontSize: '1.1rem' }}>لا توجد أي حلقات مسجلة باسمك حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
