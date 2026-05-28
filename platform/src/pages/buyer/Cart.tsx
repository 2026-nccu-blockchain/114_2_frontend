import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Inbox } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { styles } from '@/styles/pages/buyer/Cart.styles';

export default function BuyerCart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Shopping Cart</h1>
        
        <div className={styles.style}>
          <div className={styles.style2}>
            <Inbox className={styles.icon} />
          </div>
          <h2 className={styles.sectionTitle}>Your cart is empty</h2>
          <p className={styles.mutedText}>Browse products and add items to your cart.</p>
          <button
            onClick={() => navigate('/')}
            className={styles.primaryButton}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page2}>
      {/* 標題與清空按鈕 */}
      <div className={styles.style3}>
        <h1 className={styles.title2}>Shopping Cart</h1>
        <button
          onClick={clearCart}
          className={styles.style4}
        >
          Clear all
        </button>
      </div>

      {/* 商品列表區塊 */}
      <div className={styles.panel}>
        <ul className={styles.style5}>
          {items.map((item) => (
            <li key={item.id} className={styles.style6}>
              {/* 商品圖片 */}
              <div className={styles.style7}>
                <span className={styles.style8}>Product</span>
              </div>

              {/* 商品名稱與資訊 */}
              <div className={styles.style9}>
                <Link to={`/products/${item.id}`} className={styles.style10}>
                  {item.name}
                </Link>
                <p className={styles.mutedText2}>${item.price.toFixed(2)} each</p>
              </div>

              {/* 操作區塊 (數量與刪除) */}
              <div className={styles.style11}>
                {/* 數量選擇器 */}
                <div className={styles.icon2}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className={styles.style12}
                  >
                    <Minus className={styles.icon3} />
                  </button>
                  <span className={styles.style13}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className={styles.style12}
                  >
                    <Plus className={styles.icon3} />
                  </button>
                </div>

                {/* 單品總價 */}
                <div className={styles.style14}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* 刪除按鈕 */}
                <button
                  onClick={() => removeItem(item.id)}
                  className={styles.style15}
                  aria-label="Remove item"
                >
                  <Trash2 className={styles.icon4} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 結帳總計區塊 */}
      <div className={styles.panel2}>
        <div className={styles.style3}>
          <span className={styles.style16}>Subtotal ({items.length} items)</span>
          <span className={styles.title2}>${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => navigate('/checkout')}
          className={styles.primaryButton2}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}