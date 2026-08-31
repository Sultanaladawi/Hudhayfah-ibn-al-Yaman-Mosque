import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Bot, Send, RefreshCw, Trash2, ArrowLeft, Sparkles, 
  HelpCircle, MessageSquare, Volume2, VolumeX, AlertCircle 
} from 'lucide-react';
import { useAdminContext } from '../AdminContext';

const AIAssistant = () => {
  const { admin } = useAdminContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Quick Prompts Arabic for the Sheikh
  const quickPrompts = [
    { text: "لخص لي إحصائيات التبرعات والصدقات اليوم", category: "تبرعات" },
    { text: "ما هي طلبات التطوع الجديدة التي تنتظر المراجعة؟", category: "تطوع" },
    { text: "أعطني كشفاً بالرسائل الواردة من الأهالي مؤخراً", category: "رسائل" },
    { text: "ما هي السلع والمواد التي نفدت أو شارفت على النفاد؟", category: "مخزون" },
    { text: "ما هي آخر نشاطات المشايخ والمشرفين في لوحة التحكم؟", category: "نشاطات" }
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history from backend database on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setSyncing(true);
        const res = await axios.get('/api/ai-assistant-logs');
        const logs = Array.isArray(res.data) ? res.data : [];
        
        // Convert DB logs to chat messages format
        // DB fields: id, admin_query, ai_response, created_at
        const formattedMsgs = [];
        // DB logs are ordered DESC (newest first). Let's reverse them to display chronologically.
        const sortedLogs = [...logs].reverse();
        
        sortedLogs.forEach((log) => {
          if (log.admin_query) {
            formattedMsgs.push({
              id: `q-${log.id}`,
              role: 'user',
              text: log.admin_query,
              time: log.created_at
            });
          }
          if (log.ai_response) {
            formattedMsgs.push({
              id: `a-${log.id}`,
              role: 'assistant',
              text: log.ai_response,
              time: log.created_at
            });
          }
        });

        if (formattedMsgs.length > 0) {
          setMessages(formattedMsgs);
        } else {
          // Default greeting if no history
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              text: `أهلاً بك يا فضيلة الشيخ ${admin?.name || 'المشرف'}. أنا مساعدك الذكي المربوط بقاعدة بيانات مسجد حذيفة بن اليمان. يمكنك سؤالي عن إحصائيات التبرعات، طلبات التطوع، رسائل الأهالي، والمستندات والعمليات الإدارية، وسأقوم بتحليلها لك فوراً. كيف يمكنني مساعدتك اليوم؟ 🕌`,
              time: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch AI chat logs:", err);
        setError("فشل تحميل تاريخ المحادثة من الخادم. سنعمل في الوضع المحلي.");
        // Set fallback welcome
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            text: `مرحباً بك يا فضيلة الشيخ. أواجه مشكلة في الاتصال بالخادم لجلب الأرشيف، ولكن يمكنك الاستمرار في سؤالي هنا مباشرة! 🕌`,
            time: new Date().toISOString()
          }
        ]);
      } finally {
        setSyncing(false);
      }
    };

    fetchHistory();
  }, [admin]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (!textToSend) setInput('');
    setError('');

    // Add user message to UI
    const userMsgId = Date.now().toString();
    const newUserMsg = {
      id: userMsgId,
      role: 'user',
      text: query,
      time: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Build conversation history for the AI API context
      // Limit to last 10 messages to keep request payload reasonable
      const recentChat = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Call AI endpoint in server.js
      const res = await axios.post('/api/ai-chat', {
        message: query,
        isAdmin: true,
        history: recentChat
      });

      const replyText = res.data?.reply || "معذرة، لم أتمكن من صياغة إجابة مناسبة حالياً.";

      // Add assistant response to UI
      const assistantMsgId = (Date.now() + 1).toString();
      const newAssistantMsg = {
        id: assistantMsgId,
        role: 'assistant',
        text: replyText,
        time: new Date().toISOString()
      };
      setMessages(prev => [...prev, newAssistantMsg]);

      // Save log to DB
      try {
        await axios.post('/api/ai-assistant-logs', {
          admin_query: query,
          ai_response: replyText
        });
      } catch (logErr) {
        console.warn("Failed to save AI log in DB:", logErr);
      }

    } catch (err) {
      console.error("AI service error:", err);
      setError("حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. يرجى التحقق من اتصال الإنترنت أو خادم OpenAI.");
      
      // Add error message as bot reply
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "نعتذر منك يا فضيلة الشيخ، تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً (AI service offline). يرجى التأكد من توفر مفتاح OpenAI API وصلاحية الخادم.",
        time: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Text to Speech for Sheikh's convenience
  const toggleSpeech = (msgId, text) => {
    if (!window.speechSynthesis) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Clear Chat History display (client-side restart)
  const handleClearChat = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة بدء المحادثة وتصفية الشاشة؟ (ملاحظة: هذا لن يمسح الأرشيف المحفوظ بالخادم)")) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          text: `مرحباً بك مجدداً يا فضيلة الشيخ. لقد قمنا ببدء جلسة جديدة. كيف يمكنني مساعدتك الآن في إدارة شؤون المسجد؟ 🕌`,
          time: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div style={{ 
      minHeight: '85vh', 
      padding: '10px 5px', 
      direction: 'rtl', 
      fontFamily: "'Amiri', 'Tajawal', sans-serif",
      color: '#fff',
      position: 'relative'
    }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(196, 155, 117, 0.03)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(24, 69, 59, 0.05)', filter: 'blur(90px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Page Title Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '25px', 
          flexWrap: 'wrap', 
          gap: '15px' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <Bot size={32} color="var(--admin-accent)" />
              <h1 style={{ 
                fontSize: '2.3rem', 
                color: 'var(--admin-accent)', 
                margin: 0, 
                fontWeight: 'bold',
                fontFamily: "'Amiri', serif"
              }}>
                مساعد الشيخ الذكي
              </h1>
            </div>
            <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem' }}>
              نظام الاستعلام الذكي المربوط بالذكاء الاصطناعي وببيانات المسجد مباشرة
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleClearChat}
              title="تصفية الشاشة"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '10px 15px',
                color: '#aaa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                transition: 'all 0.3s'
              }}
            >
              <Trash2 size={16} />
              <span>بدء محادثة جديدة</span>
            </button>
            
            {syncing && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--admin-accent)',
                padding: '10px'
              }}>
                <RefreshCw size={14} className="spin-animation" style={{ animation: 'spin 2s linear infinite' }} />
                <span>جاري المزامنة...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(231, 76, 60, 0.12)', 
            border: '1px solid #e74c3c', 
            borderRadius: '12px', 
            padding: '12px 18px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            color: '#e74c3c',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '3fr 1fr', 
          gap: '25px',
          alignItems: 'start',
          '@media (maxWidth: 1024px)': {
            gridTemplateColumns: '1fr'
          }
        }} className="ai-assistant-grid">
          
          {/* Main Chat Interface */}
          <div style={{ 
            background: 'var(--admin-card)', 
            border: '1px solid var(--admin-border)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '65vh',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            {/* Chat Body */}
            <div style={{ 
              flex: 1, 
              padding: '25px', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                      alignSelf: isUser ? 'flex-start' : 'flex-end',
                    }}
                  >
                    {/* Sender Label */}
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--admin-accent)', 
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'Tajawal'
                    }}>
                      {!isUser && <Bot size={14} />}
                      <span>{isUser ? `المشرف: ${admin?.name || ''}` : 'مساعد الشيخ الذكي'}</span>
                    </div>

                    {/* Bubble */}
                    <div style={{
                      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.05)' : 'rgba(45, 31, 14, 0.65)',
                      color: isUser ? '#e2e8f0' : '#fff',
                      padding: '16px 20px',
                      borderRadius: isUser ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                      border: isUser ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(196,155,117,0.3)',
                      fontSize: '1.05rem',
                      lineHeight: '1.7',
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}>
                      {msg.text}

                      {/* Text to Speech button for Assistant messages */}
                      {!isUser && (
                        <div style={{ 
                          marginTop: '10px', 
                          display: 'flex', 
                          justifyContent: 'flex-start',
                          borderTop: '1px solid rgba(196,155,117,0.15)',
                          paddingTop: '8px'
                        }}>
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.text)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--admin-accent)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              transition: 'all 0.2s',
                              opacity: 0.8
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = 1}
                            onMouseOut={e => e.currentTarget.style.opacity = 0.8}
                          >
                            {speakingMsgId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                            <span>{speakingMsgId === msg.id ? 'إيقاف الاستماع' : 'استمع للرد الشرعي/الإداري'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bot typing loader */}
              {loading && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                  maxWidth: '85%'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Bot size={14} />
                    <span>مساعد الشيخ الذكي يقرأ قاعدة البيانات...</span>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(45, 31, 14, 0.40)',
                    padding: '16px 25px',
                    borderRadius: '20px 20px 4px 20px',
                    border: '1px solid rgba(196,155,117,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span className="dot-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)', display: 'inline-block', animation: 'pulse 1.4s infinite ease-in-out both' }} />
                    <span className="dot-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)', display: 'inline-block', animation: 'pulse 1.4s infinite ease-in-out both 0.2s' }} />
                    <span className="dot-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)', display: 'inline-block', animation: 'pulse 1.4s infinite ease-in-out both 0.4s' }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Footer */}
            <div style={{ 
              padding: '20px', 
              borderTop: '1px solid var(--admin-border)',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اسأل مساعد الشيخ الذكي عن تبرعات اليوم، أو المتطوعين، أو الطلاب، أو تقارير..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'none',
                  height: '50px',
                  fontFamily: 'Tajawal',
                  lineHeight: '1.4',
                  boxSizing: 'border-box'
                }}
              />
              
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{
                  background: 'linear-gradient(135deg, var(--admin-accent), #a47c4f)',
                  color: 'var(--admin-bg)',
                  border: 'none',
                  borderRadius: '16px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !input.trim()) ? 0.5 : 1,
                  transition: 'all 0.3s',
                  flexShrink: 0
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar / Quick Prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Quick Prompts Container */}
            <div style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: 'var(--admin-accent)' }}>
                <Sparkles size={18} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontFamily: "'Amiri', serif", fontWeight: 'bold' }}>
                  استفسارات سريعة ومقترحة
                </h3>
              </div>
              <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '0 0 18px 0', lineHeight: '1.6' }}>
                اضغط على أي استعلام بالأسفل ليسأل المساعد الذكي قاعدة البيانات ويعطيك تقريراً تحليلياً فورياً:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    disabled={loading}
                    style={{
                      background: 'rgba(196, 155, 117, 0.05)',
                      border: '1px solid rgba(196,155,117,0.15)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      textAlign: 'right',
                      color: '#ddd',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.88rem',
                      lineHeight: '1.5',
                      fontFamily: 'Tajawal',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                    onMouseOver={e => {
                      if (!loading) {
                        e.currentTarget.style.background = 'rgba(196, 155, 117, 0.12)';
                        e.currentTarget.style.borderColor = 'var(--admin-accent)';
                      }
                    }}
                    onMouseOut={e => {
                      if (!loading) {
                        e.currentTarget.style.background = 'rgba(196, 155, 117, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(196,155,117,0.15)';
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: '0.72rem', 
                      backgroundColor: 'rgba(45, 31, 14, 0.60)', 
                      color: 'var(--admin-accent)', 
                      padding: '2px 8px', 
                      borderRadius: '8px',
                      alignSelf: 'flex-start',
                      fontWeight: 'bold'
                    }}>
                      {prompt.category}
                    </span>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Notice */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 31, 14, 0.30) 0%, rgba(139, 105, 20, 0.08) 100%)',
              border: '1px solid rgba(196,155,117,0.1)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--admin-accent)' }}>
                <HelpCircle size={18} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontFamily: "'Amiri', serif", fontWeight: 'bold' }}>
                  إرشادات الاستخدام
                </h4>
              </div>
              <ul style={{ 
                margin: 0, 
                paddingRight: '18px', 
                color: '#aaa', 
                fontSize: '0.8rem', 
                lineHeight: '1.7',
                fontFamily: 'Tajawal'
              }}>
                <li>يقوم المساعد بتحليل البيانات المخزنة لحظياً.</li>
                <li>عند الاستعلام عن التبرعات، يتم استقصاء إحصائيات الدفع الإلكتروني والنقدي.</li>
                <li>يتم حفظ الأسئلة الشائعة في سجل النظام للرجوع إليها لاحقاً لرفع مستوى الخدمات.</li>
                <li>تتم الإجابة باللغة العربية الفصحى دائماً لتليق بفضيلتكم.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Embedded CSS styles in style tag */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .ai-assistant-grid {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 25px;
        }
        @media (max-width: 1024px) {
          .ai-assistant-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
