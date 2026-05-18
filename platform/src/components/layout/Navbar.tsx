import { Link } from 'react-router-dom';
import NavActions from '@/components/layout/NavActions';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-20">

      <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
        COD<span className="text-teal-600 font-medium">Platform</span>
      </Link>

      {/* 右側按鈕群給 NavActions 判斷身分 */}
      <NavActions />
    </header>
  );
}
