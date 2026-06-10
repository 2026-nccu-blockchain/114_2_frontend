import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProduct } from '@/hooks/useProduct';
import { useProfile } from '@/hooks/useProfile';
import { useUpload } from '@/hooks/useUpload';
import type { ProductItem } from '@/services/productService';
import '@/styles/pages/seller/EditProduct.css';

type ProductVariant = ProductItem & { product_id?: string };

interface EditableVariant {
  uuid?: string;
  localId: string;
  type: string;
  price: string;
  stock: string;
  status: boolean;
}

const createEmptyVariant = (): EditableVariant => ({
  localId: crypto.randomUUID(),
  type: '',
  price: '',
  stock: '',
  status: true,
});

const getVariantUuid = (product: ProductVariant) => product.uuid || product.product_id;

export default function SellerEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    addProductType,
    deleteProductType,
    editProductBase,
    getProduct,
    loading: isSubmitting,
    updateProductType,
  } = useProduct();
  const { fetchProfile } = useProfile();
  const { upload, uploading } = useUpload();

  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [variants, setVariants] = useState<EditableVariant[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      setIsLoadingProduct(true);
      const profile = await fetchProfile();
      if (profile) setEmail(profile.email);

      const data = await getProduct(productId);
      if (!data || data.length === 0) {
        setIsLoadingProduct(false);
        return;
      }

      const mainProduct = data[0];
      setName(mainProduct.name);
      setDescription(mainProduct.desc || '');
      setProductUrl(mainProduct.product_url || '');
      setVariants(data.map((product) => {
        const uuid = getVariantUuid(product);
        return {
          uuid,
          localId: uuid || crypto.randomUUID(),
          type: product.type,
          price: String(product.price),
          stock: String(product.stock),
          status: product.status,
        };
      }));
      setIsLoadingProduct(false);
    };

    void loadProduct();
  }, [fetchProfile, getProduct, productId]);

  const accessedAt = useMemo(
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

    setVariants((current) => current.filter((variant) => variant.localId !== localId));
  };

  const handleVariantChange = (localId: string, field: keyof EditableVariant, value: string) => {
    setVariants((current) => current.map((variant) => (
      variant.localId === localId ? { ...variant, [field]: value } : variant
    )));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId || variants.length === 0) return;

    const baseSuccess = await editProductBase(productId, name.trim());
    if (!baseSuccess) {
      toast.error('商品基本資料更新失敗，請稍後再試');
      return;
    }

    const descriptionText = description.trim();
    let allSuccess = true;

    for (const variant of variants) {
      const payload = {
        price: Number(variant.price),
        stock: Number(variant.stock),
        status: variant.status,
        desc: descriptionText,
        type: variant.type.trim() || 'Default',
        product_url: productUrl || undefined,
      };

      const result = variant.uuid
        ? await updateProductType(variant.uuid, payload)
        : await addProductType(productId, payload);

      if (!result) allSuccess = false;
    }

    if (!allSuccess) {
      toast.error('部分款式更新失敗，請檢查網路或稍後再試');
      return;
    }

    toast.success('商品更新完成！');
    navigate('/products');
  };

  if (isLoadingProduct) {
    return (
      <div className="sellerEditProduct__page sellerEditProduct__loading">
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
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="sellerEditProduct__wideField">
            <label className="sellerEditProduct__label" htmlFor="product-description">
              Description <span className="sellerEditProduct__required">*</span>
            </label>
            <textarea
              id="product-description"
              className="sellerEditProduct__input"
              placeholder="Describe this product"
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="sellerEditProduct__wideField sellerEditProduct__variantSection">
            <div className="sellerEditProduct__variantHeader">
              <label className="sellerEditProduct__label sellerEditProduct__variantHeaderLabel">
                Product Variants <span className="sellerEditProduct__required">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="sellerEditProduct__secondaryButton sellerEditProduct__variantAddButton"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div key={variant.localId} className="sellerEditProduct__variantRow">
                <div className="sellerEditProduct__variantNameField">
                  {index === 0 && (
                    <label className="sellerEditProduct__label sellerEditProduct__variantSubLabel">
                      Variant Name
                    </label>
                  )}
                  <input
                    className="sellerEditProduct__input"
                    placeholder="e.g. Red / Large"
                    required
                    value={variant.type}
                    onChange={(event) => handleVariantChange(variant.localId, 'type', event.target.value)}
                  />
                </div>

                <div className="sellerEditProduct__variantNumberField">
                  {index === 0 && (
                    <label className="sellerEditProduct__label sellerEditProduct__variantSubLabel">
                      Price
                    </label>
                  )}
                  <input
                    className="sellerEditProduct__input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={variant.price}
                    onChange={(event) => handleVariantChange(variant.localId, 'price', event.target.value)}
                  />
                </div>

                <div className="sellerEditProduct__variantNumberField">
                  {index === 0 && (
                    <label className="sellerEditProduct__label sellerEditProduct__variantSubLabel">
                      Stock
                    </label>
                  )}
                  <input
                    className="sellerEditProduct__input"
                    type="number"
                    min="0"
                    placeholder="0"
                    required
                    value={variant.stock}
                    onChange={(event) => handleVariantChange(variant.localId, 'stock', event.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handleRemoveVariant(variant.localId, variant.uuid)}
                  className={`sellerEditProduct__removeVariantButton ${index === 0 ? 'sellerEditProduct__removeVariantButtonTopAligned' : ''}`}
                  disabled={variants.length <= 1}
                  aria-label="Remove variant"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="sellerEditProduct__field">
            <label className="sellerEditProduct__label" htmlFor="accessed-at">
              Last accessed time
            </label>
            <input id="accessed-at" className="sellerEditProduct__readonlyInput" readOnly value={accessedAt} />
          </div>

          <div className="sellerEditProduct__wideField">
            <label className="sellerEditProduct__label" htmlFor="product-photo">
              Product photo
            </label>
            {productUrl && !uploading && !photoName && (
              <div className="sellerEditProduct__currentImageWrap">
                <img src={productUrl} alt="Current product" className="sellerEditProduct__currentImage" />
              </div>
            )}
            <label
              className={`sellerEditProduct__uploadBox ${uploading ? 'sellerEditProduct__uploadBoxBusy' : ''}`}
              htmlFor="product-photo"
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
