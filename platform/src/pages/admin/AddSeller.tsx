import { Store } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { getPasswordValidationError, useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/pages/admin/AddSeller.styles';

export default function AdminAddSeller() {
  const { sellerRegister, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    await sellerRegister({
      name,
      email,
      password,
      phone,
      company_name: companyName,
      company_phone: companyPhone,
      company_address: companyAddress,
    });
  };

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Admin</p>
        <h1 className={styles.title}>Add seller</h1>
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
              <label className={styles.label} htmlFor="seller-name">Seller name</label>
              <input id="seller-name" className={styles.input} placeholder="Store owner name" required value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="seller-email">Email</label>
              <input id="seller-email" className={styles.input} placeholder="seller@demo.local" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="seller-password">Password</label>
              <input id="seller-password" className={styles.input} placeholder="At least 8 chars, uppercase, lowercase, number" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="seller-phone">Phone</label>
              <input id="seller-phone" className={styles.input} placeholder="0912345678" required value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="store-name">Store name</label>
              <input id="store-name" className={styles.input} placeholder="Store name" required value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="store-phone">Store phone</label>
              <input id="store-phone" className={styles.input} placeholder="0987654321" required value={companyPhone} onChange={(event) => setCompanyPhone(event.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="store-address">Store address</label>
              <input id="store-address" className={styles.input} placeholder="Store address" required value={companyAddress} onChange={(event) => setCompanyAddress(event.target.value)} />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button} disabled={loading}>
              <Store className={styles.icon} />
              {loading ? 'Creating...' : 'Create Seller'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
