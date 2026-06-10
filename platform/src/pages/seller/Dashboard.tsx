import { AlertTriangle, ClipboardList, DollarSign, Package, PlusCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import '@/styles/pages/seller/Dashboard.css';

const statTones = {
  teal: 'sellerDashboard__teal',
  amber: 'sellerDashboard__amber',
  emerald: 'sellerDashboard__emerald',
  red: 'sellerDashboard__red',
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
    <div className="sellerDashboard__page">
      <div>
        <p className="sellerDashboard__eyebrow">Seller Dashboard</p>
        <h1 className="sellerDashboard__title">Store overview</h1>
      </div>

      <section className="sellerDashboard__statsGrid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="sellerDashboard__statCard">
              <div className="sellerDashboard__statHeader">
                <div>
                  <p className="sellerDashboard__statLabel">{item.label}</p>
                  <p className="sellerDashboard__statValue">{item.value}</p>
                </div>
                <div className={`${'sellerDashboard__statIcon'} ${statTones[item.tone]}`}>
                  <Icon className="sellerDashboard__statSvg" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="sellerDashboard__sectionTitle">Quick actions</h2>
        <div className="sellerDashboard__actionsGrid">
          <Link to="/add-product" className="sellerDashboard__actionCard">
            <div>
              <p className="sellerDashboard__actionTitle">Add Product</p>
              <p className="sellerDashboard__actionDescription">Create a new product listing for your store.</p>
            </div>
            <PlusCircle className="sellerDashboard__actionIcon" />
          </Link>

          <Link to="/orders" className="sellerDashboard__actionCard">
            <div>
              <p className="sellerDashboard__actionTitle">View Orders</p>
              <p className="sellerDashboard__actionDescription">Review pending and completed customer orders.</p>
            </div>
            <ShoppingBag className="sellerDashboard__actionIcon" />
          </Link>
        </div>
      </section>
    </div>
  );
}
