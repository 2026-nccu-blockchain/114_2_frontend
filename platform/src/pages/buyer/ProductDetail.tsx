import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct'; 
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import type { ProductItem } from '@/services/productService';
import '@/styles/pages/buyer/ProductDetail.css';

export default function ProductDetail() {
  const { pid } = useParams<{ pid: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem); 
  const { role } = useAuthStore();
  const { getProduct, loading } = useProduct();
  const [quantity, setQuantity] = useState(1);
  
  const [variants, setVariants] = useState<ProductItem[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductItem | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!pid) return;
      const data = await getProduct(pid);
      
      if (data && data.length > 0) {
        const activeVariants = data.filter(v => v.status);
        
        if (activeVariants.length > 0) {
          setVariants(activeVariants);
          setSelectedVariant(activeVariants[0]);
        } else {
          setVariants(data);
          setSelectedVariant(data[0]);
        }
      }
    };
    fetchProduct();
  }, [pid, getProduct]);

  if (loading) {
    return (
      <div className="buyerProductDetail__page buyerProductDetail__loading">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  if (!selectedVariant) {
    return (
      <div className="buyerProductDetail__style">
        <h2 className="buyerProductDetail__title">Product not found</h2>
        <button onClick={() => navigate('/')} className="buyerProductDetail__primaryButton">
          Return to Home
        </button>
      </div>
    );
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < selectedVariant.stock) setQuantity(quantity + 1);
  };

  const handleVariantSelect = (variant: ProductItem) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!role) {
      toast.error('Please sign in to add items to your cart.', {
        className: 'buyerProductDetail__errorToast',
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    addItem({
        uuid: selectedVariant.uuid,
        pid: selectedVariant.pid,
        name: selectedVariant.name,
        price: Number(selectedVariant.price),
        stock: Number(selectedVariant.stock),
        status: selectedVariant.status,
        seller_id: selectedVariant.seller_id,
        desc: selectedVariant.desc || '', 
        type: selectedVariant.type, 
        product_url: selectedVariant.product_url
      }, quantity);

    toast.success(`${selectedVariant.name} (${selectedVariant.type}) added to cart`, {
      className: 'buyerProductDetail__successToast',
      iconTheme: { primary: '#14b8a6', secondary: '#fff' },
    });
  };

  return (
    <div className="buyerProductDetail__page">
      <button onClick={() => navigate(-1)} className="buyerProductDetail__style2">
        <ArrowLeft className="buyerProductDetail__icon" /> Back
      </button>

      <div className="buyerProductDetail__panel">
        <div className="buyerProductDetail__style3 buyerProductDetail__imageFrame">
          {selectedVariant.product_url ? (
            <img src={selectedVariant.product_url} alt={selectedVariant.name} className="buyerProductDetail__productImage" />
          ) : (
            <span className="buyerProductDetail__style4">Product Image</span>
          )}
        </div>

        <div className="buyerProductDetail__style5">
          <div className="buyerProductDetail__style6">
             <span className="buyerProductDetail__style7">{selectedVariant.desc || 'Uncategorized'}</span>
          </div>

          <h1 className="buyerProductDetail__title2">{selectedVariant.name}</h1>
          
          <div className="buyerProductDetail__style8">
            <span className="buyerProductDetail__title3">${Number(selectedVariant.price).toFixed(2)}</span>
            <div className={`${'buyerProductDetail__stockStatus'} ${selectedVariant.stock > 0 ? 'buyerProductDetail__inStock' : 'buyerProductDetail__outOfStock'}`}>
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
            </div>
          </div>
          {variants.length > 1 && (
            <div className="buyerProductDetail__variantSection">
              <h3 className="buyerProductDetail__style10 buyerProductDetail__variantTitle">Select Variant</h3>
              <div className="buyerProductDetail__variantList">
                {variants.map(variant => (
                  <button
                    key={variant.uuid}
                    onClick={() => handleVariantSelect(variant)}
                    disabled={!variant.status}
                    className={`buyerProductDetail__variantButton ${variant.uuid === selectedVariant.uuid ? 'buyerProductDetail__variantButtonActive' : ''}`}
                  >
                    {variant.type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="buyerProductDetail__style9">
            <h3 className="buyerProductDetail__style10">Description</h3>
            <p className="buyerProductDetail__style11">
              No description available for this product.
            </p>
          </div>

          <div className="buyerProductDetail__style12">
            <div className="buyerProductDetail__style13">
               <h3 className="buyerProductDetail__style14">Seller ID</h3>
               <p className="buyerProductDetail__style15">{selectedVariant.seller_id}</p>
            </div>

            <div className="buyerProductDetail__style16">
              <div className="buyerProductDetail__icon2">
                <button onClick={decreaseQuantity} disabled={quantity <= 1} className="buyerProductDetail__style17">
                  <Minus className="buyerProductDetail__icon3" />
                </button>
                <span className="buyerProductDetail__style18">{quantity}</span>
                <button onClick={increaseQuantity} disabled={quantity >= selectedVariant.stock} className="buyerProductDetail__style17">
                  <Plus className="buyerProductDetail__icon3" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart} 
                disabled={selectedVariant.stock === 0 || !selectedVariant.status} 
                className="buyerProductDetail__primaryButton2"
              >
                {!selectedVariant.status ? 'Unavailable' : (selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
