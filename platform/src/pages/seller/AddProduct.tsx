import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@/styles/pages/seller/AddProduct.css';
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

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [photoName, setPhotoName] = useState('');
  const [categories, setCategories] = useState(getStoredCategories);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const createdAt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (category === NEW_CATEGORY_VALUE) {
      saveCategory(customCategory);
      setCategories(getStoredCategories());
    }

    navigate('/products');
  };

  return (
    <div className="sellerAddProduct__page">
      <Link to="/products" className="sellerAddProduct__backLink">
        <ArrowLeft className="sellerAddProduct__backIcon" />
        Back to products
      </Link>

      <section className="sellerAddProduct__panel">
        <p className="sellerAddProduct__eyebrow">Add Product</p>
        <h1 className="sellerAddProduct__title">Create a new product</h1>
        <p className="sellerAddProduct__subtitle">Add product information, stock, category, and product photo.</p>

        <form id="add-product-form" className="sellerAddProduct__form" onSubmit={handleSubmit}>
          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="product-name">
              Product name <span className="sellerAddProduct__required">*</span>
            </label>
            <input id="product-name" className="sellerAddProduct__input" placeholder="Product name" required />
          </div>

          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="category">
              Category <span className="sellerAddProduct__required">*</span>
            </label>
            <div className="sellerAddProduct__categoryFields">
              <select
                id="category"
                className="sellerAddProduct__select"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
                <option value={NEW_CATEGORY_VALUE}>Add new category</option>
              </select>

              {category === NEW_CATEGORY_VALUE && (
                <input
                  className="sellerAddProduct__input"
                  placeholder="New category name"
                  required
                  value={customCategory}
                  onChange={(event) => setCustomCategory(event.target.value)}
                />
              )}
            </div>
          </div>

          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="price">
              Price <span className="sellerAddProduct__required">*</span>
            </label>
            <input id="price" className="sellerAddProduct__input" inputMode="decimal" placeholder="0" required type="text" />
          </div>

          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="stock">
              Stock <span className="sellerAddProduct__required">*</span>
            </label>
            <input id="stock" className="sellerAddProduct__input" min="0" placeholder="0" required type="number" />
          </div>

          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="created-at">
              Created time
            </label>
            <input id="created-at" className="sellerAddProduct__readonlyInput" readOnly value={createdAt} />
          </div>

          <div className="sellerAddProduct__wideField">
            <label className="sellerAddProduct__label" htmlFor="product-photo">
              Product photo <span className="sellerAddProduct__required">*</span>
            </label>
            <label className="sellerAddProduct__uploadBox" htmlFor="product-photo">
              <ImagePlus className="sellerAddProduct__uploadIcon" />
              <span className="sellerAddProduct__uploadTitle">{photoName || 'Upload product photo'}</span>
              <span className="sellerAddProduct__uploadText">PNG, JPG, or WebP up to 10MB</span>
            </label>
            <input
              id="product-photo"
              accept="image/png,image/jpeg,image/webp"
              className="sellerAddProduct__hiddenInput"
              required
              type="file"
              onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')}
            />
          </div>
        </form>

        <div className="sellerAddProduct__actions">
          <Link to="/products" className="sellerAddProduct__secondaryButton">
            Cancel
          </Link>
          <button type="submit" form="add-product-form" className="sellerAddProduct__primaryButton">
            <Save className="sellerAddProduct__buttonIcon" />
            Create Product
          </button>
        </div>
      </section>
    </div>
  );
}
