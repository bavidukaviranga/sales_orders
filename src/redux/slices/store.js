import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import customersReducer from './customersSlice';
import dashboardReducer from './dashboardSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    orders: ordersReducer,
    customers: customersReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript usage (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;