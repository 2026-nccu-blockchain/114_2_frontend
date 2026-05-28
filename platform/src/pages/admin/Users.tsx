import { Car, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminUsers } from '@/pages/admin/adminData';
import { styles } from '@/styles/pages/admin/Users.styles';


const roleStyles = {
  admin: styles.admin,
  buyer: styles.buyer,
  seller: styles.seller,
  driver: styles.driver,
};

export default function AdminUsers() {
  const [users, setUsers] = useState(adminUsers);

  const deleteUser = (userId: string) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
  };

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

      <div className={styles.tableWrap}>
        {users.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>User</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.style}>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className={styles.td}>
                    <p className={styles.name}>{user.name}</p>
                    <p>{user.id}</p>
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
                  <td className={styles.actionTd}>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      aria-label={`Delete ${user.name}`}
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className={styles.buttonIcon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>No users found.</div>
        )}
      </div>
    </div>
  );
}
