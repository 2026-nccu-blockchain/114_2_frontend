import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { styles } from './Register.styles';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    await register(fullName, email, password);
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.style}>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.mutedText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.primaryButton}>
              Sign in
            </Link>
          </p>
        </div>

        {(error || validationError) && (
          <div className={styles.style2}>
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.page2}>
          <div>
            <label className={styles.style3}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.style3}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.style3}>
              Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.style3}>
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <p className={styles.style4}>
            Seller and driver accounts are created by administrators. If you need a seller or driver
            account, please contact the admin.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton2}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
