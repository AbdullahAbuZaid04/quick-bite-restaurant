import { useState, useEffect, useCallback } from "react";
import { getAllOrdersApi, updateOrderStatusApi, payOrderApi, markPaymentPaidApi, getOrderPaymentsApi } from "../api/orderService";
import toast from 'react-hot-toast';

export function useOrders(limit = 20) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setIsLoading(true);
    setOrdersError(null);
    try {
      const offset = (page - 1) * limit;
      const result = await getAllOrdersApi({ limit, offset });
      if (result.success) {
        setOrders(result.data || []);
        setMeta(result.meta || {});
      } else {
        setOrdersError(result.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrdersError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatusApi(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully!");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast.error(result.message || 'Failed to update status');
        fetchOrders(currentPage);
      }
    } catch (error) {
      toast.error(error.message);
      fetchOrders(currentPage);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmPayment = async (orderId, totalAmount) => {
    setConfirmingPaymentId(orderId);
    try {
      const paymentsRes = await getOrderPaymentsApi(orderId);
      let paymentId;
      const pending = paymentsRes.success
        ? paymentsRes.data.find(p => p.status === 'pending')
        : null;

      if (pending) {
        paymentId = pending.id;
      } else {
        const createRes = await payOrderApi({
          order_id: orderId,
          amount: totalAmount,
          method: 'bank_transfer'
        });
        if (!createRes.success) {
          toast.error(createRes.message || 'Failed to create payment');
          return;
        }
        paymentId = createRes.data.id;
      }

      const markRes = await markPaymentPaidApi(paymentId);
      if (markRes.success) {
        toast.success('Payment confirmed successfully!');
        fetchOrders(currentPage);
      } else {
        toast.error(markRes.message || 'Failed to confirm payment');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
    setConfirmingPaymentId(null);
  };

  return {
    orders,
    isLoading,
    currentPage,
    setCurrentPage,
    meta,
    updatingId,
    ordersError,
    confirmingPaymentId,
    refetchOrders: fetchOrders,
    handleStatusChange,
    handleConfirmPayment
  };
}
