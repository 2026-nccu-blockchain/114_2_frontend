import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import '@/styles/pages/buyer/Checkout.css';

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

  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
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
    <div className="buyerCheckout__page">
      <h1 className="buyerCheckout__title">Checkout</h1>

      {/* 訂單摘要 */}
      <div className="buyerCheckout__panel">
        <div className="buyerCheckout__style">
          <h2 className="buyerCheckout__sectionTitle">Order Summary</h2>
          <ul className="buyerCheckout__page2">
            {items.map((item) => (
              <li key={item.id} className="buyerCheckout__style2">
                <span>{item.name} x {item.quantity}</span>
                <span className="buyerCheckout__style3">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="buyerCheckout__style4">
            <span className="buyerCheckout__style5">Total</span>
            <span className="buyerCheckout__style6">${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送與付款資訊 */}
      <div className="buyerCheckout__panel2">
        <div className="buyerCheckout__style">
          <h2 className="buyerCheckout__sectionTitle2">Delivery Information</h2>
          <p className="buyerCheckout__mutedText">Payment: Cash on Delivery (COD)</p>

          <form onSubmit={handlePlaceOrder} className="buyerCheckout__page3">
            <div>
              <label className="buyerCheckout__style7">
                Recipient Name <span className="buyerCheckout__required">*</span>
              </label>
              <input
                type="text"
                disabled
                value="Demo Buyer"
                className="buyerCheckout__mutedText2"
              />
            </div>

            <div>
              <label className="buyerCheckout__style7">
                Phone Number <span className="buyerCheckout__required">*</span>
              </label>
              <input
                type="text"
                disabled
                value="0912-000-111"
                className="buyerCheckout__mutedText2"
              />
            </div>

            {/* 收件地址 (必填) */}
            <div>
              <label className="buyerCheckout__style7">
                Shipping Address <span className="buyerCheckout__required">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className="buyerCheckout__input"
              />
            </div>

            {/* 備註 (選填) */}
            <div>
              <label className="buyerCheckout__style7">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery"
                className="buyerCheckout__input2"
              />
            </div>
            
            <button
              type="submit"
              className="buyerCheckout__primaryButton"
            >
              Place Order (COD)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
