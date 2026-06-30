import { Car, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import type { AdminUserRecord } from '@/services/adminService';
import { styles } from '@/styles/pages/admin/Users.styles';


const roleStyles = {
  admin: styles.admin,
  buyer: styles.buyer,
  seller: styles.seller,
  driver: styles.driver,
};

type UserGroup = {
  title: string;
  role: 'buyer' | 'seller' | 'driver';
};

const userGroups: UserGroup[] = [
  { title: 'Buyers', role: 'buyer' },
  { title: 'Sellers', role: 'seller' },
  { title: 'Drivers', role: 'driver' },
];

interface AdminUsersContentProps {
  users: AdminUserRecord[];
  loading: boolean;
  error: string | null;
}

function AdminUsersContent({ users, loading, error }: AdminUsersContentProps) {
  const groupedUsers = userGroups.map((group) => ({
    ...group,
    users: users.filter((user) => user.role === group.role),
  }));

  const renderUsersTable = (groupUsers: typeof users) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>User</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Role</th>
          <th className={styles.th}>Status</th>
        </tr>
      </thead>
      <tbody className={styles.style}>
        {groupUsers.map((user) => (
          <tr key={user.id}>
            <td className={styles.td}>
              <p className={styles.name}>{user.name}</p>
              <p>{user.role}</p>
            </td>
            <td className={styles.td}>{user.email}</td>
            <td className={styles.td}>
              <span className={`${styles.badge} ${roleStyles[user.role]}`}>{user.role}</span>
            </td>
            <td className={styles.td}>
              <span className={`${styles.badge} ${user.status === 'Active' ? styles.active : styles.pending}`}>
                {user.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Admin Users</p>
          <h1 className={styles.title}>Manage users</h1>
        </div>

        <div className={styles.headerActions}>
          <Link to="/add-seller" className={styles.secondaryAddButton}>
            <Store className={styles.buttonIcon} />
            Add Seller
          </Link>
          <Link to="/add-driver" className={styles.addButton}>
            <Car className={styles.buttonIcon} />
            Add Driver
          </Link>
        </div>
      </header>

      {loading && users.length === 0 ? (
        <div className={styles.tableWrap}>
          <div className={styles.empty}>Loading users...</div>
        </div>
      ) : error && users.length === 0 ? (
        <div className={styles.tableWrap}>
          <div className={styles.empty}>{error}</div>
        </div>
      ) : users.length > 0 ? (
        <div className={styles.sectionStack}>
          {groupedUsers.map((group) => (
            <section key={group.role} className={styles.section}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{group.title}</h2>
                <span className={styles.sectionCount}>{group.users.length} users</span>
              </header>
              {group.users.length > 0 ? (
                renderUsersTable(group.users)
              ) : (
                <div className={styles.empty}>No {group.title.toLowerCase()} found.</div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.empty}>No users found.</div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const { users, loading, error } = useAdminUsers();

  return <AdminUsersContent users={users} loading={loading} error={error} />;
}
