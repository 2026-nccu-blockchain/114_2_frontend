import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, type LoginRole } from '@/hooks/useAuth';

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password, role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-teal-600 hover:text-teal-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
          </div>

          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              Account type <span className="text-red-500">*</span>
            </label> */}
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                    role === option.value
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-700'
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
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
