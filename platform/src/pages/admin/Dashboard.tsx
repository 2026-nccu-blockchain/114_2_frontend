import { Car, ShieldCheck, Store, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminUserStats } from '@/pages/admin/adminData';
import { styles } from '@/styles/pages/admin/Dashboard.styles';


const actionCards = [
  {
    title: 'Manage Users',
    text: 'View buyers, sellers, drivers, and account status.',
    to: '/users',
    icon: Users,
  },
  {
    title: 'Add Seller',
    text: 'Create a seller account for a new store.',
    to: '/add-seller',
    icon: Store,
  },
  {
    title: 'Add Driver',
    text: 'Create a driver account for delivery tasks.',
    to: '/add-driver',
    icon: Car,
  },
];

export default function AdminDashboard() {
  const stats = getAdminUserStats();
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, tone: styles.tealTone },
    { label: 'Admins', value: stats.admins, icon: ShieldCheck, tone: styles.purpleTone },
    { label: 'Buyers', value: stats.buyers, icon: UserPlus, tone: styles.blueTone },
    { label: 'Sellers', value: stats.sellers, icon: Store, tone: styles.emeraldTone },
    { label: 'Drivers', value: stats.drivers, icon: Car, tone: styles.amberTone },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Admin Dashboard</p>
        <h1 className={styles.title}>User overview</h1>
      </header>

      <section className={styles.statsGrid}>
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <p className={styles.statLabel}>{item.label}</p>
                <span className={`${styles.statIcon} ${item.tone}`}>
                  <Icon className={styles.statSvg} />
                </span>
              </div>
              <p className={styles.statValue}>{item.value}</p>
            </article>
          );
        })}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Admin actions</h2>
        <div className={styles.actionsGrid}>
          {actionCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.to} to={item.to} className={styles.actionCard}>
                <div>
                  <p className={styles.actionTitle}>{item.title}</p>
                  <p className={styles.actionText}>{item.text}</p>
                </div>
                <Icon className={styles.actionIcon} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
