import { useState, useEffect, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { styles } from './Checkout.styles';

export default function BuyerCheckout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // 表單狀態
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // 如果購物車是空的
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items, navigate]);

  const handlePlaceOrder = (e: SubmitEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error('Please enter your shipping address');
      return;
    }
    
    const addOrder = useOrderStore.getState().addOrder;
    addOrder({
      items,
      total: getTotalPrice(),
      recipientName: 'Demo Buyer',
      phone: '0912-000-111',
      address: address,
      notes: notes,
    });

    // 模擬送出訂單到後端
    toast.success('Order placed successfully!', {
      style: { border: '1px solid #14b8a6', padding: '12px 16px', color: '#1f2937' },
      iconTheme: { primary: '#14b8a6', secondary: '#fff' },
    });
    
    clearCart();
    navigate('/orders'); // 導向「我的訂單」頁面
  };

  if (items.length === 0) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>

      {/* 訂單摘要 */}
      <div className={styles.panel}>
        <div className={styles.style}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <ul className={styles.page2}>
            {items.map((item) => (
              <li key={item.id} className={styles.style2}>
                <span>{item.name} x {item.quantity}</span>
                <span className={styles.style3}>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.style4}>
            <span className={styles.style5}>Total</span>
            <span className={styles.style6}>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送與付款資訊 */}
      <div className={styles.panel2}>
        <div className={styles.style}>
          <h2 className={styles.sectionTitle2}>Delivery Information</h2>
          <p className={styles.mutedText}>Payment: Cash on Delivery (COD)</p>

          <form onSubmit={handlePlaceOrder} className={styles.page3}>
            <div>
              <label className={styles.style7}>
                Recipient Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                disabled
                value="Demo Buyer"
                className={styles.mutedText2}
              />
            </div>

            <div>
              <label className={styles.style7}>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                disabled
                value="0912-000-111"
                className={styles.mutedText2}
              />
            </div>

            {/* 收件地址 (必填) */}
            <div>
              <label className={styles.style7}>
                Shipping Address <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className={styles.input}
              />
            </div>

            {/* 備註 (選填) */}
            <div>
              <label className={styles.style7}>
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery"
                className={styles.input2}
              />
            </div>
            
            <button
              type="submit"
              className={styles.primaryButton}
            >
              Place Order (COD)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
