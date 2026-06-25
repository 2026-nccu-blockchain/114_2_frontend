import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { Toaster } from 'react-hot-toast';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import AdminRegister from '@/pages/auth/adminRegister';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Profile from '@/pages/shared/Profile';

// Admin
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminAddSeller from '@/pages/admin/AddSeller';
import AdminAddDriver from '@/pages/admin/AddDriver';

// Buyer
import BuyerProducts from '@/pages/buyer/Products';
import BuyerCart from '@/pages/buyer/Cart';
import BuyerOrders from '@/pages/buyer/MyOrders';
import ProductDetail from '@/pages/buyer/ProductDetail';
import BuyerCheckout from '@/pages/buyer/Checkout';
import BuyerOrderDetail from '@/pages/buyer/OrderDetail';

// Driver
import{
  Activetask,
  Completedtask,
  TaskDetail,
  Tasks
} from '@/pages/driver';
// Seller
import {
  SellerAddProduct,
  SellerDashboard,
  SellerEditProduct,
  SellerOrderDetail,
  SellerOrders,
  SellerProducts,
} from '@/pages/seller';

function HomePage() {
  const { token, role, setRole, logout } = useAuthStore();
  const [checking, setChecking] = useState(Boolean(token && !role));

  useEffect(() => {
    let isMounted = true;

    const checkRole = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      if (role) {
        setChecking(false);
        return;
      }

      setChecking(true);

      try {
        const response = await authService.checkRole(token);
        if (!isMounted) return;

        if (response.data.status_code !== '00000' || !response.data.role) {
          logout();
          return;
        }

        setRole(response.data.role);
      } catch {
        if (!isMounted) return;
        logout();
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    void checkRole();

    return () => {
      isMounted = false;
    };
  }, [logout, role, setRole, token]);

  if (checking) return null;

  if (role === 'seller') return <SellerDashboard />;
  if (role === 'driver') return <Tasks />;
  if (role === 'admin') return <AdminDashboard />;
  return <BuyerProducts />;
}

function OrdersPage() {
  const role = useAuthStore((state) => state.role);

  if (role === 'seller') return <SellerOrders />;
  return <BuyerOrders />;
}

function OrderDetailPage() {
  const role = useAuthStore((state) => state.role);

  if (role === 'seller') return <SellerOrderDetail />;
  return <BuyerOrderDetail />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login role="buyer" />} />
      <Route path="/admin" element={<Login role="admin" />} />
      {/* <Route path="/admin/login" element={<Login role="admin" />} /> */}
      <Route path="/seller" element={<Login role="seller" />} />
      {/* <Route path="/seller/login" element={<Login role="seller" />} /> */}
      <Route path="/driver" element={<Login role="driver" />} />
      {/* <Route path="/driver/login" element={<Login role="driver" />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:pid" element={<ProductDetail />} />
      </Route>

      <Route element={<AuthGuard allowedRoles={['buyer', 'seller', 'driver', 'admin']} />}>
        <Route path="/" element={<DashboardLayout />}>
          {/* 個人資料頁 */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AuthGuard allowedRoles={['buyer']} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="cart" element={<BuyerCart />} />
          <Route path="checkout" element={<BuyerCheckout />} />
        </Route>
      </Route>

      <Route element={<AuthGuard allowedRoles={['buyer', 'seller']} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Route>

      <Route element={<AuthGuard allowedRoles={['seller']} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/:productId/edit" element={<SellerEditProduct />} />
          <Route path="add-product" element={<SellerAddProduct />} />
        </Route>
      </Route>

      <Route element={<AuthGuard allowedRoles={['driver']} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="tasks/:taskId" element={<TaskDetail />} />
          <Route path="active" element={<Activetask />} />
          <Route path="completed" element={<Completedtask />} />
        </Route>
      </Route>

      <Route element={<AuthGuard allowedRoles={['admin']} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="add-seller" element={<AdminAddSeller />} />
          <Route path="add-driver" element={<AdminAddDriver />} />
        </Route>
      </Route>

      {/* 找不到網址自動導回首頁大廳 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} /> 
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
