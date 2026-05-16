import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { mockProducts } from '@/mock/products';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetail() {
  // 1. 從網址取得 :id 參數
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 2. 從 Zustand 取得加入購物車的方法
  const addItem = useCartStore((state) => state.addItem);
  
  // 3. 本地元數量狀態 (預設為 1)
  const [quantity, setQuantity] = useState(1);

  // 4. 尋找對應的商品資料
  const product = mockProducts.find((p) => p.id === id);

  // 防呆機制：如果找不到商品
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="text-teal-600 hover:underline">
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
    addItem(product, quantity);
    alert(`Success! Added ${quantity} x ${product.name} to your cart.`);
    // 實務上這裡可以改成跳出一個漂亮的 Toast 提示，或直接導向購物車頁面
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 頂部返回按鈕 */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* 左側：商品大圖區 */}
        <div className="md:w-1/2 bg-gray-50 relative flex items-center justify-center min-h-[300px] border-r border-gray-100">
          <span className="text-4xl text-gray-300 font-medium tracking-wider">Product</span>
        </div>

        {/* 右側：商品資訊區 */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          {/* 分類標籤 */}
          <div className="mb-4">
             <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
               {product.category}
             </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="mb-6 pb-6 border-b border-gray-100">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <div className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* 底部操作區 */}
          <div className="mt-auto">
            {/* 賣家資訊 */}
            <div className="mb-6">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Seller</h3>
               <p className="text-sm text-gray-900">{product.sellerName}</p>
            </div>

            {/* 加入購物車按鈕群 */}
            <div className="flex items-center gap-4">
              {/* 數量選擇器 */}
              <div className="flex items-center border border-gray-300 rounded-lg h-11 w-32">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart 按鈕 */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium h-11 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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