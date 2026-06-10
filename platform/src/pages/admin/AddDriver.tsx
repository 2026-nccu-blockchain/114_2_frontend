import { Car } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { getPasswordValidationError, useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/pages/admin/AddDriver.styles';

export default function AdminAddDriver() {
  const { driverRegister, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    await driverRegister({ name, email, password, phone });
  };

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Admin</p>
        <h1 className={styles.title}>Add driver</h1>
      </header>

      <section className={styles.panel}>
        {(error || validationError) && (
          <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-sm text-red-600">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-name">Driver name</label>
              <input id="driver-name" className={styles.input} placeholder="Driver full name" required value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-email">Email</label>
              <input id="driver-email" className={styles.input} placeholder="driver@demo.local" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-password">Password</label>
              <input id="driver-password" className={styles.input} placeholder="At least 8 chars, uppercase, lowercase, number" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="driver-phone">Phone</label>
              <input id="driver-phone" className={styles.input} placeholder="0912345678" required value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button} disabled={loading}>
              <Car className={styles.icon} />
              {loading ? 'Creating...' : 'Create Driver'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
