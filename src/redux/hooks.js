import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';

// Custom hooks for typed Redux usage
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Convenience hooks for common selectors
export const useOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.orders.orders);
  const loading = useAppSelector(state => state.orders.loading);
  const error = useAppSelector(state => state.orders.error);
  const currentOrder = useAppSelector(state => state.orders.currentOrder);
  
  return useMemo(() => ({ 
    orders, 
    loading, 
    error, 
    currentOrder, 
    dispatch 
  }), [orders, loading, error, currentOrder, dispatch]);
};

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(state => state.customers.customers);
  const loading = useAppSelector(state => state.customers.loading);
  const error = useAppSelector(state => state.customers.error);
  const currentCustomer = useAppSelector(state => state.customers.currentCustomer);
  
  return useMemo(() => ({ 
    customers, 
    loading, 
    error, 
    currentCustomer, 
    dispatch 
  }), [customers, loading, error, currentCustomer, dispatch]);
};

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(state => state.dashboard.stats);
  const loading = useAppSelector(state => state.dashboard.loading);
  const error = useAppSelector(state => state.dashboard.error);
  const widgets = useAppSelector(state => state.dashboard.widgets);
  
  return useMemo(() => ({ 
    stats, 
    loading, 
    error, 
    widgets, 
    dispatch 
  }), [stats, loading, error, widgets, dispatch]);
};