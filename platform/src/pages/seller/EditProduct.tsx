import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '@/styles/pages/seller/EditProduct.css';
const NEW_CATEGORY_VALUE = '__new_category__';
const CATEGORY_STORAGE_KEY = 'sellerProductCategories';
const defaultCategories = ['Fresh Fruit', 'Pantry', 'Beverage', 'Gift Set', 'Bakery'];
const getStoredCategories = () => {
  const storedCategories = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
  if (!storedCategories) return defaultCategories;

  try {
    const parsedCategories = JSON.parse(storedCategories);
    return Array.isArray(parsedCategories) ? parsedCategories : defaultCategories;
  } catch {
    return defaultCategories;
  }
};

const saveCategory = (categoryName: string) => {
  const nextCategory = categoryName.trim();
  if (!nextCategory) return;

  const categories = getStoredCategories();
  if (categories.some((category) => category.toLowerCase() === nextCategory.toLowerCase())) return;

  window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([...categories, nextCategory]));
};

const mockProducts = {
  '1': {
    name: 'Organic Apple Box',
    category: 'Fresh Fruit',
    price: '24.00',
    stock: 18,
    createdAt: 'May 20, 2026, 10:30 AM',
  },
  '2': {
    name: 'Honey Oat Granola',
    category: 'Pantry',
    price: '12.50',
    stock: 42,
    createdAt: 'May 19, 2026, 2:15 PM',
  },
  '3': {
    name: 'Cold Brew Pack',
    category: 'Beverage',
    price: '18.00',
    stock: 9,
    createdAt: 'May 18, 2026, 9:45 AM',
  },
  '4': {
    name: 'Seasonal Jam Set',
    category: 'Gift Set',
    price: '32.00',
    stock: 0,
    createdAt: 'May 17, 2026, 4:20 PM',
  },
};

export default function SellerEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = mockProducts[productId as keyof typeof mockProducts] ?? mockProducts['1'];
  const [photoName, setPhotoName] = useState('');
  const [categories, setCategories] = useState(() => {
    const storedCategories = getStoredCategories();
    return storedCategories.includes(product.category) ? storedCategories : [...storedCategories, product.category];
  });
  const [category, setCategory] = useState(product.category);
  const [customCategory, setCustomCategory] = useState('');
  const createdAt = useMemo(() => product.createdAt, [product.createdAt]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (category === NEW_CATEGORY_VALUE) {
      saveCategory(customCategory);
      setCategories(getStoredCategories());
    }

    navigate('/products');
  };

  return (
    <div className="sellerEditProduct__page">
      <Link to="/products" className="sellerEditProduct__backLink">
        <ArrowLeft className="sellerEditProduct__backIcon" />
        Back to products
      </Link>

      <section className="sellerEditProduct__panel">
        <p className="sellerEditProduct__eyebrow">Edit Product</p>
        <h1 className="sellerEditProduct__title">Product #{productId}</h1>
        {/* <p className="sellerEditProduct__subtitle">Update product information, stock, category, and product photo.</p> */}

        <form id="edit-product-form" className="sellerEditProduct__form" onSubmit={handleSubmit}>
          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="product-name">
              Product name <span className="sellerEditProduct__required">*</span>
            </label>
            <input id="product-name" className="sellerEditProduct__input" defaultValue={product.name} placeholder="Product name" required />
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="category">
              Category <span className="sellerEditProduct__required">*</span>
            </label>
            <div className="sellerEditProduct__categoryFields">
              <select
                id="category"
                className="sellerEditProduct__select"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
                <option value={NEW_CATEGORY_VALUE}>Add new category</option>
              </select>

              {category === NEW_CATEGORY_VALUE && (
                <input
                  className="sellerEditProduct__input"
                  placeholder="New category name"
                  required
                  value={customCategory}
                  onChange={(event) => setCustomCategory(event.target.value)}
                />
              )}
            </div>
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="price">
              Price <span className="sellerEditProduct__required">*</span>
            </label>
            <input
              id="price"
              className="sellerEditProduct__input"
              defaultValue={product.price}
              inputMode="decimal"
              placeholder="0.00"
              required
              type="text"
            />
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="stock">
              Stock <span className="sellerEditProduct__required">*</span>
            </label>
            <input id="stock" className="sellerEditProduct__input" defaultValue={product.stock} min="0" placeholder="0" required type="number" />
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="created-at">
              Created time
            </label>
            <input id="created-at" className="sellerEditProduct__readonlyInput" readOnly value={createdAt} />
          </div>

          <div className="sellerEditProduct__wideField">
            <label className="sellerEditProduct__label" htmlFor="product-photo">
              Product photo
            </label>
            <label className="sellerEditProduct__uploadBox" htmlFor="product-photo">
              <ImagePlus className="sellerEditProduct__uploadIcon" />
              <span className="sellerEditProduct__uploadTitle">{photoName || 'Upload product photo'}</span>
              <span className="sellerEditProduct__uploadText">PNG, JPG</span>
            </label>
            <input
              id="product-photo"
              accept="image/png,image/jpeg,image/webp"
              className="sellerEditProduct__hiddenInput"
              type="file"
              onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')}
            />
          </div>
        </form>

        <div className="sellerEditProduct__actions">
          <Link to="/products" className="sellerEditProduct__secondaryButton">
            Cancel
          </Link>
          <button type="submit" form="edit-product-form" className="sellerEditProduct__primaryButton">
            <Save className="sellerEditProduct__buttonIcon" />
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}
