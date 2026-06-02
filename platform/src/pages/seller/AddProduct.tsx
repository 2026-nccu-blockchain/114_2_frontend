import { ArrowLeft, ImagePlus, Save, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useUpload } from '@/hooks/useUpload';
import { useProfile } from '@/hooks/useProfile';
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

interface Variant {
  id: string;
  type: string;
  price: string;
  stock: string;
}

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const { addProduct, addProductType, loading: submitting } = useProduct();
  const { upload, uploading } = useUpload();
  const { fetchProfile } = useProfile();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [categories, setCategories] = useState(getStoredCategories);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [variants, setVariants] = useState<Variant[]>([
    { id: crypto.randomUUID(), type: '', price: '', stock: '' }
  ]);

  useEffect(() => {
    const getEmail = async () => {
      const profile = await fetchProfile();
      if (profile) setEmail(profile.email);
    };
    getEmail();
  }, []);

  const createdAt = useMemo(
    () => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    [],
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPhotoName(file.name);
    const url = await upload(file, email);
    if (url) setProductUrl(url);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { id: crypto.randomUUID(), type: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: string) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (variants.length === 0) return;

    let finalCategory = category;
    if (category === NEW_CATEGORY_VALUE) {
      saveCategory(customCategory);
      setCategories(getStoredCategories());
      finalCategory = customCategory;
    }

    const mainVariant = variants[0];
    const mainPayload = {
      name,
      price: Number(mainVariant.price),
      stock: Number(mainVariant.stock),
      type: mainVariant.type || 'Default', 
      desc: finalCategory,
      status: true,
      product_url: productUrl
    };

    const result = await addProduct(mainPayload);
    
    const productId = result?.pid || result?.uuid;
    
    if (productId) {
      const additionalVariants = variants.slice(1);
      
      for (const v of additionalVariants) {
        await addProductType(productId, {
          price: Number(v.price),
          stock: Number(v.stock),
          type: v.type || 'Default',
          desc: finalCategory,
          status: true,
          product_url: productUrl
        });
      }
      
      navigate('/products');
    }
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
        <p className="sellerAddProduct__subtitle">Add product information, category, variants, and photo.</p>

        <form id="add-product-form" className="sellerAddProduct__form" onSubmit={handleSubmit}>
          
          <div className="sellerAddProduct__field">
            <label className="sellerAddProduct__label" htmlFor="product-name">
              Product name <span className="sellerAddProduct__required">*</span>
            </label>
            <input 
              id="product-name" 
              className="sellerAddProduct__input" 
              placeholder="Product name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
                <option value="" disabled>Select category</option>
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>{categoryName}</option>
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

          <div className="sellerAddProduct__wideField" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="sellerAddProduct__label" style={{ margin: 0 }}>
                Product Variants (Sizes, Colors, etc.) <span className="sellerAddProduct__required">*</span>
              </label>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="sellerAddProduct__secondaryButton"
                style={{ padding: '6px 12px', height: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.map((v, index) => (
              <div key={v.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 2 }}>
                  {index === 0 && <label className="sellerAddProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Variant Name (e.g. Red, Large)</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    placeholder="e.g. Red / Large" 
                    required 
                    value={v.type}
                    onChange={(e) => handleVariantChange(v.id, 'type', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {index === 0 && <label className="sellerAddProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Price</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    type="number" min="0" step="0.01" placeholder="0.00" required 
                    value={v.price}
                    onChange={(e) => handleVariantChange(v.id, 'price', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {index === 0 && <label className="sellerAddProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Stock</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    type="number" min="0" placeholder="0" required 
                    value={v.stock}
                    onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)}
                  />
                </div>
                {variants.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    style={{ 
                      marginTop: index === 0 ? '24px' : '0',
                      padding: '10px', color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer' 
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <div style={{ width: '40px' }} /> 
                )}
              </div>
            ))}
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
            <label 
              className="sellerAddProduct__uploadBox" 
              htmlFor="product-photo"
              style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.7 : 1 }}
            >
              <ImagePlus className="sellerAddProduct__uploadIcon" />
              <span className="sellerAddProduct__uploadTitle">
                {uploading ? 'Uploading...' : (photoName || 'Upload product photo')}
              </span>
              <span className="sellerAddProduct__uploadText">PNG, JPG, or WebP up to 5MB</span>
            </label>
            <input
              id="product-photo"
              accept="image/png,image/jpeg,image/webp"
              className="sellerAddProduct__hiddenInput"
              required={!productUrl}
              type="file"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </div>
        </form>

        <div className="sellerAddProduct__actions">
          <Link to="/products" className="sellerAddProduct__secondaryButton">
            Cancel
          </Link>
          <button 
            type="submit" 
            form="add-product-form" 
            disabled={submitting || uploading}
            className="sellerAddProduct__primaryButton"
          >
            <Save className="sellerAddProduct__buttonIcon" />
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </section>
    </div>
  );
}