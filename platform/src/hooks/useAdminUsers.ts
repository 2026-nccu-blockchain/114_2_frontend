import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService, type AdminUserRecord } from '@/services/adminService';
import { useAuthStore } from '@/store/authStore';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'Failed to load admin users';
};

export const useAdminUsers = () => {
  const token = useAuthStore((state) => state.token);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError('請先以管理員身分登入');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllUsers(token);
      setUsers(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchUsers]);

  const stats = useMemo(() => {
    const buyers = users.filter((user) => user.role === 'buyer').length;
    const sellers = users.filter((user) => user.role === 'seller').length;
    const drivers = users.filter((user) => user.role === 'driver').length;

    return {
      totalUsers: users.length,
      admins: 1,
      buyers,
      sellers,
      drivers,
    };
  }, [users]);

  return { users, stats, loading, error, fetchUsers };
};
