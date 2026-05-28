import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { mockProducts } from '@/mock/products';
import { styles } from '@/styles/pages/buyer/Products.styles';

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
    <div className={styles.page}>
      {/* 標題區 */}
      <div className={styles.style}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.mutedText}>Browse and shop products</p>
      </div>

      {/* 搜尋列 */}
      <div className={styles.style2}>
        <div className={styles.style3}>
          <Search className={styles.icon} />
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.style4}>
        <div className={styles.style5}>
          <div className={styles.panel}>
            <h3 className={styles.style6}>Filters</h3>
            <div className={styles.page2}>
              <label className={styles.style7}>Category</label>
              <select
                className={styles.input2}
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
        <div className={styles.style8}>
          {filteredProducts.length === 0 ? (
            <div className={styles.style9}>No products found.</div>
          ) : (
            <div className={styles.style10}>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`} 
                  className={styles.panel2}
                >
                  {/* 商品圖片 */}
                  <div className={styles.style11}>
                    <div className={styles.style12}>
                      Product
                    </div>
                  </div>

                  {/* 商品資訊 */}
                  <div className={styles.style13}>
                    <div className={styles.style14}>{product.category}</div>
                    <h3 className={styles.style15}>{product.name}</h3>
                    
                    <div className={styles.style16}>
                      <span className={styles.style17}>${product.price.toFixed(2)}</span>
                      <span className={`${styles.stockStatus} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
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
