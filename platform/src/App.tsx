import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthGuard } from './components/layout/AuthGuard';
import { useAuthStore } from '@/store/authStore';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
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
import ProductDetail from './pages/buyer/ProductDetail';

// Driver
import DriverTasks from '@/pages/driver/Tasks';
import DriverActive from '@/pages/driver/Active';
import DriverCompleted from '@/pages/driver/Completed';

// Seller
import SellerDashboard from '@/pages/seller/Dashboard';
import SellerProducts from '@/pages/seller/Products';
import SellerAddProduct from '@/pages/seller/AddProduct';
import SellerOrders from '@/pages/seller/Orders';

function AppRoutes() {
  const { role } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route
          index
          element={
            role === 'seller' ? (
              <SellerDashboard />
            ) : role === 'driver' ? (
              <DriverTasks />
            ) : role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <BuyerProducts />
            )
          }   
        />
        <Route path="products/:id" element={<ProductDetail />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path="/" element={<DashboardLayout />}>
          {/* 個人資料頁 */}
          <Route path="profile" element={<Profile />} />

          {/* buyer */}
          {role === 'buyer' && (
            <>
              <Route path="cart" element={<BuyerCart />} />
              <Route path="orders" element={<BuyerOrders />} />
            </>
          )}

          {/* seller */}
          {role === 'seller' && (
            <>
              <Route path="products" element={<SellerProducts />} />
              <Route path="add-product" element={<SellerAddProduct />} />
              <Route path="orders" element={<SellerOrders />} />
            </>
          )}

          {/* driver */}
          {role === 'driver' && (
            <>
              <Route path="active" element={<DriverActive />} />
              <Route path="completed" element={<DriverCompleted />} />
            </>
          )}

          {/* admin */}
          {role === 'admin' && (
            <>
              <Route path="users" element={<AdminUsers />} />
              <Route path="add-seller" element={<AdminAddSeller />} />
              <Route path="add-driver" element={<AdminAddDriver />} />
            </>
          )}
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
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;