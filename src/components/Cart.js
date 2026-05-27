import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';
import { useEffect } from 'react';

export default function Cart({ onClose, onCheckout }) {
  const { items, totalItems, totalPrice, removeItem, setQty, clearCart } = useCart();

  const formatPrice = (n) => {
    const val = parseFloat(n) || 0;
    return "JOD " + val.toFixed(2);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (items.length === 0) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.drawer} onClick={e => e.stopPropagation()}>
          <div className={styles.drawerHead} style={{ direction: 'rtl' }}>
            <div className={styles.drawerTitleRow}>
              <h2 className={styles.drawerTitle} style={{ fontFamily: "'Amiri', serif" }}>سلة التبرعات</h2>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart" style={{ marginRight: 'auto', marginLeft: 0 }}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className={styles.emptyState} style={{ direction: 'rtl' }}>
            <div className={styles.emptyIcon} style={{ backgroundColor: 'rgba(24, 69, 59, 0.1)' }}>
              <i className="fas fa-hand-holding-heart" style={{ color: '#18453B', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }} />
            </div>
            <p className={styles.emptyTitle} style={{ fontFamily: 'Tajawal' }}>السلة فارغة</p>
            <p className={styles.emptyDesc} style={{ fontFamily: 'Tajawal' }}>يبدو أنك لم تختر أي مساهمة أو باب من أبواب الخير بعد.</p>
            <button
              className={styles.checkoutBtn}
              style={{ background: '#18453B', maxWidth: '250px', fontFamily: 'Tajawal' }}
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
            >
              تصفح وجوه الخير
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHead} style={{ direction: 'rtl' }}>
          <div className={styles.drawerTitleRow}>
            <h2 className={styles.drawerTitle} style={{ fontFamily: "'Amiri', serif" }}>سلة الخيرات</h2>
            <span className={styles.itemCount} style={{ fontFamily: 'Tajawal' }}>{totalItems} {totalItems === 1 ? 'مساهمة' : 'مساهمات'}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart" style={{ marginRight: 'auto', marginLeft: 0 }}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className={styles.itemList} style={{ direction: 'rtl' }}>
          {items.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName} style={{ fontFamily: 'Tajawal', fontWeight: 'bold' }}>{item.name}</div>
                  <div className={styles.itemUnit} style={{ fontFamily: 'Tajawal' }}>{formatPrice(item.priceNum)} للمساهمة الواحدة</div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  style={{ marginRight: 'auto', marginLeft: 0 }}
                >
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
              
              <div className={styles.itemControls}>
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => setQty(item.id, item.qty - 1)}>
                    <i className="fas fa-minus" />
                  </button>
                  <span className={styles.qty}>{item.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(item.id, item.qty + 1)}>
                    <i className="fas fa-plus" />
                  </button>
                </div>
                <div className={styles.itemSubtotal}>{formatPrice(item.priceNum * item.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary} style={{ direction: 'rtl' }}>
          <div className={styles.summaryRow} style={{ fontFamily: 'Tajawal' }}>
            <span>المجموع الفرعي</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.summaryRow} style={{ fontFamily: 'Tajawal' }}>
            <span>رسوم المعاملة</span>
            <span style={{ color: '#27ae60' }}>مجانية (مغطاة بالكامل)</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`} style={{ fontFamily: 'Tajawal' }}>
            <span>المجموع الكلي للمساهمات</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button className={styles.checkoutBtn} onClick={onCheckout} style={{ background: '#18453B', fontFamily: 'Tajawal' }}>
            <i className="fas fa-shield-alt" style={{ marginLeft: '8px' }} />
            <span>تأكيد التبرع والمتابعة</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '8px', fontSize: '1rem', marginRight: 'auto', marginLeft: 0 }}>{formatPrice(totalPrice)}</span>
          </button>
          
          <button className={styles.clearBtn} onClick={clearCart} style={{ fontFamily: 'Tajawal' }}>
            إفراغ سلة التبرع
          </button>

          <p className={styles.orderNote} style={{ fontFamily: 'Tajawal', textAlign: 'center' }}>
            <i className="fas fa-heart" style={{ color: '#e74c3c', marginLeft: '6px' }} />
            تقبل الله طاعاتكم وصالح أعمالكم وضاعف لكم الأجر والمثوبة.
          </p>
        </div>
      </div>
    </div>
  );
}
