import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; 

interface AuthGuardProps {
  allowedRoles?: string[];
}

export const AuthGuard = ({ allowedRoles }: AuthGuardProps) => {
  const { role } = useAuthStore();

  //沒有身分(訪客)，回登入頁面
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // 沒有權限，直接強制踢回首頁
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};