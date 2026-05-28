import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import styles from '@/styles/pages/buyer/OrderDetail.module.css';

export default function BuyerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className={styles['style']}>
        <p className={styles['style2']}>Order not found.</p>
        <button onClick={() => navigate('/orders')} className={styles['primaryButton']}>
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      {/* 返回按鈕 */}
      <button
        onClick={() => navigate('/orders')}
        className={styles['mutedText']}
      >
        <ArrowLeft className={styles['icon']} />
        Back to orders
      </button>

      {/* 頂部標題與狀態 */}
      <div className={styles['style3']}>
        <div>
          <h1 className={styles['title']}>Order #{order.id}</h1>
          <p className={styles['style4']}>{order.createdAt}</p>
        </div>
        <span className={styles['style5']}>
          {order.status}
        </span>
      </div>

      {/* 品項明細 */}
      <div className={styles['panel']}>
        <div className={styles['style6']}>
          <h2 className={styles['style7']}>Items</h2>
          <ul className={styles['style8']}>
            {order.items.map((item) => (
              <li key={item.id} className={styles['style9']}>
                <span className={styles['style10']}>{item.name} <span className={styles['style11']}>x {item.quantity}</span></span>
                <span className={styles['style12']}>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles['style13']}>
            <span>Total</span>
            <span className={styles['style14']}>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送資訊 */}
      <div className={styles['panel2']}>
        <h2 className={styles['style7']}>Delivery Information</h2>
        <div className={styles['style15']}>
          <div>
            <p className={styles['style11']}>Recipient</p>
            <p className={styles['style16']}>{order.recipientName}</p>
          </div>
          <div>
            <p className={styles['style11']}>Phone</p>
            <p className={styles['style16']}>{order.phone}</p>
          </div>
        </div>
        <div className={styles['page2']}>
          <div>
            <p className={styles['style11']}>Address</p>
            <p className={styles['style16']}>{order.address}</p>
          </div>
          {order.notes && (
            <div>
              <p className={styles['style11']}>Notes</p>
              <p className={styles['style17']}>{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* 司機配送進度 */}
      <div className={styles['panel3']}>
        <h2 className={styles['style7']}>Delivery Tracking</h2>
        <div className={styles['style18']}>
          <span className={styles['mutedText2']}>Status:</span>
          <span className={styles['style19']}>
            {order.trackingStatus}
          </span>
        </div>
        
        {/* 時間軸外觀 */}
        <div className={styles['style20']}>
          <div className={styles['style21']} />
          <p className={styles['style22']}>Assigned</p>
          <p className={styles['style23']}>{order.createdAt}</p>
        </div>
      </div>
      
      <p className={styles['style24']}>Payment Method: Cash on Delivery (COD)</p>
    </div>
  );
}