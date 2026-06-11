import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useUpload } from '@/hooks/useUpload';
import { useProfile } from '@/hooks/useProfile';
import '@/styles/pages/seller/AddProduct.css';
import toast from 'react-hot-toast';

interface Variant {
  pid: string;
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
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [photoName, setPhotoName] = useState('');

  const [variants, setVariants] = useState<Variant[]>([
    { pid: crypto.randomUUID(), type: '', price: '', stock: '' }
  ]);

  useEffect(() => {
    const getEmail = async () => {
      const profile = await fetchProfile();
      if (!profile) return;
      setEmail(profile.email);
    };
    getEmail();
  }, [fetchProfile]);

  const createdAt = useMemo(
    () => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    [],
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhotoName(file.name);
    const url = await upload(file, email);
    if (!url)  return;
    setProductUrl(url);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { pid: crypto.randomUUID(), type: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (pid: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.pid !== pid));
    }
  };

  const handleVariantChange = (pid: string, field: keyof Variant, value: string) => {
    setVariants(variants.map(v => (v.pid === pid ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (variants.length === 0) return;

    const mainVariant = variants[0];
    const descriptionText = description.trim();
    const mainPayload = {
      name: name.trim(),
      price: Number(mainVariant.price),
      stock: Number(mainVariant.stock),
      type: mainVariant.type.trim() || 'Default',
      desc: descriptionText,
      status: true,
      product_url: productUrl || undefined,
    };

    const result = await addProduct(mainPayload);
    const productId = result?.pid;

    if (!productId) {
      toast.error('新增商品失敗，請檢查網路或稍後再試');
      return; 
    }
    const additionalVariants = variants.slice(1);
      
      for (const v of additionalVariants) {
        await addProductType(productId, {
          price: Number(v.price),
          stock: Number(v.stock),
          type: v.type.trim() || 'Default',
          desc: descriptionText,
          status: true,
          product_url: productUrl || undefined,
        });
      }
      toast.success('商品新增成功！');
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
        <p className="sellerAddProduct__subtitle">Add product information, variants, and photo.</p>

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

          <div className="sellerAddProduct__wideField">
            <label className="sellerAddProduct__label" htmlFor="product-description">
              Description <span className="sellerAddProduct__required">*</span>
            </label>
            <textarea
              id="product-description"
              className="sellerAddProduct__input"
              placeholder="Describe this product"
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="sellerAddProduct__wideField sellerAddProduct__variantSection">
            <div className="sellerAddProduct__variantHeader">
              <label className="sellerAddProduct__label sellerAddProduct__variantHeaderLabel">
                Product Variants (Sizes, Colors, etc.) <span className="sellerAddProduct__required">*</span>
              </label>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="sellerAddProduct__secondaryButton sellerAddProduct__variantAddButton"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.map((v, index) => (
              <div key={v.pid} className="sellerAddProduct__variantRow">
                <div className="sellerAddProduct__variantNameField">
                  {index === 0 && <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">Variant Name (e.g. Red, Large)</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    placeholder="e.g. Red / Large" 
                    required 
                    value={v.type}
                    onChange={(e) => handleVariantChange(v.pid, 'type', e.target.value)}
                  />
                </div>
                <div className="sellerAddProduct__variantNumberField">
                  {index === 0 && <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">Price</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    type="number" min="0" step="0.01" placeholder="0.00" required 
                    value={v.price}
                    onChange={(e) => handleVariantChange(v.pid, 'price', e.target.value)}
                  />
                </div>
                <div className="sellerAddProduct__variantNumberField">
                  {index === 0 && <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">Stock</label>}
                  <input 
                    className="sellerAddProduct__input" 
                    type="number" min="0" placeholder="0" required 
                    value={v.stock}
                    onChange={(e) => handleVariantChange(v.pid, 'stock', e.target.value)}
                  />
                </div>
                {variants.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.pid)}
                    className={`sellerAddProduct__removeVariantButton ${index === 0 ? 'sellerAddProduct__removeVariantButtonTopAligned' : ''}`}
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <div className="sellerAddProduct__variantRemoveSpacer" /> 
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
              Product photo
            </label>
            <label 
              className={`sellerAddProduct__uploadBox ${uploading ? 'sellerAddProduct__uploadBoxBusy' : ''}`}
              htmlFor="product-photo"
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
