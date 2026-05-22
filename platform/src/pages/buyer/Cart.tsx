import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Inbox } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function BuyerCart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-900 self-start mb-16 w-full">Shopping Cart</h1>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Browse products and add items to your cart.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 標題與清空按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* 商品列表區塊 */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="p-6 flex items-center flex-col sm:flex-row gap-6">
              {/* 商品圖片 */}
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                <span className="text-[10px] text-gray-400">Product</span>
              </div>

              {/* 商品名稱與資訊 */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="text-base font-medium text-gray-900 hover:text-teal-600 truncate block">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
              </div>

              {/* 操作區塊 (數量與刪除) */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* 數量選擇器 */}
                <div className="flex items-center border border-gray-300 rounded-lg h-9 w-28">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 單品總價 */}
                <div className="text-base font-bold text-gray-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* 刪除按鈕 */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 結帳總計區塊 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600 font-medium">Subtotal ({items.length} items)</span>
          <span className="text-2xl font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors text-base">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}