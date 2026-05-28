import { Car } from 'lucide-react';
import { styles } from '@/styles/pages/admin/AddDriver.styles';


export default function AdminAddDriver() {
  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Admin</p>
        <h1 className={styles.title}>Add driver</h1>
      </header>

      <section className={styles.panel}>
        <form>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-name">Driver name</label>
              <input id="driver-name" className={styles.input} placeholder="Driver full name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-email">Email</label>
              <input id="driver-email" className={styles.input} placeholder="driver@demo.local" type="email" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-phone">Phone</label>
              <input id="driver-phone" className={styles.input} placeholder="0912-000-000" />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.button}>
              <Car className={styles.icon} />
              Create Driver
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
