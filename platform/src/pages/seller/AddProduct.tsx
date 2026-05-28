import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '@/styles/pages/seller/AddProduct.styles';
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
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>
        <ArrowLeft className={styles.backIcon} />
        Back to products
      </Link>

      <section className={styles.panel}>
        <p className={styles.eyebrow}>Add Product</p>
        <h1 className={styles.title}>Create a new product</h1>
        <p className={styles.subtitle}>Add product information, stock, category, and product photo.</p>

        <form id="add-product-form" className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-name">
              Product name <span className={styles.required}>*</span>
            </label>
            <input id="product-name" className={styles.input} placeholder="Product name" required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Category <span className={styles.required}>*</span>
            </label>
            <div className={styles.categoryFields}>
              <select
                id="category"
                className={styles.select}
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
                  className={styles.input}
                  placeholder="New category name"
                  required
                  value={customCategory}
                  onChange={(event) => setCustomCategory(event.target.value)}
                />
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              Price <span className={styles.required}>*</span>
            </label>
            <input id="price" className={styles.input} inputMode="decimal" placeholder="0" required type="text" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="stock">
              Stock <span className={styles.required}>*</span>
            </label>
            <input id="stock" className={styles.input} min="0" placeholder="0" required type="number" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="created-at">
              Created time
            </label>
            <input id="created-at" className={styles.readonlyInput} readOnly value={createdAt} />
          </div>

          <div className={styles.wideField}>
            <label className={styles.label} htmlFor="product-photo">
              Product photo <span className={styles.required}>*</span>
            </label>
            <label className={styles.uploadBox} htmlFor="product-photo">
              <ImagePlus className={styles.uploadIcon} />
              <span className={styles.uploadTitle}>{photoName || 'Upload product photo'}</span>
              <span className={styles.uploadText}>PNG, JPG, or WebP up to 10MB</span>
            </label>
            <input
              id="product-photo"
              accept="image/png,image/jpeg,image/webp"
              className={styles.hiddenInput}
              required
              type="file"
              onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')}
            />
          </div>
        </form>

        <div className={styles.actions}>
          <Link to="/products" className={styles.secondaryButton}>
            Cancel
          </Link>
          <button type="submit" form="add-product-form" className={styles.primaryButton}>
            <Save className={styles.buttonIcon} />
            Create Product
          </button>
        </div>
      </section>
    </div>
  );
}
