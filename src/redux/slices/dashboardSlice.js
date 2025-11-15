import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { getState }) => {
    // Get orders from the orders slice to calculate stats
    const orders = getState().orders.orders;
    
    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const processingOrders = orders.filter(order => order.status === 'Processing').length;
    
    const totalRevenue = orders
      .filter(order => order.status === 'Completed')
      .reduce((sum, order) => sum + order.total, 0);
    
    // Monthly sales data for the last 6 months
    const monthlySales = [
      { month: 'January', orders: 45, revenue: 12500 },
      { month: 'February', orders: 52, revenue: 14200 },
      { month: 'March', orders: 38, revenue: 10800 },
      { month: 'April', orders: 61, revenue: 16900 },
      { month: 'May', orders: 47, revenue: 13100 },
      { month: 'June', orders: 55, revenue: 15400 },
    ];
    
    // Recent activity - create a copy to avoid mutation
    const recentActivity = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        type: 'order',
        description: `Order #${order.id} ${order.status.toLowerCase()}`,
        customer: order.customer,
        date: order.date,
        amount: order.total
      }));
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      processingOrders,
      totalRevenue,
      monthlySales,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      processingOrders: 0,
      totalRevenue: 0,
      monthlySales: [],
      recentActivity: [],
      lastUpdated: null
    },
    loading: false,
    error: null,
    refreshInterval: 300000, // 5 minutes
    widgets: {
      showStats: true,
      showChart: true,
      showRecentActivity: true,
      showQuickActions: true
    }
  },
  reducers: {
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    toggleWidget: (state, action) => {
      const widgetName = action.payload;
      if (state.widgets[widgetName] !== undefined) {
        state.widgets[widgetName] = !state.widgets[widgetName];
      }
    },
    setWidgetVisibility: (state, action) => {
      const { widgetName, visible } = action.payload;
      if (state.widgets[widgetName] !== undefined) {
        state.widgets[widgetName] = visible;
      }
    },
    clearDashboardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  setRefreshInterval, 
  toggleWidget, 
  setWidgetVisibility,
  clearDashboardError 
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectRefreshInterval = (state) => state.dashboard.refreshInterval;
export const selectWidgets = (state) => state.dashboard.widgets;

export default dashboardSlice.reducer;