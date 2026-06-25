import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import type { ProductItem } from '@/services/productService';
import '@/styles/pages/buyer/Products.css';

export default function BuyerProducts() {
  const { getPublicProducts, loading, error } = useProduct();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getPublicProducts();
      if (!data) return;
      setProducts(data.filter((product) => product.status));
    };

    void loadProducts();
  }, [getPublicProducts]);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.status),
    [products],
  );

  const categories = useMemo(() => ['All', ...new Set(visibleProducts.map(p => p.type))], [visibleProducts]);

  const filteredProducts = visibleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.type === selectedCategory;
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
          {loading && products.length === 0 ? (
            <div className="buyerProducts__style9">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : error && products.length === 0 ? (
            <div className="buyerProducts__style9">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="buyerProducts__style9">No products found.</div>
          ) : (
            <div className="buyerProducts__style10">
              {filteredProducts.map((product) => (
                <Link
                  key={product.pid}
                  to={`/products/${product.pid}`} 
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
                    <div className="buyerProducts__style14">{product.type}</div>
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
