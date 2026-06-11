import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getPasswordValidationError, useAuth } from '@/hooks/useAuth';
import '@/styles/pages/auth/Register.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { forgotPassword, loading, error } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError('');

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    await forgotPassword({ email, phone, password });
  };

  return (
    <div className="authRegister__page">
      <div className="authRegister__panel">
        <div className="authRegister__style">
          <h2 className="authRegister__title">Reset password</h2>
          <p className="authRegister__mutedText">
            Remember your password?{' '}
            <Link to="/login" className="authRegister__primaryButton">
              Sign in
            </Link>
          </p>
        </div>

        {(error || localError) && <div className="authRegister__style2">{error || localError}</div>}

        <form onSubmit={handleSubmit} className="authRegister__page2">
          <div>
            <label className="authRegister__style3">
              Email <span className="authRegister__required">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="authRegister__input"
            />
          </div>

          <div>
            <label className="authRegister__style3">
              Phone <span className="authRegister__required">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="0912345678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="authRegister__input"
            />
          </div>

          <div>
            <label className="authRegister__style3">
              New Password <span className="authRegister__required">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="At least 8 chars, uppercase, lowercase, number"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="authRegister__input"
            />
            <p className="authRegister__style4">At least 8 characters, with uppercase, lowercase, and a number.</p>
          </div>

          <div>
            <label className="authRegister__style3">
              Confirm Password <span className="authRegister__required">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter the new password again"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="authRegister__input"
            />
          </div>

          <button type="submit" disabled={loading} className="authRegister__primaryButton2">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
