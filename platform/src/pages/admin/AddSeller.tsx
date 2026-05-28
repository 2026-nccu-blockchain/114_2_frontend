import { Store } from 'lucide-react';
import { styles } from '@/styles/pages/admin/AddSeller.styles';


export default function AdminAddSeller() {
  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Admin</p>
        <h1 className={styles.title}>Add seller</h1>
      </header>

      <section className={styles.panel}>
        <form>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="seller-name">Seller name</label>
              <input id="seller-name" className={styles.input} placeholder="Store owner name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="seller-email">Email</label>
              <input id="seller-email" className={styles.input} placeholder="seller@demo.local" type="email" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="store-name">Store name</label>
              <input id="store-name" className={styles.input} placeholder="Store name" />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.button}>
              <Store className={styles.icon} />
              Create Seller
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
