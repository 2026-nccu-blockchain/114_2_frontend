import { Edit3, Package, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/styles/pages/seller/Products.module.css';
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  sold: number;
  active: boolean;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Apple Box',
    category: 'Fresh Fruit',
    price: '$24.00',
    stock: 18,
    sold: 94,
    active: true,
  },
  {
    id: 2,
    name: 'Honey Oat Granola',
    category: 'Pantry',
    price: '$12.50',
    stock: 42,
    sold: 128,
    active: true,
  },
  {
    id: 3,
    name: 'Cold Brew Pack',
    category: 'Beverage',
    price: '$18.00',
    stock: 9,
    sold: 67,
    active: true,
  },
  {
    id: 4,
    name: 'Seasonal Jam Set',
    category: 'Gift Set',
    price: '$32.00',
    stock: 0,
    sold: 53,
    active: false,
  },
];

function ProductCard({
  product,
  onToggle,
}: {
  product: Product;
  onToggle: (id: number) => void;
}) {
  const editPath = `/products/${product.id}/edit`;

  return (
    <article className={`${styles['card']} ${product.active ? '' : styles['cardInactive']}`}>
      <Link to={editPath} className={styles['cardLink']}>
        <div className={styles['image']}>
          <Package className={styles['imageIcon']} />
        </div>
      </Link>

      <div className={styles['body']}>
        <div className={styles['top']}>
          <Link to={editPath} className={styles['cardLink']}>
            <h3 className={styles['name']}>{product.name}</h3>
            <p className={styles['category']}>{product.category}</p>
          </Link>

          <p className={styles['price']}>{product.price}</p>
        </div>

        <div className={styles['meta']}>
          <div>
            <p className={styles['metaLabel']}>Stock</p>
            <p className={styles['metaValue']}>{product.stock}</p>
          </div>
          <div>
            <p className={styles['metaLabel']}>Sold</p>
            <p className={styles['metaValue']}>{product.sold}</p>
          </div>
        </div>

        <div className={styles['actions']}>
          <Link to={editPath} className={styles['editButton']}>
            <Edit3 className={styles['editIcon']} />
            Edit
          </Link>

          <span className={`${styles['status']} ${product.active ? styles['statusActive'] : styles['statusInactive']}`}>
            {product.active ? 'Online' : 'Deactivated'}
          </span>

          <button
            type="button"
            onClick={() => onToggle(product.id)}
            className={`${styles['toggle']} ${product.active ? styles['toggleActive'] : styles['toggleInactive']}`}
            aria-label={product.active ? 'Deactivate product' : 'Activate product'}
          >
            <span className={`${styles['thumb']} ${product.active ? styles['thumbActive'] : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SellerProducts() {
  const [products, setProducts] = useState(initialProducts);

  const activeProducts = useMemo(() => products.filter((product) => product.active), [products]);
  const deactivatedProducts = useMemo(() => products.filter((product) => !product.active), [products]);

  const toggleProduct = (id: number) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product,
      ),
    );
  };

  return (
    <div className={styles['page']}>
      <header className={styles['header']}>
        <div>
          <p className={styles['eyebrow']}>Seller Products</p>
          <h1 className={styles['title']}>Product management</h1>
          
        </div>

        <Link to="/add-product" className={styles['addButton']}>
          <PlusCircle className={styles['addButtonIcon']} />
          Add Product
        </Link>
      </header>

      <section className={styles['section']}>
        <div className={styles['sectionHeader']}>
          <div className={styles['sectionTitleWrap']}>
            <Package className={styles['sectionIcon']} />
            <h2 className={styles['sectionTitle']}>Active Products</h2>
          </div>
          <span className={styles['count']}>{activeProducts.length}</span>
        </div>

        {activeProducts.length > 0 ? (
          <div className={styles['grid']}>
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className={styles['empty']}>
            <p className={styles['emptyTitle']}>No active products</p>
            <p className={styles['emptyText']}>Activate a product or add a new one to start selling.</p>
          </div>
        )}
      </section>

      <section className={styles['section']}>
        <div className={styles['sectionHeader']}>
          <div className={styles['sectionTitleWrap']}>
            <Package className={styles['sectionIcon']} />
            <h2 className={styles['sectionTitle']}>Deactivated Products</h2>
          </div>
          <span className={styles['count']}>{deactivatedProducts.length}</span>
        </div>

        {deactivatedProducts.length > 0 ? (
          <div className={styles['grid']}>
            {deactivatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className={styles['empty']}>
            <p className={styles['emptyTitle']}>No deactivated products</p>
            <p className={styles['emptyText']}>Products you turn off will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
