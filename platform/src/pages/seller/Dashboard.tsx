import { AlertTriangle, ClipboardList, DollarSign, Package, PlusCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const styles = {
  page: 'space-y-8',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  statsGrid: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
  statCard: 'rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
  statHeader: 'flex items-start justify-between gap-4',
  statLabel: 'text-sm font-medium text-gray-500',
  statValue: 'mt-3 text-3xl font-bold text-gray-900',
  statIcon: 'rounded-lg border p-2.5',
  statSvg: 'h-5 w-5',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  actionsGrid: 'mt-4 grid gap-4 md:grid-cols-2',
  actionCard:
    'flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50',
  actionTitle: 'font-semibold text-gray-900',
  actionDescription: 'mt-1 text-sm text-gray-500',
  actionIcon: 'h-6 w-6 flex-none text-teal-600',
};

const statTones = {
  teal: 'border-teal-100 bg-teal-50 text-teal-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  red: 'border-red-100 bg-red-50 text-red-700',
};

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
