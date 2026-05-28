import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Inbox } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import '@/styles/pages/buyer/Cart.css';

export default function BuyerCart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="buyerCart__page">
        <h1 className="buyerCart__title">Shopping Cart</h1>
        
        <div className="buyerCart__style">
          <div className="buyerCart__style2">
            <Inbox className="buyerCart__icon" />
          </div>
          <h2 className="buyerCart__sectionTitle">Your cart is empty</h2>
          <p className="buyerCart__mutedText">Browse products and add items to your cart.</p>
          <button
            onClick={() => navigate('/')}
            className="buyerCart__primaryButton"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="buyerCart__page2">
      {/* 標題與清空按鈕 */}
      <div className="buyerCart__style3">
        <h1 className="buyerCart__title2">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="buyerCart__style4"
        >
          Clear all
        </button>
      </div>

      {/* 商品列表區塊 */}
      <div className="buyerCart__panel">
        <ul className="buyerCart__style5">
          {items.map((item) => (
            <li key={item.id} className="buyerCart__style6">
              {/* 商品圖片 */}
              <div className="buyerCart__style7">
                <span className="buyerCart__style8">Product</span>
              </div>

              {/* 商品名稱與資訊 */}
              <div className="buyerCart__style9">
                <Link to={`/products/${item.id}`} className="buyerCart__style10">
                  {item.name}
                </Link>
                <p className="buyerCart__mutedText2">${item.price.toFixed(2)} each</p>
              </div>

              {/* 操作區塊 (數量與刪除) */}
              <div className="buyerCart__style11">
                {/* 數量選擇器 */}
                <div className="buyerCart__icon2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="buyerCart__style12"
                  >
                    <Minus className="buyerCart__icon3" />
                  </button>
                  <span className="buyerCart__style13">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="buyerCart__style12"
                  >
                    <Plus className="buyerCart__icon3" />
                  </button>
                </div>

                {/* 單品總價 */}
                <div className="buyerCart__style14">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* 刪除按鈕 */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="buyerCart__style15"
                  aria-label="Remove item"
                >
                  <Trash2 className="buyerCart__icon4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 結帳總計區塊 */}
      <div className="buyerCart__panel2">
        <div className="buyerCart__style3">
          <span className="buyerCart__style16">Subtotal ({items.length} items)</span>
          <span className="buyerCart__title2">${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => navigate('/checkout')}
          className="buyerCart__primaryButton2">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}