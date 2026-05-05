import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ManageMenu from '../pages/admin/ManageMenu';
import OrdersManagement from '../pages/admin/OrdersManagement';
import UsersManagement from '../pages/admin/UsersManagement';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/user/Home';
import Menu from '../pages/user/Menu';
import Cart from '../pages/user/Cart';
import Checkout from '../pages/user/Checkout';
import OrderSuccess from '../pages/user/OrderSuccess';
import OrderTracking from '../pages/user/OrderTracking';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes (Require Login) */}
      <Route path="/checkout" element={<ProtectedRoute requiredRole="user"><Checkout /></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute requiredRole="user"><OrderSuccess /></ProtectedRoute>} />
      <Route path="/order-tracking" element={<ProtectedRoute requiredRole="user"><OrderTracking /></ProtectedRoute>} />

      {/* Protected Admin Routes (Require Admin Role) */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/manage-menu" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageMenu /></AdminLayout></ProtectedRoute>} />
      <Route path="/orders-management" element={<ProtectedRoute requiredRole="admin"><AdminLayout><OrdersManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/users-management" element={<ProtectedRoute requiredRole="admin"><AdminLayout><UsersManagement /></AdminLayout></ProtectedRoute>} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/not-found" element={<NotFound />} />
    </Routes>

  );
}
