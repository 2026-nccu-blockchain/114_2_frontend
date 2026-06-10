import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/pages/auth/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="authLogin__page">
      <div className="authLogin__panel">
        <div className="authLogin__style">
          <h2 className="authLogin__title">Sign in to your account</h2>
          <p className="authLogin__mutedText">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="authLogin__primaryButton">
              Sign up
            </Link>
          </p>
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
