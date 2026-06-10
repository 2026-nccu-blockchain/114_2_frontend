import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { mockProducts } from '@/mock/products';
import '@/styles/pages/buyer/Products.css';

export default function BuyerProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="buyerProducts__page">
      {/* 標題區 */}
      <div className="buyerProducts__style">
        <h1 className="buyerProducts__title">Products</h1>
        <p className="buyerProducts__mutedText">Browse and shop products</p>
      </div>

      {/* 搜尋列 */}
      <div className="buyerProducts__style2">
        <div className="buyerProducts__style3">
          <Search className="buyerProducts__icon" />
        </div>
        <input
          type="text"
          className="buyerProducts__input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="buyerProducts__style4">
        <div className="buyerProducts__style5">
          <div className="buyerProducts__panel">
            <h3 className="buyerProducts__style6">Filters</h3>
            <div className="buyerProducts__page2">
              <label className="buyerProducts__style7">Category</label>
              <select
                className="buyerProducts__input2"
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

        {/* 商品卡片網格 */}
        <div className="buyerProducts__style8">
          {filteredProducts.length === 0 ? (
            <div className="buyerProducts__style9">No products found.</div>
          ) : (
            <div className="buyerProducts__style10">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`} 
                  className="group buyerProducts__panel2"
                >
                  {/* 商品圖片 */}
                  <div className="buyerProducts__style11">
                    <div className="buyerProducts__style12">
                      Product
                    </div>
                  </div>

                  {/* 商品資訊 */}
                  <div className="buyerProducts__style13">
                    <div className="buyerProducts__style14">{product.category}</div>
                    <h3 className="buyerProducts__style15">{product.name}</h3>
                    
                    <div className="buyerProducts__style16">
                      <span className="buyerProducts__style17">${product.price.toFixed(2)}</span>
                      <span className={`${'buyerProducts__stockStatus'} ${product.stock > 0 ? 'buyerProducts__inStock' : 'buyerProducts__outOfStock'}`}>
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
