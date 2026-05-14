import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (!role) return 'Guest';
    return `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-20">
      <Link to={`/${role || 'login'}`} className="text-xl font-bold text-gray-900 tracking-tight">
        COD<span className="text-teal-600 font-medium">Platform</span>
      </Link>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        {/* 只有買家 (buyer) 登入時，顯示購物車圖示連結 */}
        {role === 'buyer' && (
          <Link
            to="/buyer/cart"
            className="p-1 hover:text-gray-900 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
        )}

        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>{getDisplayName()}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
