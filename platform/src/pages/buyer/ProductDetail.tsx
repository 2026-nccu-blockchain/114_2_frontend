import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { mockProducts } from '@/mock/products';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { styles } from './ProductDetail.styles';


export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const addItem = useCartStore((state) => state.addItem); 
  const {role} = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className={styles.style}>
        <h2 className={styles.title}>Product not found</h2>
        <button onClick={() => navigate('/')} className={styles.primaryButton}>
          Return to Home
        </button>
      </div>
    );
  }

  // 處理數量增減
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  // 加入購物車
  const handleAddToCart = () => {
    if (!role) {
      toast.error('Please sign in to add items to your cart.', {
        className: styles.errorToast,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    addItem(product, quantity);

    toast.success(`${product.name} added to cart`, {
      className: styles.successToast,
      iconTheme: {
        primary: '#14b8a6',
        secondary: '#fff',
      },
    });
  };

  return (
    <div className={styles.page}>
      {/* 頂部返回按鈕 */}
      <button 
        onClick={() => navigate(-1)} 
        className={styles.style2}
      >
        <ArrowLeft className={styles.icon} />
        Back
      </button>

      <div className={styles.panel}>
        {/* 商品大圖區 */}
        <div className={styles.style3}>
          <span className={styles.style4}>Product</span>
        </div>

        {/* 商品資訊區 */}
        <div className={styles.style5}>
          {/* 分類標籤 */}
          <div className={styles.style6}>
             <span className={styles.style7}>
               {product.category}
             </span>
          </div>

          <h1 className={styles.title2}>{product.name}</h1>
          
          <div className={styles.style8}>
            <span className={styles.title3}>${product.price.toFixed(2)}</span>
            <div className={`${styles.stockStatus} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          <div className={styles.style9}>
            <h3 className={styles.style10}>Description</h3>
            <p className={styles.style11}>
              {product.description}
            </p>
          </div>

          {/* 底部操作區 */}
          <div className={styles.style12}>
            {/* 賣家資訊 */}
            <div className={styles.style13}>
               <h3 className={styles.style14}>Seller</h3>
               <p className={styles.style15}>{product.sellerName}</p>
            </div>

            {/* 加入購物車按鈕群 */}
            <div className={styles.style16}>
              {/* 數量選擇器 */}
              <div className={styles.icon2}>
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={styles.style17}
                >
                  <Minus className={styles.icon3} />
                </button>
                <span className={styles.style18}>{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className={styles.style17}
                >
                  <Plus className={styles.icon3} />
                </button>
              </div>

              {/* Add to Cart 按鈕 */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={styles.primaryButton2}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
