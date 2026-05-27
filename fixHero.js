const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.js', 'utf8');

// 1. Wrap in fragment
code = code.replace('<section className={styles.hero} id="home">', '<>\n    <section className={styles.hero} id="home">');

// 2. Remove the old Live Stream card
const targetStr = `{/* Hajj Channel Live Stream Embed Card */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(24, 69, 59, 0.45)',
          backdropFilter: 'blur(12px)',
          border: '2px solid #C49B75',
          borderRadius: '24px',
          padding: '25px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          boxSizing: 'border-box',
          textAlign: 'center',
          animation: 'glowPulse 2.5s infinite alternate'
        }}>
          <h3 style={{ fontFamily: "'Amiri', serif", color: '#C49B75', fontSize: '1.6rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
             🕋 البث المباشر لقناة الحج الفضائية ومناسك عرفة
          </h3>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCos52azQNBgW63_9uDJoPDA&autoplay=0"
              title="Makkah Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          <p style={{ color: '#fff', fontSize: '0.95rem', marginTop: '15px', opacity: 0.85, fontFamily: 'Tajawal', lineHeight: '1.6' }}>
            تابعوا البث المباشر لجموع الحجيج وتكبيرات العيد المباركة من مكة المكرمة والمشاعر المقدسة طوال أيام عشر ذي الحجة وعيد الأضحى المبارك. تقبل الله منا ومنكم صالح الأعمال.
          </p>
        </div>`;
code = code.replace(targetStr, '');

// 3. Add the new Live Stream section outside of Hero
const endStr = `    </section>
  );
}`;
const newEndStr = `    </section>

    {/* Live Stream Section */}
    <section style={{ backgroundColor: '#0b1f1a', padding: '60px 20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        background: 'rgba(24, 69, 59, 0.45)',
        backdropFilter: 'blur(12px)',
        border: '2px solid #C49B75',
        borderRadius: '24px',
        padding: '25px',
        width: '100%',
        maxWidth: '900px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        boxSizing: 'border-box',
        textAlign: 'center',
        animation: 'glowPulse 2.5s infinite alternate'
      }}>
        <h3 style={{ fontFamily: "'Amiri', serif", color: '#C49B75', fontSize: '1.6rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
           🕋 البث المباشر لقناة القرآن الكريم (مكة المكرمة)
        </h3>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <iframe
            src="https://www.youtube.com/embed/live_stream?channel=UCeT14cW4_Ri5qH5V2a8e8wQ&autoplay=0"
            title="Makkah Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        <p style={{ color: '#fff', fontSize: '0.95rem', marginTop: '15px', opacity: 0.85, fontFamily: 'Tajawal', lineHeight: '1.6' }}>
          تابعوا البث المباشر من مكة المكرمة والمشاعر المقدسة. تقبل الله منا ومنكم صالح الأعمال.
        </p>
      </div>
    </section>
    </>
  );
}`;
code = code.replace(endStr, newEndStr);

fs.writeFileSync('src/components/Hero.js', code);
console.log('Successfully updated Hero.js');
