import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart3, TrendingUp, Users, BookOpen,
  Calendar, RefreshCw, Award, Star, ChevronRight, ChevronLeft
} from 'lucide-react';

const C = {
  green: '#3D2B1F',
  greenLight: '#5C3D2A',
  gold: '#C49B75',
  goldLight: '#E8CCAF',
  bg: 'var(--admin-bg)',
  card: 'var(--admin-card)',
  border: 'var(--admin-border)',
  text: 'var(--admin-text)',
  muted: '#94a3b8',
};

/* ── Mini Bar Chart (pure CSS/SVG) ── */
function BarChart({ data = [], color = C.green, label = '' }) {
  if (!data.length) return (
    <div style={{ textAlign: 'center', padding: '40px', color: C.muted, fontSize: '0.9rem' }}>
      لا توجد بيانات لهذه الفترة
    </div>
  );

  const max = Math.max(...data.map(d => d.value || 0), 1);
  const chartH = 140;

  return (
    <div>
      {label && <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: `${chartH}px`, padding: '0 4px' }}>
        {data.map((d, i) => {
          const h = Math.max((d.value / max) * chartH, 4);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
              <div
                title={`${d.label}: ${typeof d.value === 'number' && d.value % 1 !== 0 ? d.value.toFixed(2) : d.value}`}
                style={{
                  width: '100%', height: `${h}px`,
                  background: `linear-gradient(180deg, ${color}, ${color}80)`,
                  borderRadius: '6px 6px 2px 2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: '12px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(180deg, ${C.gold}, ${C.gold}90)`; e.currentTarget.style.transform = 'scaleY(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(180deg, ${color}, ${color}80)`; e.currentTarget.style.transform = 'scaleY(1)'; }}
              />
              {data.length <= 14 && (
                <span style={{ fontSize: '0.6rem', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
                  {d.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Donut / Pie Chart (SVG) ── */
function DonutChart({ data = [], size = 160 }) {
  if (!data.length) return <div style={{ textAlign: 'center', padding: '30px', color: C.muted, fontSize: '0.85rem' }}>لا توجد بيانات</div>;

  const PALETTE = [C.green, C.gold, '#8B6914', '#e67e22', '#3498db', '#9b59b6', '#e74c3c'];
  const total = data.reduce((s, d) => s + (d.count || 0), 0);
  const r = 50, cx = 60, cy = 60, strokeW = 18;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = total > 0 ? (d.count / total) : 0;
    const dash = pct * circ;
    const gap = circ - dash;
    const seg = { ...d, pct, dash, gap, offset, color: PALETTE[i % PALETTE.length] };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ flexShrink: 0, overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={strokeW} />
        {segments.map((seg, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeW}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'all 0.5s' }}
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: '13px', fontWeight: '800', fill: C.text }}>
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: '7px', fill: C.muted }}>
          إجمالي
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '120px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: C.text, flex: 1 }}>{seg.name}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: seg.color }}>{seg.count}</span>
            <span style={{ fontSize: '0.75rem', color: C.muted }}>({(seg.pct * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, sub, icon: Icon, color = C.green, trend }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: '18px',
      padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all 0.25s'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: trend >= 0 ? '#8B6914' : '#e74c3c', background: trend >= 0 ? '#edfdf5' : '#fff5f5', padding: '4px 10px', borderRadius: '20px' }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '800', color, fontFamily: "'Inter', sans-serif", lineHeight: 1, marginBottom: '6px' }}>{value}</div>
      <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', color: C.muted, fontWeight: '600' }}>{title}</p>
      {sub && <p style={{ margin: 0, fontSize: '0.78rem', color: C.muted }}>{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      const res = await axios.get(`/api/analytics-monthly?year=${year}&month=${month}`);
      setStats(res.data);
    } catch (err) {
      setError('تعذّر تحميل الإحصائيات. تأكد من اتصالك بالخادم.');
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [month, year]);

  useEffect(() => { fetch(); }, [fetch]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const dailyChartData = (stats?.dailySales || []).map(d => ({
    label: new Date(d.date).getDate().toString(),
    value: parseFloat(d.total) || 0
  }));

  const categoryData = (stats?.categoryStats || []).map(c => ({
    name: c.name || 'أخرى',
    count: parseInt(c.count) || 0
  }));

  const topProducts = stats?.topProducts || [];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', direction: 'rtl' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          border: `3px solid ${C.gold}`, borderTopColor: 'transparent',
          margin: '0 auto 16px', animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: C.muted, fontFamily: "'Tajawal', sans-serif" }}>جاري تحميل الإحصائيات...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', padding: '10px 0' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart3 size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: C.green, margin: 0, fontWeight: '800' }}>
              الإحصائيات والتحليلات
            </h1>
            <p style={{ color: C.muted, margin: 0, fontSize: '0.88rem' }}>
              إحصائيات حلقات التحفيظ والأنشطة الشهرية
            </p>
          </div>
        </div>

        {/* Month Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px',
            padding: '6px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: C.green, display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={18} />
            </button>
            <div style={{ textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: C.text }}>{MONTHS_AR[month - 1]}</div>
              <div style={{ fontSize: '0.75rem', color: C.muted }}>{year}</div>
            </div>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: C.green, display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={18} />
            </button>
          </div>
          <button
            onClick={() => fetch(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 18px', borderRadius: '12px', cursor: 'pointer',
              background: C.green, color: '#fff', border: 'none',
              fontFamily: "'Tajawal', sans-serif", fontWeight: '700', fontSize: '0.88rem',
              opacity: refreshing ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            تحديث
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px',
          padding: '16px 20px', marginBottom: '20px', color: '#c53030', fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <StatCard
          title="إجمالي الطلاب المسجلين"
          value={`${parseFloat(stats?.totalSales || 0).toFixed(0)} د.أ`}
          sub={`${MONTHS_AR[month - 1]} ${year}`}
          icon={TrendingUp}
          color={C.green}
        />
        <StatCard
          title="عدد الحلقات النموذجية"
          value={stats?.totalOrders || 0}
          sub="عملية تبرع"
          icon={BookOpen}
          color={C.gold}
        />
        <StatCard
          title="نسبة الالتزام والحفظ"
          value={`${parseFloat(stats?.avgOrderValue || 0).toFixed(2)} د.أ`}
          sub="لكل تبرع"
          icon={Star}
          color="#B8860B"
        />
        <StatCard
          title="المنتجات النشطة"
          value={stats?.totalProducts || 0}
          sub="عنصر في القائمة"
          icon={Award}
          color="#e67e22"
        />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Daily Revenue Chart */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px',
          padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: C.text, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '4px', height: '20px', background: C.green, borderRadius: '4px', display: 'inline-block' }} />
              التبرعات اليومية
            </h2>
            <span style={{ fontSize: '0.78rem', color: C.muted, background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
              {MONTHS_AR[month - 1]}
            </span>
          </div>
          {dailyChartData.length > 0 ? (
            <BarChart data={dailyChartData} color={C.green} />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0', color: C.muted }}>
              <BarChart3 size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>لا توجد بيانات لهذا الشهر</p>
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px',
          padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: C.text, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '4px', height: '20px', background: C.gold, borderRadius: '4px', display: 'inline-block' }} />
              التوزيع حسب الفئة
            </h2>
          </div>
          <DonutChart data={categoryData} size={150} />
        </div>
      </div>

      {/* ── Top Products ── */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px',
        padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <h2 style={{ margin: '0 0 22px 0', fontSize: '1.1rem', color: C.text, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '4px', height: '20px', background: '#8B6914', borderRadius: '4px', display: 'inline-block' }} />
          الأكثر طلباً هذا الشهر
        </h2>

        {topProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.muted }}>
            <Award size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>لا توجد بيانات لهذا الشهر</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.map((p, i) => {
              const maxSold = Math.max(...topProducts.map(x => parseInt(x.total_sold) || 0), 1);
              const pct = ((parseInt(p.total_sold) || 0) / maxSold) * 100;
              const MEDAL = ['🥇', '🥈', '🥉'];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 18px', borderRadius: '12px',
                  background: i < 3 ? C.green + '06' : '#f8fafc',
                  border: `1px solid ${i < 3 ? C.green + '20' : C.border}`,
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <span style={{ fontSize: '1.3rem', flexShrink: 0, minWidth: '28px' }}>
                    {MEDAL[i] || `#${i + 1}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.item_name || p.name}
                      </span>
                      <div style={{ display: 'flex', gap: '12px', flexShrink: 0, marginRight: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: C.green }}>{p.total_sold} طلب</span>
                        <span style={{ fontSize: '0.82rem', color: C.muted }}>{parseFloat(p.revenue || 0).toFixed(2)} د.أ</span>
                      </div>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '10px',
                        background: i < 3 ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})` : `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
                        width: `${pct}%`, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Monthly Summary Banner ── */}
      {stats && (
        <div style={{
          marginTop: '24px',
          background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
          borderRadius: '20px', padding: '28px 32px',
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px',
          boxShadow: `0 8px 30px ${C.green}30`
        }}>
          {[
            { label: 'إجمالي التبرعات', value: `${parseFloat(stats.totalSales || 0).toFixed(2)} د.أ` },
            { label: 'عدد العمليات', value: stats.totalOrders || 0 },
            { label: 'متوسط التبرع', value: `${parseFloat(stats.avgOrderValue || 0).toFixed(2)} د.أ` },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: C.gold, fontFamily: "'Inter', sans-serif" }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
