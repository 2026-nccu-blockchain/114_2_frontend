import { Edit3, Package, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: 'space-y-8',
  header: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  subtitle: 'mt-1 text-sm text-gray-500',
  addButton:
    'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
  addButtonIcon: 'h-4 w-4',
  section: 'space-y-4',
  sectionHeader: 'flex items-center justify-between gap-3',
  sectionTitleWrap: 'flex items-center gap-3',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  sectionIcon: 'h-5 w-5 text-teal-600',
  count: 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600',
  grid: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  card: 'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-teal-300',
  cardInactive: 'bg-gray-50 opacity-80 hover:border-gray-300',
  cardLink: 'block text-left',
  image: 'flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-gray-300',
  imageIcon: 'h-12 w-12',
  body: 'space-y-4 p-4',
  top: 'flex items-start justify-between gap-3',
  name: 'text-base font-semibold text-gray-900',
  category: 'mt-1 text-sm text-gray-500',
  price: 'text-base font-semibold text-gray-900',
  meta: 'grid grid-cols-2 gap-3 text-sm',
  metaLabel: 'text-gray-500',
  metaValue: 'mt-1 font-medium text-gray-900',
  actions: 'flex items-center justify-between gap-3 border-t border-gray-100 pt-4',
  editButton:
    'inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700',
  editIcon: 'h-4 w-4',
  status: 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  statusActive: 'bg-emerald-50 text-emerald-700',
  statusInactive: 'bg-gray-200 text-gray-600',
  toggle:
    'inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
  toggleActive: 'bg-teal-600',
  toggleInactive: 'bg-gray-300',
  thumb: 'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
  thumbActive: 'translate-x-5',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center',
  emptyTitle: 'text-base font-semibold text-gray-900',
  emptyText: 'mt-1 text-sm text-gray-500',
};

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
    <article className={`${styles.card} ${product.active ? '' : styles.cardInactive}`}>
      <Link to={editPath} className={styles.cardLink}>
        <div className={styles.image}>
          <Package className={styles.imageIcon} />
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.top}>
          <Link to={editPath} className={styles.cardLink}>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.category}>{product.category}</p>
          </Link>

          <p className={styles.price}>{product.price}</p>
        </div>

        <div className={styles.meta}>
          <div>
            <p className={styles.metaLabel}>Stock</p>
            <p className={styles.metaValue}>{product.stock}</p>
          </div>
          <div>
            <p className={styles.metaLabel}>Sold</p>
            <p className={styles.metaValue}>{product.sold}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to={editPath} className={styles.editButton}>
            <Edit3 className={styles.editIcon} />
            Edit
          </Link>

          <span className={`${styles.status} ${product.active ? styles.statusActive : styles.statusInactive}`}>
            {product.active ? 'Online' : 'Deactivated'}
          </span>

          <button
            type="button"
            onClick={() => onToggle(product.id)}
            className={`${styles.toggle} ${product.active ? styles.toggleActive : styles.toggleInactive}`}
            aria-label={product.active ? 'Deactivate product' : 'Activate product'}
          >
            <span className={`${styles.thumb} ${product.active ? styles.thumbActive : ''}`} />
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
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Seller Products</p>
          <h1 className={styles.title}>Product management</h1>
          {/* <p className={styles.subtitle}>Control product listings, stock, and online status.</p> */}
        </div>

        <Link to="/add-product" className={styles.addButton}>
          <PlusCircle className={styles.addButtonIcon} />
          Add Product
        </Link>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <Package className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Active Products</h2>
          </div>
          <span className={styles.count}>{activeProducts.length}</span>
        </div>

        {activeProducts.length > 0 ? (
          <div className={styles.grid}>
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No active products</p>
            <p className={styles.emptyText}>Activate a product or add a new one to start selling.</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <Package className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Deactivated Products</h2>
          </div>
          <span className={styles.count}>{deactivatedProducts.length}</span>
        </div>

        {deactivatedProducts.length > 0 ? (
          <div className={styles.grid}>
            {deactivatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onToggle={toggleProduct} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No deactivated products</p>
            <p className={styles.emptyText}>Products you turn off will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
