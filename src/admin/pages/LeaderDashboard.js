import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, ShieldAlert, User, Clock, Search, Filter, Download, UserPlus, Trash2 } from 'lucide-react';
import { useAdminContext } from '../AdminContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const LeaderDashboard = () => {
  const { admin } = useAdminContext();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Dynamic Sheikhs States
  const [showSheikhsModal, setShowSheikhsModal] = useState(false);
  const [sheikhs, setSheikhs] = useState(() => {
    const saved = localStorage.getItem('sheikhs_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSheikh, setNewSheikh] = useState({ name: '', email: '', pass: '', role: 'admin' });

  const colors = {
    espresso: 'var(--admin-bg)',
    bean: 'var(--admin-card)',
    crema: 'var(--admin-accent)',
    latte: 'var(--admin-text)',
    border: 'var(--admin-border)',
    input: '#12251f',
    gold: 'var(--admin-accent)'
  };

  useEffect(() => {
    if (admin && admin.role !== 'super_admin') {
      navigate('/admin/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [logsRes, reviewsRes, msgRes] = await Promise.all([
          axios.get('/api/admin-logs'),
          axios.get('/api/reviews'),
          axios.get('/api/contact-messages')
        ]);
        setLogs(logsRes.data);
        setFeedbacks(reviewsRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        console.error('Failed to fetch leader data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Auto refresh every 15s
    return () => clearInterval(interval);
  }, [admin, navigate]);

  const handleAddSheikh = () => {
    if (!newSheikh.name || !newSheikh.email || !newSheikh.pass) {
      alert("الرجاء تعبئة جميع الحقول!");
      return;
    }
    const updated = [...sheikhs, { ...newSheikh, email: newSheikh.email.toLowerCase().trim() }];
    setSheikhs(updated);
    localStorage.setItem('sheikhs_list', JSON.stringify(updated));
    setNewSheikh({ name: '', email: '', pass: '', role: 'admin' });
    alert("تم إضافة الحساب الجديد بنجاح!");
  };

  const handleDeleteSheikh = (email) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الحساب؟")) {
      const updated = sheikhs.filter(s => s.email !== email);
      setSheikhs(updated);
      localStorage.setItem('sheikhs_list', JSON.stringify(updated));
    }
  };

  const criticalFeedbacks = [
    ...(feedbacks || []).map(f => ({ ...f, type: `تقييم الطلاب`, comment: f.comment, reviewer_name: f.reviewer_name, rating: f.rating, created_at: f.created_at })),
    ...(messages || []).map(m => ({ ...m, type: 'تواصل الأهالي', comment: m.message, reviewer_name: m.name, rating: 1, created_at: m.created_at }))
  ].filter(f => {
    if (f.type === 'تقييم الطلاب') return f.rating <= 3; // 3 stars or below
    const badWords = ['bad', 'terrible', 'worst', 'awful', 'complaint', 'مشكلة', 'خطأ', 'سيء', 'ضعيف'];
    return badWords.some(word => f.comment?.toLowerCase().includes(word));
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredLogs = logs.filter(log => 
    log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ar-JO', { 
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Amman'
    });
  };

  const exportPDF = async () => {
    try {
      if (logs.length === 0) {
        alert("لا توجد سجلات نشاط للتصدير.");
        return;
      }

      await axios.post('/api/log-action', { 
        action: 'تصدير سجلات الإدارة', 
        details: `قام المشرف ${admin.name} بتصدير سجل نشاطات المشايخ بالكامل بصيغة PDF.` 
      });
      
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(45, 41, 38);
      doc.text('Mosque Management System - Team Activity Audit', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, 32);
      doc.text('Complete synchronization and transaction audit history.', 14, 38);
      
      const tableColumn = ["Timestamp", "Administrator", "Action", "Details"];
      const tableRows = filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString('en-GB'),
        log.admin_name || 'System',
        log.action,
        log.details
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { 
          fillColor: [24, 69, 59], 
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        }
      });

      const today = new Date().toISOString().split('T')[0];
      doc.save(`Mosque_AuditLog_${today}.pdf`);
    } catch (error) {
      alert("Error generating PDF: " + error.message);
    }
  };

  if (loading) {
    return <div style={{ color: colors.crema, textAlign: 'center', marginTop: '100px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'Tajawal', fontSize: '1.2rem' }}>جاري تجهيز لوحة الإدارة العامة والرقابة...</div>;
  }

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1500px', margin: '0 auto', direction: 'rtl', fontFamily: "'Amiri', 'Tajawal', sans-serif", backgroundColor: 'transparent', position: 'relative' }}>
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
      {/* Header Section */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: "'Amiri', serif", fontSize: '2.5rem', color: colors.crema, margin: '0 0 6px 0' }}>
            نشاطات المشايخ والمشرفين
          </h1>
          <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
            الرقابة الإشرافية الكونية | تتبع العمليات، إدارة الحسابات، وقنوات التواصل المباشر.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setShowSheikhsModal(true)}
            style={{
              backgroundColor: 'rgba(196, 164, 132, 0.15)', 
              color: 'var(--admin-accent)', 
              border: '1px solid var(--admin-accent)', 
              padding: '14px 28px', 
              borderRadius: '14px', 
              fontWeight: '900', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              transition: '0.3s', 
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <UserPlus size={20} /> إدارة حسابات المشايخ
          </button>

          <button 
            onClick={exportPDF}
            style={{
              backgroundColor: colors.crema, 
              color: '#111', 
              border: 'none', 
              padding: '14px 28px', 
              borderRadius: '14px', 
              fontWeight: '900', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              transition: '0.3s', 
              boxShadow: '0 10px 20px rgba(196, 164, 132, 0.2)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <Download size={20} /> تصدير سجل الرقابة PDF
          </button>
        </div>
      </div>

      {/* Critical Feedback Section */}
      {criticalFeedbacks.length > 0 && (
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
             <div style={{ width: '8px', height: '30px', backgroundColor: '#ff4d4d', borderRadius: '4px' }}></div>
             <h3 style={{
               color: '#fff', fontSize: '1.4rem', fontFamily: "'Tajawal', serif", margin: 0,
               display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold'
             }}>
               <AlertTriangle size={24} color="#ff4d4d" /> شكاوى وتنبيهات هامة من الأهالي والطلاب
             </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
            {criticalFeedbacks.slice(0, 6).map((item, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.08) 0%, rgba(20, 18, 16, 0.5) 100%)',
                border: '1px solid rgba(255, 77, 77, 0.2)',
                padding: '25px', borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: '0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.2)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.reviewer_name || 'فاعل خير'}</span>
                  <span style={{ color: '#ff4d4d', fontWeight: '900', fontSize: '1rem' }}>{item.rating} ⭐</span>
                </div>
                <div style={{ color: colors.crema, fontSize: '0.75rem', marginBottom: '12px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>
                  {item.type}
                </div>
                <p style={{ color: '#bbb', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{item.comment || 'لا يوجد تفاصيل'}"
                </p>
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#666', textAlign: 'left' }}>
                  {formatDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Activity Section */}
      <div style={{
        backgroundColor: 'var(--admin-card)',
        borderRadius: '32px',
        border: `1px solid var(--admin-border)`,
        padding: '30px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        zIndex: 1,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
          <h3 style={{ margin: 0, color: colors.latte, fontSize: '1.6rem', fontFamily: "'Amiri', serif", display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Activity size={24} color={colors.crema} /> كشف نشاطات وعمليات المشايخ اليومية
          </h3>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '15px', 
            backgroundColor: colors.input, padding: '12px 25px', 
            borderRadius: '16px', border: `1px solid rgba(196, 164, 132, 0.15)`,
            transition: '0.3s'
          }}>
            <Search size={20} color="#666" />
            <input
              type="text"
              placeholder="البحث في العمليات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '300px', fontSize: '0.95rem', textAlign: 'right' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: colors.latte, textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '20px', color: colors.crema, fontSize: '0.85rem', fontWeight: '700' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> التاريخ والوقت</div>
                </th>
                <th style={{ padding: '20px', color: colors.crema, fontSize: '0.85rem', fontWeight: '700' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> الشيخ / المسؤول</div>
                </th>
                <th style={{ padding: '20px', color: colors.crema, fontSize: '0.85rem', fontWeight: '700' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> نوع العملية</div>
                </th>
                <th style={{ padding: '20px', color: colors.crema, fontSize: '0.85rem', fontWeight: '700' }}>تفاصيل المعاملة</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    className="premium-row"
                    onMouseEnter={() => setHoveredRow(log.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                      borderBottom: `1px solid ${colors.border}`, 
                      transition: '0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
                      cursor: 'default',
                    }}
                  >
                    <td style={{ 
                      padding: '20px', 
                      color: hoveredRow === log.id ? colors.crema : '#888', 
                      fontSize: '0.85rem', fontWeight: '600',
                      transition: '0.3s'
                    }}>
                      {formatDate(log.created_at)}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', 
                          background: 'linear-gradient(135deg, var(--admin-accent), #8a6c4f)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111',
                          fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 5px 15px rgba(0,0,0,0.4)'
                        }}>
                          {log.admin_name ? log.admin_name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>{log.admin_name || 'المشرف العام'}</div>
                          <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '2px' }}>{log.admin_email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        backgroundColor: 'rgba(196, 164, 132, 0.1)', 
                        border: `1px solid ${hoveredRow === log.id ? colors.crema : 'rgba(196, 164, 132, 0.2)'}`,
                        color: colors.crema, 
                        padding: '8px 16px', borderRadius: '10px', 
                        fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', 
                        textTransform: 'uppercase', transition: '0.3s',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '20px', 
                      color: hoveredRow === log.id ? '#fff' : '#aaa', 
                      fontSize: '0.95rem', lineHeight: '1.5',
                      transition: '0.3s'
                    }}>
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#555', fontSize: '1.1rem', fontStyle: 'italic' }}>
                    لا توجد سجلات نشاط تذكر حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sheikhs Modal */}
      {showSheikhsModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--admin-card)', borderRadius: '24px', padding: '40px',
            width: '100%', maxWidth: '650px', direction: 'rtl',
            border: '1px solid var(--admin-border)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
            maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Tajawal', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontFamily: "'Amiri', serif", color: 'var(--admin-accent)', margin: 0, fontSize: '1.8rem' }}>
                إدارة وإضافة حسابات المشايخ والمعلمين
              </h2>
              <button onClick={() => setShowSheikhsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.5rem' }}>
                ✕
              </button>
            </div>

            {/* Add Sheikh Form */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '18px',
              border: '1px solid var(--admin-border)', marginBottom: '30px'
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>إضافة حساب شيخ / مشرف جديد</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem' }}>الاسم الكامل</label>
                  <input
                    type="text" placeholder="مثال: الشيخ حسن الجلودي"
                    value={newSheikh.name} onChange={e => setNewSheikh(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem' }}>البريد الإلكتروني</label>
                  <input
                    type="email" placeholder="example@huzaifa-mosque.com"
                    value={newSheikh.email} onChange={e => setNewSheikh(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', boxSizing: 'border-box', textAlign: 'left' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem' }}>كلمة المرور</label>
                  <input
                    type="password" placeholder="••••••••"
                    value={newSheikh.pass} onChange={e => setNewSheikh(p => ({ ...p, pass: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--admin-accent)', marginBottom: '6px', fontSize: '0.85rem' }}>صلاحية الحساب</label>
                  <select
                    value={newSheikh.role} onChange={e => setNewSheikh(p => ({ ...p, role: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    <option value="admin">شيخ حلقة (صلاحيات محدودة)</option>
                    <option value="super_admin">مشرف عام / سوبر أدمن</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddSheikh} style={{
                marginTop: '20px', width: '100%', padding: '12px',
                background: 'var(--admin-accent)', color: 'var(--admin-bg)',
                border: 'none', borderRadius: '10px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '0.95rem', transition: '0.3s'
              }}>
                إضافة الحساب واعتماده
              </button>
            </div>

            {/* Dynamic Sheikhs List */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>الحسابات المضافة ديناميكياً</h3>
              {sheikhs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sheikhs.map(s => (
                    <div key={s.email} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '15px 20px', backgroundColor: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--admin-border)', borderRadius: '12px'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>{s.email} | {s.role === 'super_admin' ? 'مشرف عام' : 'شيخ حلقة'}</div>
                      </div>
                      <button onClick={() => handleDeleteSheikh(s.email)} style={{
                        background: 'rgba(220,53,69,0.1)', border: 'none', color: '#ff4d4d',
                        cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem'
                      }}>
                        حذف الحساب
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>لا يوجد حسابات مضافة مسبقاً.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .premium-row {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .premium-row:hover {
          background-color: rgba(196, 164, 132, 0.08) !important;
          transform: translateY(-2px) scale(1.002);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: relative;
          z-index: 10;
        }
        .premium-row:hover td {
          border-bottom-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default LeaderDashboard;
