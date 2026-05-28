import { Edit3, Package, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/pages/seller/Products.css';
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
    <article className={`${'sellerProducts__card'} ${product.active ? '' : 'sellerProducts__cardInactive'}`}>
      <Link to={editPath} className="sellerProducts__cardLink">
        <div className="sellerProducts__image">
          <Package className="sellerProducts__imageIcon" />
        </div>
      </Link>

      <div className="sellerProducts__body">
        <div className="sellerProducts__top">
          <Link to={editPath} className="sellerProducts__cardLink">
            <h3 className="sellerProducts__name">{product.name}</h3>
            <p className="sellerProducts__category">{product.category}</p>
          </Link>

          <p className="sellerProducts__price">{product.price}</p>
        </div>

        <div className="sellerProducts__meta">
          <div>
            <p className="sellerProducts__metaLabel">Stock</p>
            <p className="sellerProducts__metaValue">{product.stock}</p>
          </div>
          <div>
            <p className="sellerProducts__metaLabel">Sold</p>
            <p className="sellerProducts__metaValue">{product.sold}</p>
          </div>
        </div>

        <div className="sellerProducts__actions">
          <Link to={editPath} className="sellerProducts__editButton">
            <Edit3 className="sellerProducts__editIcon" />
            Edit
          </Link>

          <span className={`${'sellerProducts__status'} ${product.active ? 'sellerProducts__statusActive' : 'sellerProducts__statusInactive'}`}>
            {product.active ? 'Online' : 'Deactivated'}
          </span>

          <button
            type="button"
            onClick={() => onToggle(product.id)}
            className={`${'sellerProducts__toggle'} ${product.active ? 'sellerProducts__toggleActive' : 'sellerProducts__toggleInactive'}`}
            aria-label={product.active ? 'Deactivate product' : 'Activate product'}
          >
            <span className={`${'sellerProducts__thumb'} ${product.active ? 'sellerProducts__thumbActive' : ''}`} />
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
    <div className="sellerProducts__page">
      <header className="sellerProducts__header">
        <div>
          <p className="sellerProducts__eyebrow">Seller Products</p>
          <h1 className="sellerProducts__title">Product management</h1>
          
        </div>

        <Link to="/add-product" className="sellerProducts__addButton">
          <PlusCircle className="sellerProducts__addButtonIcon" />
          Add Product
        </Link>
      </header>

      <section className="sellerProducts__section">
        <div className="sellerProducts__sectionHeader">
          <div className="sellerProducts__sectionTitleWrap">
            <Package className="sellerProducts__sectionIcon" />
            <h2 className="sellerProducts__sectionTitle">Active Products</h2>
          </div>
          <span className="sellerProducts__count">{activeProducts.length}</span>
        </div>

        {activeProducts.length > 0 ? (
          <div className="sellerProducts__grid">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className="sellerProducts__empty">
            <p className="sellerProducts__emptyTitle">No active products</p>
            <p className="sellerProducts__emptyText">Activate a product or add a new one to start selling.</p>
          </div>
        )}
      </section>

      <section className="sellerProducts__section">
        <div className="sellerProducts__sectionHeader">
          <div className="sellerProducts__sectionTitleWrap">
            <Package className="sellerProducts__sectionIcon" />
            <h2 className="sellerProducts__sectionTitle">Deactivated Products</h2>
          </div>
          <span className="sellerProducts__count">{deactivatedProducts.length}</span>
        </div>

        {deactivatedProducts.length > 0 ? (
          <div className="sellerProducts__grid">
            {deactivatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className="sellerProducts__empty">
            <p className="sellerProducts__emptyTitle">No deactivated products</p>
            <p className="sellerProducts__emptyText">Products you turn off will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
