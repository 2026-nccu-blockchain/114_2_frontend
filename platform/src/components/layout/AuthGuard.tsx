import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore, type UserRole } from '@/store/authStore'; 

interface AuthGuardProps {
  allowedRoles?: Exclude<UserRole, null>[];
}

const loginPathByRole: Record<Exclude<UserRole, null>, string> = {
  buyer: '/login',
  seller: '/seller',
  driver: '/driver',
  admin: '/admin',
};

export const AuthGuard = ({ allowedRoles }: AuthGuardProps) => {
  const { token, role, setRole, logout } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const allowedRolesKey = allowedRoles?.join(',') ?? '';

  useEffect(() => {
    let isMounted = true;

    const checkRole = async () => {
      setIsChecking(true);
      setRedirectTo(null);

      const normalizedAllowedRoles = allowedRolesKey
        .split(',')
        .filter(Boolean) as Exclude<UserRole, null>[];

      if (!token) {
        const targetRole = normalizedAllowedRoles[0] ?? 'buyer';
        setRedirectTo(loginPathByRole[targetRole]);
        setIsChecking(false);
        return;
      }

      try {
        const response = await authService.checkRole(token);
        const checkedRole = response.data.role ?? null;

        if (!isMounted) return;

        if (response.data.status_code !== '00000' || !checkedRole) {
          logout();
          setRedirectTo('/');
          return;
        }

        if (normalizedAllowedRoles.length && !normalizedAllowedRoles.includes(checkedRole)) {
          logout();
          setRedirectTo(loginPathByRole[normalizedAllowedRoles[0]]);
          return;
        }

        setRole(checkedRole);
      } catch {
        if (!isMounted) return;
        logout();
        setRedirectTo('/');
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    void checkRole();

    return () => {
      isMounted = false;
    };
  }, [allowedRolesKey, location.pathname, logout, setRole, token]);

  if (isChecking) {
    return null;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!role) {
    return null;
  }

  return <Outlet />;
};
