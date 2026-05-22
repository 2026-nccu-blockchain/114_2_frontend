import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function NavActions() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Guest給Sign in
  if (!role) {
    return (
      <Link
        to="/login"
        className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Sign in
      </Link>
    );
  }

  // 是登入會員，顯示身分與Sign out
  const displayName = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  

  return (
    <div className="flex items-center gap-6 text-sm text-gray-600">
      {/* 買家專屬：購物車 */}
      {role === 'buyer' && (
        <Link
          to="/cart"
          className="p-1 hover:text-teal-600 transition-colors relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && 
            (<span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}

        </Link>
      )}

      {/* 使用者名稱與頭像 */}
      <Link
        to="/profile"
        className="flex items-center gap-2 hover:text-teal-600 transition-colors group"
      >
        <UserIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="font-medium">{displayName}</span>
      </Link>

      {/* 登出按鈕 */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </div>
  );
}