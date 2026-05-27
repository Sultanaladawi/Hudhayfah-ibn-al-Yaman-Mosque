import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Mail, Trash2, Eye, EyeOff, Search, RefreshCw,
  User, Clock, CheckCircle, Filter, MailOpen, X
} from 'lucide-react';

const COLORS = {
  green: '#18453B',
  gold: '#C49B75',
  bg: 'var(--admin-bg)',
  card: 'var(--admin-card)',
  border: 'var(--admin-border)',
  text: 'var(--admin-text)',
  muted: '#94a3b8',
};

const Badge = ({ children, color = COLORS.green }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: '20px',
    background: color + '18', color, border: `1px solid ${color}30`,
    fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.5px',
    whiteSpace: 'nowrap'
  }}>
    {children}
  </span>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-JO', { year: 'numeric', month: 'long', day: 'numeric' })
    + ' • ' + d.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
};

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(true);
    try {
      const res = await axios.get('/api/contact');
      setMessages(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError('تعذّر تحميل الرسائل. تأكد من اتصالك بالخادم.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id, isRead) => {
    try {
      await axios.put(`/api/contact/${id}/read`, { is_read: isRead ? 1 : 0 });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead ? 1 : 0 } : m));
      if (selected?.id === id) setSelected(prev => ({ ...prev, is_read: isRead ? 1 : 0 }));
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/contact/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert('فشل الحذف. حاول مجدداً.');
    } finally {
      setDeleting(null);
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id, true);
  };

  const filtered = messages.filter(m => {
    const matchSearch = !search
      || m.name?.toLowerCase().includes(search.toLowerCase())
      || m.email?.toLowerCase().includes(search.toLowerCase())
      || m.message?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'unread' ? !m.is_read :
      filter === 'read' ? !!m.is_read : true;
    return matchSearch && matchFilter;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', direction: 'rtl' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          border: `3px solid ${COLORS.gold}`, borderTopColor: 'transparent',
          margin: '0 auto 16px', animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: COLORS.muted, fontFamily: "'Tajawal', sans-serif" }}>جاري تحميل الرسائل...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', padding: '10px 0', backgroundColor: 'transparent', position: 'relative' }}>
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
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${COLORS.green}, #2C6D5F)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Mail size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', color: COLORS.green, margin: 0, fontWeight: '800' }}>
                تواصل الأهالي
              </h1>
              {unreadCount > 0 && (
                <span style={{ fontSize: '0.8rem', color: COLORS.gold, fontWeight: '700' }}>
                  {unreadCount} رسالة جديدة غير مقروءة
                </span>
              )}
            </div>
          </div>
          <p style={{ color: COLORS.muted, margin: 0, fontSize: '0.9rem' }}>
            الرسائل المُرسَلة عبر نموذج التواصل في الموقع
          </p>
        </div>
        <button
          onClick={() => fetchMessages(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
            background: COLORS.green, color: '#fff', border: 'none',
            fontFamily: "'Tajawal', sans-serif", fontWeight: '700', fontSize: '0.9rem',
            opacity: refreshing ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={16} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          تحديث
        </button>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div style={{
          background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px',
          padding: '16px 20px', marginBottom: '20px', color: '#c53030',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'إجمالي الرسائل', value: messages.length, icon: Mail, color: COLORS.green },
          { label: 'غير مقروءة', value: unreadCount, icon: EyeOff, color: '#e67e22' },
          { label: 'مقروءة', value: messages.length - unreadCount, icon: MailOpen, color: '#27ae60' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '16px',
            padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: stat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: COLORS.muted, marginTop: '3px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الإيميل أو الرسالة..."
            style={{
              width: '100%', padding: '11px 40px 11px 14px', borderRadius: '12px',
              border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text,
              fontFamily: "'Tajawal', sans-serif", fontSize: '0.9rem', outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'الكل' },
            { key: 'unread', label: 'غير مقروء' },
            { key: 'read', label: 'مقروء' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 18px', borderRadius: '10px', cursor: 'pointer',
                border: `1px solid ${filter === f.key ? COLORS.green : COLORS.border}`,
                background: filter === f.key ? COLORS.green : COLORS.card,
                color: filter === f.key ? '#fff' : COLORS.text,
                fontFamily: "'Tajawal', sans-serif", fontWeight: '700', fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.3fr' : '1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Messages List ── */}
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '20px',
          overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.muted }}>
              <Mail size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', color: COLORS.text, fontSize: '1.1rem' }}>
                {search || filter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا توجد رسائل حالياً'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {search ? 'جرّب البحث بكلمات مختلفة' : 'ستظهر هنا رسائل الأهالي المُرسَلة من الموقع'}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((msg, idx) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 20px',
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    cursor: 'pointer',
                    background: selected?.id === msg.id ? COLORS.green + '08' :
                      !msg.is_read ? '#fffbf0' : 'transparent',
                    borderLeft: selected?.id === msg.id ? `3px solid ${COLORS.green}` :
                      !msg.is_read ? `3px solid ${COLORS.gold}` : '3px solid transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = selected?.id === msg.id ? COLORS.green + '08' :
                      !msg.is_read ? '#fffbf0' : 'transparent';
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                    background: `linear-gradient(135deg, ${COLORS.green}, #2C6D5F)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '800', fontSize: '1rem'
                  }}>
                    {(msg.name || 'م')[0]}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: msg.is_read ? '600' : '800', fontSize: '0.95rem', color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.name || 'غير معروف'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: COLORS.muted, flexShrink: 0 }}>
                        {new Date(msg.created_at).toLocaleDateString('ar-JO', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: COLORS.gold, marginBottom: '5px', fontWeight: '600' }}>
                      {msg.email}
                    </div>
                    <p style={{
                      margin: 0, fontSize: '0.85rem', color: COLORS.muted,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: msg.is_read ? '400' : '600'
                    }}>
                      {msg.message}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!msg.is_read && (
                    <div style={{
                      width: '9px', height: '9px', borderRadius: '50%',
                      background: COLORS.gold, flexShrink: 0, marginTop: '6px',
                      boxShadow: `0 0 8px ${COLORS.gold}80`
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Message Detail ── */}
        {selected && (
          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '20px',
            padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '20px'
          }}>
            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: COLORS.text, fontWeight: '800' }}>
                تفاصيل الرسالة
              </h2>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: '4px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sender Info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
              padding: '18px', background: COLORS.green + '08', borderRadius: '14px', border: `1px solid ${COLORS.green}20`
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `linear-gradient(135deg, ${COLORS.green}, #2C6D5F)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '800', fontSize: '1.3rem', flexShrink: 0
              }}>
                {(selected.name || 'م')[0]}
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: COLORS.text, marginBottom: '4px' }}>
                  {selected.name || 'غير معروف'}
                </div>
                <a href={`mailto:${selected.email}`} style={{ color: COLORS.gold, fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
                  {selected.email}
                </a>
              </div>
              <div style={{ marginRight: 'auto' }}>
                {selected.is_read
                  ? <Badge color={COLORS.green}><CheckCircle size={12} style={{ marginLeft: '4px' }} /> مقروءة</Badge>
                  : <Badge color='#e67e22'>جديدة</Badge>
                }
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: COLORS.muted, fontSize: '0.85rem' }}>
              <Clock size={15} />
              {formatDate(selected.created_at)}
            </div>

            {/* Message Body */}
            <div style={{
              background: '#f8fafc', borderRadius: '14px', padding: '20px',
              border: `1px solid ${COLORS.border}`, marginBottom: '24px',
              lineHeight: '1.8', color: COLORS.text, fontSize: '0.95rem',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word'
            }}>
              {selected.message}
            </div>

            {/* Reply Button */}
            <a
              href={`mailto:${selected.email}?subject=ردنا على رسالتك — مسجد حذيفة بن اليمان`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                width: '100%', padding: '13px', borderRadius: '12px', cursor: 'pointer',
                background: `linear-gradient(135deg, ${COLORS.green}, #2C6D5F)`,
                color: '#fff', fontFamily: "'Tajawal', sans-serif",
                fontWeight: '800', fontSize: '0.95rem', textDecoration: 'none',
                marginBottom: '12px', boxSizing: 'border-box', textAlign: 'center',
                boxShadow: `0 6px 20px ${COLORS.green}40`
              }}
            >
              <Mail size={18} />
              الرد عبر الإيميل
            </a>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => markRead(selected.id, !selected.is_read)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '11px', borderRadius: '10px', cursor: 'pointer',
                  border: `1px solid ${COLORS.border}`, background: COLORS.card,
                  color: COLORS.text, fontFamily: "'Tajawal', sans-serif",
                  fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s'
                }}
              >
                {selected.is_read ? <><EyeOff size={15} /> وضع علامة غير مقروء</> : <><Eye size={15} /> وضع علامة مقروء</>}
              </button>
              <button
                onClick={() => deleteMsg(selected.id)}
                disabled={deleting === selected.id}
                style={{
                  padding: '11px 18px', borderRadius: '10px', cursor: 'pointer',
                  border: '1px solid #fee2e2', background: '#fff5f5', color: '#ef4444',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: "'Tajawal', sans-serif", fontWeight: '700', fontSize: '0.85rem',
                  transition: 'all 0.2s', opacity: deleting === selected.id ? 0.6 : 1
                }}
              >
                <Trash2 size={15} /> حذف
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
