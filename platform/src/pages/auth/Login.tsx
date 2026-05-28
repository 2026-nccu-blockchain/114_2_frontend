import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, type LoginRole } from '@/hooks/useAuth';
import styles from '@/styles/pages/auth/Login.module.css';

const roleOptions: Array<{ value: LoginRole; label: string }> = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'driver', label: 'Driver' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<LoginRole>('buyer');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password, role);
  };

  return (
    <div className={styles['page']}>
      <div className={styles['panel']}>
        <div className={styles['style']}>
          <h2 className={styles['title']}>Sign in to your account</h2>
          <p className={styles['mutedText']}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className={styles['primaryButton']}>
              Sign up
            </Link>
          </p>
        </div>

        {error && <div className={styles['style2']}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles['page2']}>
          

          <div>
            <label className={styles['style3']}>
              Email <span className={styles['required']}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles['input']}
            />
          </div>

          <div>
            <label className={styles['style3']}>
              Password <span className={styles['required']}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['input']}
            />
          </div>

          <div>
            {/* <label className={styles['style3']}>
              Account type <span className={styles['required']}>*</span>
            </label> */}
            <div className={styles['style4']}>
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`${styles['roleButton']} ${
                    role === option.value ? styles['roleButtonActive'] : styles['roleButtonInactive']
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles['primaryButton2']}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
