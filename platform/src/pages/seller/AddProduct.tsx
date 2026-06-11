import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProduct } from '@/hooks/useProduct';
import { useProfile } from '@/hooks/useProfile';
import { useUpload } from '@/hooks/useUpload';
import '@/styles/pages/seller/AddProduct.css';

interface Variant {
  id: string;
  type: string;
  price: string;
  stock: string;
}

const createEmptyVariant = (): Variant => ({
  id: crypto.randomUUID(),
  type: '',
  price: '',
  stock: '',
});

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const { addProduct, addProductType, loading: submitting } = useProduct();
  const { fetchProfile } = useProfile();
  const { upload, uploading } = useUpload();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [variants, setVariants] = useState<Variant[]>([createEmptyVariant()]);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProfile();
      if (!profile) return;
      setEmail(profile.email);
    };

    void loadProfile();
  }, [fetchProfile]);

  const createdAt = useMemo(
    () => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    [],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    const url = await upload(file, email);
    if (!url) return;
    setProductUrl(url);
  };

  const handleAddVariant = () => {
    setVariants((current) => [...current, createEmptyVariant()]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((current) => current.length > 1 ? current.filter((variant) => variant.id !== id) : current);
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: string) => {
    setVariants((current) => current.map((variant) => (
      variant.id === id ? { ...variant, [field]: value } : variant
    )));
  };

  const buildVariantPayload = (variant: Variant, desc: string) => ({
    price: Number(variant.price),
    stock: Number(variant.stock),
    status: true,
    desc,
    type: variant.type.trim() || 'Default',
    product_url: productUrl || undefined,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const descriptionText = description.trim();
    const mainVariant = variants[0];
    const mainProduct = await addProduct({
      name: name.trim(),
      ...buildVariantPayload(mainVariant, descriptionText),
    });

    const productPid = mainProduct?.pid;
    if (!productPid) {
      toast.error('新增商品失敗，請檢查網路或稍後再試');
      return;
    }

    const variantResults = await Promise.all(
      variants.slice(1).map((variant) => addProductType(productPid, buildVariantPayload(variant, descriptionText))),
    );

    if (variantResults.some((result) => !result)) {
      toast.error('商品已新增，但部分款式新增失敗');
      return;
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
              onChange={(event) => setName(event.target.value)}
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
                Product Variants <span className="sellerAddProduct__required">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="sellerAddProduct__secondaryButton sellerAddProduct__variantAddButton"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div key={variant.id} className="sellerAddProduct__variantRow">
                <div className="sellerAddProduct__variantNameField">
                  {index === 0 && (
                    <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">
                      Variant Name
                    </label>
                  )}
                  <input
                    className="sellerAddProduct__input"
                    placeholder="e.g. Red / Large"
                    required
                    value={variant.type}
                    onChange={(event) => handleVariantChange(variant.id, 'type', event.target.value)}
                  />
                </div>

                <div className="sellerAddProduct__variantNumberField">
                  {index === 0 && (
                    <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">
                      Price
                    </label>
                  )}
                  <input
                    className="sellerAddProduct__input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={variant.price}
                    onChange={(event) => handleVariantChange(variant.id, 'price', event.target.value)}
                  />
                </div>

                <div className="sellerAddProduct__variantNumberField">
                  {index === 0 && (
                    <label className="sellerAddProduct__label sellerAddProduct__variantSubLabel">
                      Stock
                    </label>
                  )}
                  <input
                    className="sellerAddProduct__input"
                    type="number"
                    min="0"
                    placeholder="0"
                    required
                    value={variant.stock}
                    onChange={(event) => handleVariantChange(variant.id, 'stock', event.target.value)}
                  />
                </div>

                {variants.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variant.id)}
                    className={`sellerAddProduct__removeVariantButton ${index === 0 ? 'sellerAddProduct__removeVariantButtonTopAligned' : ''}`}
                    aria-label="Remove variant"
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
