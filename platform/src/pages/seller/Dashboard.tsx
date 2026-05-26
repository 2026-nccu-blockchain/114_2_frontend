import { AlertTriangle, ClipboardList, DollarSign, Package, PlusCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statTones, styles } from './Dashboard.styles';

type StatTone = keyof typeof statTones;

interface StatItem {
  label: string;
  value: string;
  icon: typeof Package;
  tone: StatTone;
}

const stats: StatItem[] = [
  {
    label: 'Active Products',
    value: '128',
    icon: Package,
    tone: 'teal',
  },
  {
    label: 'Pending Orders',
    value: '24',
    icon: ClipboardList,
    tone: 'amber',
  },
  {
    label: 'Total Revenue',
    value: '$48,260',
    icon: DollarSign,
    tone: 'emerald',
  },
  {
    label: 'Low Stock',
    value: '7',
    icon: AlertTriangle,
    tone: 'red',
  },
];

export default function SellerDashboard() {
  return (
    <div className={styles.page}>
      <div>
        <p className={styles.eyebrow}>Seller Dashboard</p>
        <h1 className={styles.title}>Store overview</h1>
      </div>

      <section className={styles.statsGrid}>
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <p className={styles.statLabel}>{item.label}</p>
                  <p className={styles.statValue}>{item.value}</p>
                </div>
                <div className={`${styles.statIcon} ${statTones[item.tone]}`}>
                  <Icon className={styles.statSvg} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/add-product" className={styles.actionCard}>
            <div>
              <p className={styles.actionTitle}>Add Product</p>
              <p className={styles.actionDescription}>Create a new product listing for your store.</p>
            </div>
            <PlusCircle className={styles.actionIcon} />
          </Link>

          <Link to="/orders" className={styles.actionCard}>
            <div>
              <p className={styles.actionTitle}>View Orders</p>
              <p className={styles.actionDescription}>Review pending and completed customer orders.</p>
            </div>
            <ShoppingBag className={styles.actionIcon} />
          </Link>
        </div>
      </section>
    </div>
  );
}
