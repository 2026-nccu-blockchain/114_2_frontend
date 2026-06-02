import { ArrowLeft, ImagePlus, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect, type SyntheticEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useUpload } from '@/hooks/useUpload';
import { useProfile } from '@/hooks/useProfile';
import toast from 'react-hot-toast';
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

interface EditableVariant {
  uuid?: string;
  localId: string; 
  type: string;
  price: string;
  stock: string;
  status: boolean;
}

export default function SellerEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, editProductBase, updateProductType, addProductType, deleteProductType, loading: isSubmitting } = useProduct();
  const { upload, uploading } = useUpload();
  const { fetchProfile } = useProfile();
  
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  
  const [categories, setCategories] = useState(getStoredCategories);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [variants, setVariants] = useState<EditableVariant[]>([]);

  useEffect(() => {
    const initData = async () => {
      setIsLoadingProduct(true);
      
      const profile = await fetchProfile();
      if (profile) setEmail(profile.email);

      if (productId) {
        const data = await getProduct(productId);
        if (data && data.length > 0) {
          const mainProduct = data[0];
          setName(mainProduct.name);
          setCategory(mainProduct.desc || ''); 
          setProductUrl(mainProduct.product_url || '');
          setCategories((prev) => prev.includes(mainProduct.desc || '') ? prev : [...prev, mainProduct.desc || '']);
          
          const loadedVariants = data.map(p => ({
            uuid: p.uuid,
            localId: p.uuid,
            type: p.type,
            price: p.price.toString(),
            stock: p.stock.toString(),
            status: p.status
          }));
          setVariants(loadedVariants);
        }
      }
      setIsLoadingProduct(false);
    };
    initData();
  }, [productId]);

  const createdAt = useMemo(
    () => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    []
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const url = await upload(file, email);
    if (url) setProductUrl(url);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { localId: crypto.randomUUID(), type: '', price: '', stock: '', status: true }]);
  };

  const handleRemoveVariant = async (localId: string, uuid?: string) => {
    if (variants.length <= 1) {
      toast.error('商品至少需要保留一個款式！');
      return;
    }

    if (uuid) {
      if (!window.confirm('確定要永久刪除這個款式嗎？')) return;
      const success = await deleteProductType(uuid);
      if (!success) return;
    }
    
    setVariants(variants.filter(v => v.localId !== localId));
  };

  const handleVariantChange = (localId: string, field: keyof EditableVariant, value: string) => {
    setVariants(variants.map(v => (v.localId === localId ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId || variants.length === 0) return;

    let finalCategory = category;
    if (category === NEW_CATEGORY_VALUE) {
      saveCategory(customCategory);
      setCategories(getStoredCategories());
      finalCategory = customCategory;
    }

    const baseSuccess = await editProductBase(productId, name);
    
    if (baseSuccess) {
      let allSuccess = true;
      for (const v of variants) {
        const payload = {
          price: Number(v.price),
          stock: Number(v.stock),
          type: v.type || 'Default',
          desc: finalCategory,
          status: v.status,
          product_url: productUrl
        };

        if (v.uuid) {
          const success = await updateProductType(v.uuid, payload);
          if (!success) allSuccess = false;
        } else {
          const success = await addProductType(productId, payload);
          if (!success) allSuccess = false;
        }
      }

      if (allSuccess) {
        toast.success('商品更新完成！');
        navigate('/products');
      }
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="sellerEditProduct__page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  return (
    <div className="sellerEditProduct__page">
      <Link to="/products" className="sellerEditProduct__backLink">
        <ArrowLeft className="sellerEditProduct__backIcon" />
        Back to products
      </Link>

      <section className="sellerEditProduct__panel">
        <p className="sellerEditProduct__eyebrow">Edit Product</p>
        <h1 className="sellerEditProduct__title">Product #{productId}</h1>

        <form id="edit-product-form" className="sellerEditProduct__form" onSubmit={handleSubmit}>
          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="product-name">
              Product name <span className="sellerEditProduct__required">*</span>
            </label>
            <input 
              id="product-name" 
              className="sellerEditProduct__input" 
              placeholder="Product name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
                  <option key={categoryName} value={categoryName}>{categoryName}</option>
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
          <div className="sellerEditProduct__wideField" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="sellerEditProduct__label" style={{ margin: 0 }}>
                Product Variants <span className="sellerEditProduct__required">*</span>
              </label>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="sellerEditProduct__secondaryButton"
                style={{ padding: '6px 12px', height: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.map((v, index) => (
              <div key={v.localId} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 2 }}>
                  {index === 0 && <label className="sellerEditProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Variant Name</label>}
                  <input 
                    className="sellerEditProduct__input" 
                    placeholder="e.g. Red / Large" 
                    required 
                    value={v.type}
                    onChange={(e) => handleVariantChange(v.localId, 'type', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {index === 0 && <label className="sellerEditProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Price</label>}
                  <input 
                    className="sellerEditProduct__input" 
                    type="number" min="0" step="0.01" placeholder="0.00" required 
                    value={v.price}
                    onChange={(e) => handleVariantChange(v.localId, 'price', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {index === 0 && <label className="sellerEditProduct__label" style={{ fontSize: '12px', color: '#6b7280' }}>Stock</label>}
                  <input 
                    className="sellerEditProduct__input" 
                    type="number" min="0" placeholder="0" required 
                    value={v.stock}
                    onChange={(e) => handleVariantChange(v.localId, 'stock', e.target.value)}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(v.localId, v.uuid)}
                  style={{ 
                    marginTop: index === 0 ? '24px' : '0', 
                    padding: '10px', color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer',
                    opacity: variants.length <= 1 ? 0.5 : 1
                  }}
                  disabled={variants.length <= 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="created-at">
              Last accessed time
            </label>
            <input id="created-at" className="sellerEditProduct__readonlyInput" readOnly value={createdAt} />
          </div>

          <div className="sellerEditProduct__wideField">
            <label className="sellerEditProduct__label" htmlFor="product-photo">
              Product photo
            </label>
            {productUrl && !uploading && !photoName && (
               <div style={{ marginBottom: '10px' }}>
                 <img src={productUrl} alt="Current product" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
               </div>
            )}
            <label 
              className="sellerEditProduct__uploadBox" 
              htmlFor="product-photo"
              style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.7 : 1 }}
            >
              <ImagePlus className="sellerEditProduct__uploadIcon" />
              <span className="sellerEditProduct__uploadTitle">
                {uploading ? 'Uploading...' : (photoName || 'Replace product photo')}
              </span>
              <span className="sellerEditProduct__uploadText">PNG, JPG, WebP up to 5MB</span>
            </label>
            <input
              id="product-photo"
              accept="image/png,image/jpeg,image/webp"
              className="sellerEditProduct__hiddenInput"
              type="file"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </div>
        </form>

        <div className="sellerEditProduct__actions">
          <Link to="/products" className="sellerEditProduct__secondaryButton">
            Cancel
          </Link>
          <button 
            type="submit" 
            form="edit-product-form" 
            disabled={isSubmitting || uploading}
            className="sellerEditProduct__primaryButton"
          >
            <Save className="sellerEditProduct__buttonIcon" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>
    </div>
  );
}