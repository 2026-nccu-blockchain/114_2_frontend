import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNavItems } from '@/constants/navigation';

export default function Sidebar() {
  const { role } = useAuthStore();
  const location = useLocation();
  
  // 訪客
  if (!role) return null;

  const items = getNavItems(role);

  return (
    <aside className="w-64 border-r border-gray-200 bg-white fixed top-16 bottom-0 left-0 flex flex-col z-10">
      {/* 身分專屬 Menu 標題 */}
      <div className="px-6 py-4 text-xs font-semibold text-gray-400 tracking-wider uppercase">
        {role} Menu
      </div>

      {/* 選單列表 */}
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-600 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}