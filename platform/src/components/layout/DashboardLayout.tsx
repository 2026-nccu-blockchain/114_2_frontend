import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定在頂部的 Navbar */}
      <Navbar />

      <div className="flex pt-16">
        {/* 固定在左側的 Sidebar */}
        <Sidebar />

        {/* 右側的主要內容區域 */}
        <main className="flex-1 pl-64 min-h-[calc(100vh-4rem)] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
