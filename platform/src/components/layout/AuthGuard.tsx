import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
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
  const [checkFailedRedirectTo, setCheckFailedRedirectTo] = useState<string | null>(null);
  const allowedRolesKey = allowedRoles?.join(',') ?? '';
  const normalizedAllowedRoles = allowedRolesKey
    .split(',')
    .filter(Boolean) as Exclude<UserRole, null>[];
  const targetRole = normalizedAllowedRoles[0] ?? 'buyer';
  const roleMismatch = Boolean(
    token &&
    role &&
    normalizedAllowedRoles.length &&
    !normalizedAllowedRoles.includes(role),
  );

  useEffect(() => {
    if (!roleMismatch) return;

    logout();
  }, [logout, roleMismatch]);

  useEffect(() => {
    if (!token || role) return;

    let isMounted = true;
    const rolesToCheck = allowedRolesKey
      .split(',')
      .filter(Boolean) as Exclude<UserRole, null>[];

    const checkRole = async () => {
      try {
        const response = await authService.checkRole(token);
        const checkedRole = response.data.role ?? null;

        if (!isMounted) return;

        if (response.data.status_code !== '00000' || !checkedRole) {
          logout();
          setCheckFailedRedirectTo('/');
          return;
        }

        if (rolesToCheck.length && !rolesToCheck.includes(checkedRole)) {
          logout();
          setCheckFailedRedirectTo(loginPathByRole[targetRole]);
          return;
        }

        setRole(checkedRole);
      } catch {
        if (!isMounted) return;
        logout();
        setCheckFailedRedirectTo('/');
      }
    };

    void checkRole();

    return () => {
      isMounted = false;
    };
  }, [allowedRolesKey, logout, role, setRole, targetRole, token]);

  if (!token) {
    return <Navigate to={loginPathByRole[targetRole]} replace />;
  }

  if (checkFailedRedirectTo) {
    return <Navigate to={checkFailedRedirectTo} replace />;
  }

  if (roleMismatch) {
    return <Navigate to={loginPathByRole[targetRole]} replace />;
  }

  if (!role) {
    return null;
  }

  return <Outlet />;
};
