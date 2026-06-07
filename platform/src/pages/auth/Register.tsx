import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/pages/auth/Register.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <div className="authRegister__page">
      <div className="authRegister__panel">
        <div className="authRegister__style">
          <h2 className="authRegister__title">Create your account</h2>
          <p className="authRegister__mutedText">
            Already have an account?{' '}
            <Link to="/login" className="authRegister__primaryButton">
              Sign in
            </Link>
          </p>
        </div>

        {(error || validationError) && (
          <div className="authRegister__style2">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="authRegister__page2">
          <div>
            <label className="authRegister__style3">
              Full Name <span className="authRegister__required">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="authRegister__input"
            />
          </div>

          <div>
            <label className="authRegister__style3">
              Email <span className="authRegister__required">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="authRegister__input"
            />
          </div>

          <div>
            <label className="authRegister__style3">
              Password <span className="authRegister__required">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="authRegister__input"
            />
          </div>

          <div>
            <label className="authRegister__style3">
              Confirm Password <span className="authRegister__required">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="authRegister__input"
            />
          </div>

          <p className="authRegister__style4">
            Seller and driver accounts are created by administrators. If you need a seller or driver
            account, please contact the admin.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="authRegister__primaryButton2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
