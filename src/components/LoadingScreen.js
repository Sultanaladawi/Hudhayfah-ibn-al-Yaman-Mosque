import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('drawing');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('fading');
    }, 1700);

    const t2 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 2350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div 
      className={`${styles.loader} ${phase === 'fading' ? styles.fading : ''}`}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <svg
          className={styles.wordmark}
          viewBox="0 0 320 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="160"
            y="38"
            textAnchor="middle"
            className={styles.drawText}
            style={{
              fontFamily: "'Amiri', 'Tajawal', sans-serif",
              fontSize: '36px',
              fontWeight: 'bold',
              stroke: 'var(--olive)',
              strokeWidth: '0.8',
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              fill: 'none'
            }}
          >
            مسجد
          </text>
          
          <text
            x="160"
            y="72"
            textAnchor="middle"
            className={styles.drawTextDelay}
            style={{
              fontFamily: "'Amiri', 'Tajawal', sans-serif",
              fontSize: '32px',
              fontWeight: 'bold',
              stroke: 'var(--gold)',
              strokeWidth: '0.7',
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
              fill: 'none'
            }}
          >
            حذيفة بن اليمان
          </text>
        </svg>

        <p className={styles.tagline} style={{ fontFamily: 'Tajawal', fontSize: '1rem', letterSpacing: '0' }}>طبربور · عمان</p>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ backgroundColor: 'var(--gold)' }} />
        </div>
      </div>
    </div>
  );
}