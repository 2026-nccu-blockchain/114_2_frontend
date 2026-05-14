import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// 1. Auth and shared layout
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Profile from '@/pages/shared/Profile'

// 2. Admin pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminAddSeller from '@/pages/admin/AddSeller'
import AdminAddDriver from '@/pages/admin/AddDriver'

// 3. Buyer pages
import BuyerProducts from '@/pages/buyer/Products'
import BuyerCart from '@/pages/buyer/Cart'
import BuyerOrders from '@/pages/buyer/MyOrders'

// 4. Driver pages
import DriverTasks from '@/pages/driver/Tasks'
import DriverActive from '@/pages/driver/Active'
import DriverCompleted from '@/pages/driver/Completed'

// 5. Seller pages
import SellerDashboard from '@/pages/seller/Dashboard'
import SellerProducts from '@/pages/seller/Products'
import SellerAddProduct from '@/pages/seller/AddProduct'
import SellerOrders from '@/pages/seller/Orders'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="add-seller" element={<AdminAddSeller />} />
            <Route path="add-driver" element={<AdminAddDriver />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Buyer */}
          <Route path="/buyer" element={<DashboardLayout />}>
            <Route index element={<BuyerProducts />} />
            <Route path="cart" element={<BuyerCart />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Driver */}
          <Route path="/driver" element={<DashboardLayout />}>
            <Route index element={<DriverTasks />} />
            <Route path="active" element={<DriverActive />} />
            <Route path="completed" element={<DriverCompleted />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Seller */}
          <Route path="/seller" element={<DashboardLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="add-product" element={<SellerAddProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<div className="text-center p-8">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App

