import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, type LoginRole } from '@/hooks/useAuth';
import '@/styles/pages/auth/Login.css';

const loginTitles: Record<LoginRole, string> = {
  buyer: 'Sign in to your account',
  seller: 'Seller sign in',
  driver: 'Driver sign in',
  admin: 'Admin sign in',
};

interface LoginProps {
  role?: LoginRole;
}

export default function Login({ role = 'buyer' }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password, role);
  };

  return (
    <div className="authLogin__page">
      <div className="authLogin__panel">
        <div className="authLogin__style">
          <h2 className="authLogin__title">{loginTitles[role]}</h2>
          {role === 'buyer' ? (
            <p className="authLogin__mutedText">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="authLogin__primaryButton">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="authLogin__mutedText">
              {role === 'admin' ? (
                <>
                  Use your administrator credentials.{' '}
                  <Link to="/admin/register" className="authLogin__primaryButton">
                    Create admin account
                  </Link>
                </>
              ) : (
                'Use the account assigned by an administrator.'
              )}
            </p>
          )}
        </div>

        {error && <div className="authLogin__style2">{error}</div>}

        <form onSubmit={handleSubmit} className="authLogin__page2">
          

          <div>
            <label className="authLogin__style3">
              Email <span className="authLogin__required">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="authLogin__input"
            />
          </div>

          <div>
            <label className="authLogin__style3">
              Password <span className="authLogin__required">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="authLogin__input"
            />
            <div className="authLogin__helperRow">
              <Link to="/forgot-password" className="authLogin__primaryButton">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="authLogin__primaryButton2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
