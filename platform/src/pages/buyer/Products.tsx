import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { mockProducts } from '@/mock/products';

export default function BuyerProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 取得所有不重複的分類
  const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

  // 根據搜尋關鍵字與分類過濾商品
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 標題區 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
        <p className="text-gray-500 text-sm">Browse and shop products</p>
      </div>

      {/* 搜尋列 */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左側：過濾器 (Filters) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 右側：商品卡片網格 (Product Grid) */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  // 重點：點擊卡片會跳轉到詳細頁面，並帶上商品 ID
                  to={`/products/${product.id}`} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group"
                >
                  {/* 商品圖片 */}
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 relative overflow-hidden h-48">
                    {/* 我們先用個灰底假裝有圖片，並顯示商品名稱 */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium group-hover:scale-105 transition-transform duration-300">
                      Product
                    </div>
                  </div>

                  {/* 商品資訊 */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className={`text-xs font-medium ${product.stock > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}