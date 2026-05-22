import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout() {
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定在頂部的 Navbar */}
      <Navbar />

      <div className="flex pt-16">
        {/* 固定在左側的 Sidebar */}
        <Sidebar />

        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] p-8 transition-all duration-300 ease-in-out ${
            role ? 'pl-64' : 'pl-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}