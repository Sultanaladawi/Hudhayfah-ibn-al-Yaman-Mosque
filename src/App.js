import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './styles/global.css';

import { StoreProvider, useStore } from './context/StoreContext';
import Navbar             from './components/Navbar';
import Hero               from './components/Hero';
import Menu               from './components/Menu';
import Gallery            from './components/Gallery';
import About              from './components/About';
import Careers            from './components/Careers';
import Contact            from './components/Contact';
import Footer             from './components/Footer';
import Chatbot            from './components/Chatbot';
import LoadingScreen      from './components/LoadingScreen';

import { AdminProvider }  from './admin/AdminContext';
import AdminRoute         from './admin/AdminRoute';
import AdminLogin         from './admin/AdminLogin';
import AdminLayout        from './admin/AdminLayout';
import Dashboard          from './admin/pages/Dashboard';
import Circles            from './admin/pages/Circles';
import Analytics          from './admin/pages/Analytics';
import Students           from './admin/pages/Students';
import Offers             from './admin/pages/Offers';
import AIAssistant        from './admin/pages/AIAssistant';
import Volunteers         from './admin/pages/Volunteers';
import Activities         from './admin/pages/Activities';
import Feedback           from './admin/pages/Feedback';
import Messages           from './admin/pages/Messages';
import LeaderDashboard    from './admin/pages/LeaderDashboard';

let LenisClass = null;
try { LenisClass = require('@studio-freight/lenis').default; } catch (_) {}

function PublicSite() {
  const [loaded, setLoaded] = useState(false);
  const { isStoreOpen } = useStore();

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Disable smooth scroll on touch/mobile — causes jank and slowness
    if (!LenisClass) return;
    if (window.matchMedia('(hover: none)').matches) return; // touch device
    const lenis = new LenisClass({ 
      duration: 1.25, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true, 
      wheelMultiplier: 0.9 
    });
    
    function raf(time) { 
      lenis.raf(time); 
      requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="public-site-wrapper" style={{ minHeight: '100vh' }}>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      
      <div id="scroll-progress" />
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
      
      <Navbar />
      
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <About />
        <Careers />
        <Contact />
      </main>

      <Footer />
      <Chatbot />




      {/* Global Closed Overlay */}
      {!isStoreOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(30, 20, 9, 0.97)', // Deep Islamic green tone
          backdropFilter: 'blur(15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff', textAlign: 'center', padding: '30px',
          fontFamily: "'Tajawal', sans-serif"
        }}>
          <div style={{ maxWidth: '500px' }}>
            <div style={{ color: '#D4AF37', marginBottom: '25px', opacity: 1, display: 'flex', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Amiri', serif", fontSize: '2.5rem', marginBottom: '15px', color: '#D4AF37' }}>
              منصة مسجد حذيفة بن اليمان
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.95, marginBottom: '40px', fontWeight: '300' }}>
              نعتذر منكم، المنصة مغلقة حالياً لأعمال الصيانة والتحديث الدوري. نلتقي بكم قريباً إن شاء الله في خدمة بيوت الله ورعاية طلاب العلم.
            </p>
            <div style={{ 
              padding: '25px', border: '1px solid rgba(196, 155, 117, 0.4)', 
              borderRadius: '20px', backgroundColor: 'rgba(45, 31, 14, 0.20)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <p style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '0.95rem', letterSpacing: '1px', marginBottom: '15px', color: '#D4AF37' }}>
                أوقات الحلقات والزيارات الرسمية
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', direction: 'rtl' }}>
                <p style={{ margin: 0 }}>الفترة الصباحية: من 08:30 صباحاً حتى 11:30 ظهراً</p>
                <p style={{ margin: 0 }}>الفترة المسائية: من 04:00 عصراً حتى 09:30 مساءً</p>
                <p style={{ margin: 0 }}>يوم الجمعة: أوقات الصلوات والخطبة المباركة</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AdminProvider>
          
            <Routes>
              <Route path="/" element={<PublicSite />} />
              

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"    element={<Dashboard />} />
                
                <Route path="circles"      element={<Circles />} />
                <Route path="analytics"    element={<Analytics />} />
                <Route path="students"     element={<Students />} />
                <Route path="offers"       element={<Offers />} />
                <Route path="volunteers"   element={<Volunteers />} />
                <Route path="activities"   element={<Activities />} />
                <Route path="messages"     element={<Messages />} />
                <Route path="feedback"     element={<Feedback />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="leader"       element={<LeaderDashboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          
        </AdminProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
