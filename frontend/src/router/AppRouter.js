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

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/manage-menu" element={<AdminLayout><ManageMenu /></AdminLayout>} />
      <Route path="/orders-management" element={<AdminLayout><OrdersManagement /></AdminLayout>} />
      <Route path="/users-management" element={<AdminLayout><UsersManagement /></AdminLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  );
}