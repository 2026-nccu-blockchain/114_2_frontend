import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { mockProducts } from '@/mock/products';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import '@/styles/pages/buyer/ProductDetail.css';


export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const addItem = useCartStore((state) => state.addItem); 
  const {role} = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="buyerProductDetail__style">
        <h2 className="buyerProductDetail__title">Product not found</h2>
        <button onClick={() => navigate('/')} className="buyerProductDetail__primaryButton">
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
        className: 'buyerProductDetail__errorToast',
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
      className: 'buyerProductDetail__successToast',
      iconTheme: {
        primary: '#14b8a6',
        secondary: '#fff',
      },
    });
  };

  return (
    <div className="buyerProductDetail__page">
      {/* 頂部返回按鈕 */}
      <button 
        onClick={() => navigate(-1)} 
        className="buyerProductDetail__style2"
      >
        <ArrowLeft className="buyerProductDetail__icon" />
        Back
      </button>

      <div className="buyerProductDetail__panel">
        {/* 商品大圖區 */}
        <div className="buyerProductDetail__style3">
          <span className="buyerProductDetail__style4">Product</span>
        </div>

        {/* 商品資訊區 */}
        <div className="buyerProductDetail__style5">
          {/* 分類標籤 */}
          <div className="buyerProductDetail__style6">
             <span className="buyerProductDetail__style7">
               {product.category}
             </span>
          </div>

          <h1 className="buyerProductDetail__title2">{product.name}</h1>
          
          <div className="buyerProductDetail__style8">
            <span className="buyerProductDetail__title3">${product.price.toFixed(2)}</span>
            <div className={`${'buyerProductDetail__stockStatus'} ${product.stock > 0 ? 'buyerProductDetail__inStock' : 'buyerProductDetail__outOfStock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          <div className="buyerProductDetail__style9">
            <h3 className="buyerProductDetail__style10">Description</h3>
            <p className="buyerProductDetail__style11">
              {product.description}
            </p>
          </div>

          {/* 底部操作區 */}
          <div className="buyerProductDetail__style12">
            {/* 賣家資訊 */}
            <div className="buyerProductDetail__style13">
               <h3 className="buyerProductDetail__style14">Seller</h3>
               <p className="buyerProductDetail__style15">{product.sellerName}</p>
            </div>

            {/* 加入購物車按鈕群 */}
            <div className="buyerProductDetail__style16">
              {/* 數量選擇器 */}
              <div className="buyerProductDetail__icon2">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="buyerProductDetail__style17"
                >
                  <Minus className="buyerProductDetail__icon3" />
                </button>
                <span className="buyerProductDetail__style18">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="buyerProductDetail__style17"
                >
                  <Plus className="buyerProductDetail__icon3" />
                </button>
              </div>

              {/* Add to Cart 按鈕 */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="buyerProductDetail__primaryButton2"
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
