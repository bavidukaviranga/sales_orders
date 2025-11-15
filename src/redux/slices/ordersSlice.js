import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Mock data - replace with actual API calls
const mockOrders = [
  { id: 1, customer: 'John Doe', date: '2024-01-15', status: 'Pending', total: 250.00, email: 'john.doe@email.com', phone: '+1234567890', address: '123 Main St, City, State 12345', items: [{ id: 1, product: 'Laptop', quantity: 1, price: 250.00 }] },
  { id: 2, customer: 'Jane Smith', date: '2024-01-14', status: 'Completed', total: 180.50, email: 'jane.smith@email.com', phone: '+0987654321', address: '456 Oak Ave, City, State 12345', items: [{ id: 2, product: 'Mouse', quantity: 3, price: 60.17 }] },
  { id: 3, customer: 'Mike Johnson', date: '2024-01-13', status: 'Processing', total: 320.75, email: 'mike.johnson@email.com', phone: '+1122334455', address: '789 Pine St, City, State 12345', items: [{ id: 3, product: 'Keyboard', quantity: 2, price: 160.38 }] },
];

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    // Simulate API call - return a deep copy to avoid mutation issues
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(mockOrders))), 1000);
    });
  }
);

// Async thunk for creating order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData) => {
    // Simulate API call
    const newOrder = {
      ...orderData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(newOrder), 500);
    });
  }
);

// Async thunk for updating order
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, ...orderData }), 500);
    });
  }
);

// Async thunk for deleting order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(orderId), 500);
    });
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    filters: {
      status: 'all',
      dateRange: { start: '', end: '' },
      customer: ''
    }
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: { start: '', end: '' },
        customer: ''
      };
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        if (state.currentOrder && state.currentOrder.id === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  setCurrentOrder, 
  clearCurrentOrder, 
  setFilters, 
  clearFilters,
  updateOrderStatus 
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersFilters = (state) => state.orders.filters;

// Filtered orders selector with memoization
export const selectFilteredOrders = createSelector(
  [selectOrders, selectOrdersFilters],
  (orders, filters) => {
    return orders.filter(order => {
      // Status filter
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }
      
      // Customer filter
      if (filters.customer && !order.customer.toLowerCase().includes(filters.customer.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange.start && order.date < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && order.date > filters.dateRange.end) {
        return false;
      }
      
      return true;
    });
  }
);

export default ordersSlice.reducer;