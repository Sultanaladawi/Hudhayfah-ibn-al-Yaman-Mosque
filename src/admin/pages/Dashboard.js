import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../AdminContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, BookOpen, FileText, ShoppingCart,
  TrendingUp, CheckCircle, Clock, Star, Heart
} from 'lucide-react';

export default function Dashboard() {
  const { admin } = useAdminContext();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    studentsCount: 0,
    circlesCount: 0,
    volunteersCount: 0,
    donationsTotal: 0,
    donationsToday: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح النور' : hour < 18 ? 'مساء النور' : 'مساء الخير';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Get students count from localStorage
        let studentsLength = 6; // default fallback
        const savedStudents = localStorage.getItem('student_records');
        if (savedStudents) {
          try {
            const parsed = JSON.parse(savedStudents);
            studentsLength = parsed.length;
          } catch(e) {}
        }

        // 2. Get circles count from localStorage
        let circlesLength = 6; // default fallback
        const savedCircles = localStorage.getItem('circle_records');
        if (savedCircles) {
          try {
            const parsed = JSON.parse(savedCircles);
            circlesLength = parsed.length;
          } catch(e) {}
        }

        // 3. Get volunteer applications from API
        let volunteersLength = 0;
        try {
          const volRes = await axios.get('/api/applications');
          if (Array.isArray(volRes.data)) {
            volunteersLength = volRes.data.filter(app => app.status === 'new' || !app.status || app.status === 'pending').length;
          }
        } catch(e) {
          console.error("Error loading volunteer count", e);
        }

        // 4. Get donations from dashboard-stats API
        let totalDonations = 450;
        let todayDonations = 0;
        try {
          const statsRes = await axios.get('/api/dashboard-stats');
          const data = statsRes.data;
          totalDonations = data.totalSales || 0;
          todayDonations = data.todaySales || 0;
        } catch(e) {
          console.error("Error loading donation stats", e);
        }

        setStats({
          studentsCount: studentsLength,
          circlesCount: circlesLength,
          volunteersCount: volunteersLength,
          donationsTotal: totalDonations,
          donationsToday: todayDonations
        });

        // 5. Get recent logs for Activity Feed
        try {
          const logsRes = await axios.get('/api/admin/logs');
          if (Array.isArray(logsRes.data) && logsRes.data.length > 0) {
            const mappedLogs = logsRes.data.slice(0, 5).map((log, idx) => {
              // Map action to Lucide icons
              let icon = Clock;
              let color = '#3D2B1F';
              
              const actionLower = String(log.action || '').toLowerCase();
              if (actionLower.includes('طالب') || actionLower.includes('student')) {
                icon = Users;
                color = '#B8860B';
              } else if (actionLower.includes('حلقة') || actionLower.includes('circle')) {
                icon = BookOpen;
                color = '#C49B75';
              } else if (actionLower.includes('تبرع') || actionLower.includes('donation') || actionLower.includes('order')) {
                icon = ShoppingCart;
                color = '#e67e22';
              } else if (actionLower.includes('تطوع') || actionLower.includes('volunteer') || actionLower.includes('apply')) {
                icon = Heart;
                color = '#e74c3c';
              } else if (actionLower.includes('login') || actionLower.includes('دخول')) {
                icon = CheckCircle;
                color = '#3D2B1F';
              }

              // format time
              let timeStr = 'منذ فترة';
              if (log.created_at) {
                const diffMs = Date.now() - new Date(log.created_at).getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                if (diffMins < 1) timeStr = 'الآن';
                else if (diffMins < 60) timeStr = `منذ ${diffMins} دقيقة`;
                else if (diffHours < 24) timeStr = `منذ ${diffHours} ساعة`;
                else timeStr = new Date(log.created_at).toLocaleDateString('ar-JO', { month: 'short', day: 'numeric' });
              }

              return {
                icon,
                color,
                text: `${log.admin_name || 'مسؤول'}: ${log.action} — ${log.details}`,
                time: timeStr
              };
            });
            setActivities(mappedLogs);
          } else {
            // Default activity fallback if no logs
            setActivities([
              { icon: CheckCircle, color: '#B8860B', text: 'الشيخ أسامة أضاف طالباً جديداً لمجموعة حلقة الفجر', time: 'منذ 10 دقائق' },
              { icon: Clock,       color: '#e67e22', text: 'تم تسجيل غياب لـ 3 طلاب في حلقة العصر — الشيخ همام', time: 'منذ 45 دقيقة' },
              
              { icon: TrendingUp,  color: '#3D2B1F', text: 'اكتمل حفظ جزء عم للطالب عمر سعيد — حلقة الفجر', time: 'أمس' },
            ]);
          }
        } catch(e) {
          // Fallback on error
          setActivities([
            { icon: CheckCircle, color: '#B8860B', text: 'الشيخ أسامة أضاف طالباً جديداً لمجموعة حلقة الفجر', time: 'منذ 10 دقائق' },
            { icon: Clock,       color: '#e67e22', text: 'تم تسجيل غياب لـ 3 طلاب في حلقة العصر — الشيخ همام', time: 'منذ 45 دقيقة' },
            
            { icon: TrendingUp,  color: '#3D2B1F', text: 'اكتمل حفظ جزء عم للطالب عمر سعيد — حلقة الفجر', time: 'أمس' },
          ]);
        }

      } catch(err) {
        console.error("Dashboard stats fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const cards = [
    {
      title: 'إجمالي الطلاب بالحلقات',
      value: `${stats.studentsCount} طالب`,
      change: 'مسجلين في حلقات المسجد',
      icon: Users,
      color: '#3D2B1F',
      lightColor: 'rgba(61,43,31,0.1)',
      path: '/admin/students',
    },
    {
      title: 'حلقات التحفيظ والتعليم',
      value: `${stats.circlesCount} حلقات`,
      change: 'نشطة وفعالة حالياً',
      icon: BookOpen,
      color: '#C49B75',
      lightColor: 'rgba(196,155,117,0.1)',
      path: '/admin/circles',
    },
    {
      title: 'طلبات التطوع المعلقة',
      value: `${stats.volunteersCount} طلبات`,
      change: stats.volunteersCount > 0 ? 'بحاجة للمراجعة والفرز' : 'تم فرز جميع الطلبات',
      icon: Heart,
      color: '#e74c3c',
      lightColor: 'rgba(231,76,60,0.1)',
      path: '/admin/volunteers',
    },
    {
      title: 'حلقات القرآن الكريم والأنشطة',
      value: '8 حلقات نشطة',
      change: 'متابعة أسبوعية مستمرة',
      icon: BookOpen,
      color: '#e67e22',
      lightColor: 'rgba(230,126,34,0.1)',
      path: '/admin/donations',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '10px 0', direction: 'rtl', fontFamily: "'Amiri', 'Tajawal', sans-serif" }}>

      {/* ── Welcome Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #3D2B1F 0%, #4A3020 100%)',
        borderRadius: '20px',
        padding: '35px 40px',
        marginBottom: '35px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(61,43,31,0.2)',
      }}>
        <div style={{
          position: 'absolute', left: '-40px', top: '-40px',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', left: '60px', bottom: '-60px',
          width: '150px', height: '150px',
          borderRadius: '50%',
          background: 'rgba(196,155,117,0.05)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0 0 6px 0' }}>
            {greeting}،
          </p>
          <h1 style={{
            color: '#fff',
            fontSize: '2.2rem', margin: '0 0 8px 0', fontWeight: '700'
          }}>
            فضيلة {admin?.name || 'الشيخ المشرف'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', margin: 0 }}>
            نظام الإدارة الإلكتروني المتكامل • مسجد حذيفة بن اليمان — طبربور، عمان
          </p>
        </div>
        <div style={{
          position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(196,155,117,0.15)',
          border: '1px solid rgba(196,155,117,0.25)',
          borderRadius: '30px', padding: '8px 18px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38ef7d', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#C49B75', fontSize: '0.85rem', fontWeight: '600' }}>النظام متصل وآمن</span>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '35px',
      }}>
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => navigate(c.path)}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'var(--admin-card)',
              border: `1px solid ${hoveredCard === i ? c.color + '40' : 'var(--admin-border)'}`,
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: hoveredCard === i
                ? `0 12px 35px ${c.color}20`
                : '0 2px 12px rgba(0,0,0,0.04)',
              transform: hoveredCard === i ? 'translateY(-5px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Icon */}
            <div style={{
              width: '50px', height: '50px',
              background: c.lightColor,
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <c.icon size={24} color={c.color} />
            </div>

            <p style={{ margin: '0 0 6px 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {c.title}
            </p>
            <div style={{
              fontSize: '1.8rem', fontWeight: '800', color: c.color,
              fontFamily: "'Inter', sans-serif", lineHeight: 1, margin: '0 0 8px 0'
            }}>
              {c.value}
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
              {c.change}
            </p>
          </div>
        ))}
      </div>

      {/* ── Activity Feed ── */}
      <div style={{
        background: 'var(--admin-card)',
        border: '1px solid var(--admin-border)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <h2 style={{
          fontSize: '1.45rem',
          color: 'var(--admin-accent)',
          margin: '0 0 24px 0',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ width: '4px', height: '22px', background: '#C49B75', borderRadius: '4px', display: 'inline-block' }} />
          آخر نشاطات وحركات النظام الإداري
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activities.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '12px',
              border: '1px solid var(--admin-border)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196, 155, 117, 0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: a.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <a.icon size={18} color={a.color} />
              </div>
              <p style={{ margin: 0, color: '#ddd', fontSize: '0.92rem', lineHeight: '1.5', flex: 1, fontFamily: 'Tajawal' }}>
                {a.text}
              </p>
              <span style={{ color: '#888', fontSize: '0.8rem', flexShrink: 0, fontFamily: 'Tajawal' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}