import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* 訂單摘要 */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送與付款資訊 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Delivery Information</h2>
          <p className="text-sm text-gray-500 mb-6">Payment: Cash on Delivery (COD)</p>

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value="Demo Buyer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value="0912-000-111"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
              />
            </div>

            {/* 收件地址 (必填) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            {/* 備註 (選填) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm resize-none"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors text-base mt-2"
            >
              Place Order (COD)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
