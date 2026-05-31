import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const MenuManagement = lazy(() => import('../pages/admin/MenuManagement'));
const CategoriesManagement = lazy(() => import('../pages/admin/CategoriesManagement'));
const OrdersManagement = lazy(() => import('../pages/admin/OrdersManagement'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Home = lazy(() => import('../pages/user/Home'));
const Menu = lazy(() => import('../pages/user/Menu'));
const Cart = lazy(() => import('../pages/user/Cart'));
const Checkout = lazy(() => import('../pages/user/Checkout'));
const OrderSuccess = lazy(() => import('../pages/user/OrderSuccess'));
const OrderTracking = lazy(() => import('../pages/user/OrderTracking'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ui-mainBg">
      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes (Require Login) */}
        <Route path="/checkout" element={<ProtectedRoute requiredRole="customer"><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute requiredRole="customer"><OrderSuccess /></ProtectedRoute>} />
        <Route path="/order-tracking" element={<ProtectedRoute requiredRole="customer"><OrderTracking /></ProtectedRoute>} />

        {/* Protected Admin Routes (Require Admin Role) */}
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/manage-menu" element={<ProtectedRoute requiredRole="admin"><AdminLayout><MenuManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/categories-management" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CategoriesManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/orders-management" element={<ProtectedRoute requiredRole="admin"><AdminLayout><OrdersManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/users-management" element={<ProtectedRoute requiredRole="admin"><AdminLayout><UsersManagement /></AdminLayout></ProtectedRoute>} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
