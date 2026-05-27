import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../AdminContext';
import { ShoppingCart, Plus, Calendar, Star, DollarSign, Download, Award, X, Check } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DEFAULT_DONATIONS = [
  { id: 1, donor: 'المحسن أبو أحمد الفاضل', amount: 150, category: 'كفالة طلاب علم وحفظة القرآن', date: '2026-05-26', notes: 'كفالة شهرية لثلاثة طلاب متميزين من حلقات الفجر.' },
  { id: 2, donor: 'فاعل خير من المصلين', amount: 50, category: 'صيانة المسجد والأجهزة', date: '2026-05-25', notes: 'للمساهمة في صيانة أجهزة التكييف بالمسجد قبل الصيف.' },
  { id: 3, donor: 'الأخت أم يوسف الفاضلة', amount: 200, category: 'جوائز وإكرامات حفظة كتاب الله', date: '2026-05-24', notes: 'صدقة جارية مخصصة لشراء الدروع والمكافآت لحفل الختام الكوني.' },
  { id: 4, donor: 'محسن كريم من أهالي الحي', amount: 100, category: 'صندوق الزكاة والصدقات العام', date: '2026-05-23', notes: 'تبرع عام لدعم الأسر العفيفة في المنطقة.' }
];

export default function Donations() {
  const { admin } = useAdminContext();
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('donation_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DONATIONS;
      }
    }
    localStorage.setItem('donation_records', JSON.stringify(DEFAULT_DONATIONS));
    return DEFAULT_DONATIONS;
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ donor: '', amount: '', category: 'كفالة طلاب علم وحفظة القرآن', notes: '' });

  const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const handleAdd = () => {
    if (!form.donor || !form.amount) {
      alert("الرجاء إدخال اسم المتبرع ومبلغ التبرع!");
      return;
    }

    const newDonation = {
      id: Date.now(),
      donor: form.donor,
      amount: parseFloat(form.amount) || 0,
      category: form.category,
      date: new Date().toISOString().split('T')[0],
      notes: form.notes || 'لا يوجد ملاحظات'
    };

    const updated = [newDonation, ...donations];
    setDonations(updated);
    localStorage.setItem('donation_records', JSON.stringify(updated));

    // Audit logs for super admin
    try {
      axios.post('/api/log-action', {
        action: 'تبرع جديد',
        details: `قام ${admin.name} بتسجيل تبرع بقيمة ${form.amount} د.أ من "${form.donor}" لصالح "${form.category}"`
      });
    } catch (e) {}

    setForm({ donor: '', amount: '', category: 'كفالة طلاب علم وحفظة القرآن', notes: '' });
    setShowAdd(false);
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(45, 41, 38);
      doc.text('Mosque Donations & Charity Record', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, 32);
      doc.text('Official record of contributions and donations supporting Quran circles and maintenance.', 14, 38);

      const tableColumn = ["Donor Name", "Amount (JOD)", "Category / Purpose", "Contribution Date"];
      const tableRows = donations.map(d => [
        d.donor || 'Anonymous',
        `${d.amount} JOD`,
        d.category || 'General',
        d.date || 'N/A'
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [24, 69, 59], textColor: [255, 255, 255] }
      });
      doc.save(`Mosque_Donations_${Date.now()}.pdf`);
    } catch (error) {
      console.error(error);
    }
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
            سجل التبرعات والصدقات الجارية
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem' }}>
            إجمالي التبرعات والصدقات المسجلة: <b style={{ color: 'var(--admin-accent)', fontSize: '1.1rem' }}>{totalAmount} دينار أردني</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={exportPDF}
            style={{ 
              backgroundColor: 'rgba(196, 164, 132, 0.1)', 
              color: 'var(--admin-accent)', 
              border: `1px solid var(--admin-accent)`, 
              padding: '14px 24px', borderRadius: '12px', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
            }}>
            <Download size={18} /> تصدير السجل
          </button>

          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, var(--admin-accent), #a47c4f)',
            color: 'var(--admin-bg)', border: 'none', borderRadius: '12px',
            padding: '14px 24px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(196,164,132,0.25)',
          }}>
            <Plus size={18} />
            تسجيل تبرع جديد
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
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
                تسجيل تبرع وارد للمسجد
              </h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>اسم المتبرع (أو فاعل خير)</label>
                <input
                  type="text" placeholder="مثال: فاعل خير / أبو أحمد الفاضل"
                  value={form.donor} onChange={e => setForm(p => ({ ...p, donor: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>مبلغ التبرع (دينار)</label>
                  <input
                    type="number" placeholder="مثال: 50"
                    value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'center', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>الباب / الوجهة</label>
                  <select
                    value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#fff', cursor: 'pointer' }}
                  >
                    <option value="كفالة طلاب علم وحفظة القرآن">كفالة طلاب علم وحفظة القرآن</option>
                    <option value="صيانة المسجد والأجهزة">صيانة المسجد والأجهزة</option>
                    <option value="جوائز وإكرامات حفظة كتاب الله">جوائز وإكرامات حفظة كتاب الله</option>
                    <option value="صندوق الزكاة والصدقات العام">صندوق الزكاة والصدقات العام</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>ملاحظات / تفاصيل</label>
                <textarea
                  placeholder="ملاحظات حول التبرع (اختياري)..."
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--admin-border)', borderRadius: '10px', fontSize: '0.92rem', textAlign: 'right', outline: 'none', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', minHeight: '80px', resize: 'vertical' }}
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
                <Check size={18} /> تسجيل تبرع وارد
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

      {/* Donations List */}
      <div style={{
        background: 'var(--admin-card)', borderRadius: '24px',
        border: '1px solid var(--admin-border)', overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--admin-border)' }}>
                {['#', 'اسم المتبرع الكريم', 'المبلغ (د.أ)', 'باب التبرع / الوجهة', 'تاريخ الاستلام', 'ملاحظات'].map(h => (
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
              {donations.map((d, i) => (
                <tr key={d.id} style={{ transition: 'background 0.2s', borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '16px 20px', color: '#888', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'rgba(196,164,132,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--admin-accent)', fontWeight: '800', fontSize: '1rem',
                        flexShrink: 0,
                      }}>
                        <Award size={18} />
                      </div>
                      <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{d.donor}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--admin-accent)', fontSize: '1rem', fontWeight: 'bold' }}>{d.amount} د.أ</td>
                  <td style={{ padding: '16px 20px', color: '#ccc', fontSize: '0.9rem', fontWeight: 'bold' }}>{d.category}</td>
                  <td style={{ padding: '16px 20px', color: '#aaa', fontSize: '0.88rem' }}>{d.date}</td>
                  <td style={{ padding: '16px 20px', color: '#999', fontSize: '0.85rem' }}>{d.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
