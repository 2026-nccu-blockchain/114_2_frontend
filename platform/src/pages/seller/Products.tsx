import { Edit3, Package, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import type { ProductItem } from '@/services/productService';
import toast from 'react-hot-toast';
import '@/styles/pages/seller/Products.css';

function ProductCard({
  product,
  onToggle,
  onDelete,
  isToggling,
  isDeleting
}: {
  product: ProductItem;
  onToggle: (product: ProductItem) => void;
  onDelete: (pid: string) => void;
  isToggling: boolean;
  isDeleting: boolean;
}) {
  const editPath = `/products/${product.pid}/edit`;

  return (
    <article className={`${'sellerProducts__card'} ${product.status ? '' : 'sellerProducts__cardInactive'}`}>
      <Link to={editPath} className="sellerProducts__cardLink">
        <div className={`sellerProducts__image ${product.product_url ? 'sellerProducts__imageWithPhoto' : ''}`}>
          {product.product_url ? (
            <img src={product.product_url} alt={product.name} className="sellerProducts__productImage" />
          ) : (
             <Package className="sellerProducts__imageIcon" />
          )}
        </div>
      </Link>

      <div className="sellerProducts__body">
        <div className="sellerProducts__top">
          <Link to={editPath} className="sellerProducts__cardLink">
            <h3 className="sellerProducts__name">{product.name}</h3>
            <p className="sellerProducts__category">{product.type}</p>
          </Link>
          <p className="sellerProducts__price">${Number(product.price).toFixed(2)}</p>
        </div>

        <div className="sellerProducts__meta">
          <div>
            <p className="sellerProducts__metaLabel">Stock</p>
            <p className="sellerProducts__metaValue">{product.stock}</p>
          </div>
          <div>
            <p className="sellerProducts__metaLabel">Product ID</p>
            <p className="sellerProducts__metaValue sellerProducts__pidValue">{product.pid}</p>
          </div>
        </div>

        <div className="sellerProducts__actions">
          <Link to={editPath} className="sellerProducts__editButton">
            <Edit3 className="sellerProducts__editIcon" /> Edit
          </Link>

          <button
            onClick={() => onDelete(product.pid)}
            disabled={isDeleting || isToggling}
            className="sellerProducts__editButton sellerProducts__deleteButton"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            Delete
          </button>

          <div className="sellerProducts__actionSpacer" />

          <span className={`${'sellerProducts__status'} ${product.status ? 'sellerProducts__statusActive' : 'sellerProducts__statusInactive'}`}>
            {product.status ? 'Online' : 'Deactivated'}
          </span>

          <button
            type="button"
            onClick={() => onToggle(product)}
            disabled={isToggling || isDeleting}
            className={`${'sellerProducts__toggle'} ${product.status ? 'sellerProducts__toggleActive' : 'sellerProducts__toggleInactive'}`}
          >
            <span className={`${'sellerProducts__thumb'} ${product.status ? 'sellerProducts__thumbActive' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SellerProducts() {
  const { getMyProducts, updateProductType, deleteProduct, loading } = useProduct(); 
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  useEffect(() => {
    const load = async() => {
      try{
        const data = await getMyProducts();
        if(data){
          setProducts(data);
        }
      }catch (e){
        console.error(e);
      }
    };
    load();
  }, [getMyProducts]);

  const activeProducts = useMemo(() => products.filter((p) => p.status), [products]);
  const deactivatedProducts = useMemo(() => products.filter((p) => !p.status), [products]);

  const toggleProduct = async (product: ProductItem) => {
    const targetUuid = product.product_id || product.uuid;
    if (!targetUuid) return;
    setTogglingId(targetUuid);
    const success = await updateProductType(targetUuid, {
      price: product.price,
      stock: product.stock,
      type: product.type,
      desc: product.desc || '',
      status: !product.status,
      product_url: product.product_url
    });

    if (!success){
      toast.error('狀態更新失敗，請稍後再試');
      setTogglingId(null);
      return;
    }

    toast.success(`商品已${!product.status ? '上架' : '下架'}`);
    setProducts(current => current.map(p => 
       (p.product_id || p.uuid) === targetUuid ? { ...p, status: !p.status } : p
    ));
    
    setTogglingId(null);
  };

  const handleDeleteProduct = async (pid: string) => {
    setDeletingId(pid);
    const success = await deleteProduct(pid); 
    if (!success){
      toast.error('刪除失敗，請稍後再試');
      setDeletingId(null);
      return; 
    } 
    setProducts(current => current.filter(p => p.pid !== pid));
    toast.success('商品刪除成功！');
    setDeletingId(null);
  };

  if (loading && products.length === 0) {
    return (
      <div className="sellerProducts__page sellerProducts__loadingPage">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

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
            {activeProducts.map((product) => {
              const currentUuid = product.product_id || product.uuid;
              return(
              <ProductCard 
                key={currentUuid} 
                product={product} 
                onToggle={toggleProduct} 
                onDelete={handleDeleteProduct} 
                isToggling={togglingId === currentUuid}
                isDeleting={deletingId === product.pid}
              />
            )})}
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
            {deactivatedProducts.map((product) => {
              const currentUuid = product.product_id || product.uuid;
              return(
              <ProductCard 
                key={currentUuid} 
                product={product} 
                onToggle={toggleProduct}
                onDelete={handleDeleteProduct} 
                isToggling={togglingId === currentUuid}
                isDeleting={deletingId === product.pid}
              />
            )})}
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
