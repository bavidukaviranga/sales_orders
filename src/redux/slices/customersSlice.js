import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Mock data - replace with actual API calls
const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '+1234567890', orders: 5, totalSpent: 1250.00, address: '123 Main St, City, State 12345', createdDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+0987654321', orders: 3, totalSpent: 890.50, address: '456 Oak Ave, City, State 12345', createdDate: '2023-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@email.com', phone: '+1122334455', orders: 8, totalSpent: 2340.75, address: '789 Pine St, City, State 12345', createdDate: '2023-01-10' },
];

// Async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCustomers), 1000);
    });
  }
);

// Async thunk for creating customer
export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData) => {
    // Simulate API call
    const newCustomer = {
      ...customerData,
      id: Date.now(),
      orders: 0,
      totalSpent: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(newCustomer), 500);
    });
  }
);

// Async thunk for updating customer
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, ...customerData }), 500);
    });
  }
);

// Async thunk for deleting customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(customerId), 500);
    });
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  reducers: {
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    updateCustomerStats: (state, action) => {
      const { customerId, orderTotal } = action.payload;
      const customer = state.customers.find(customer => customer.id === customerId);
      if (customer) {
        customer.orders += 1;
        customer.totalSpent += orderTotal;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        if (state.currentCustomer && state.currentCustomer.id === action.payload) {
          state.currentCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  setCurrentCustomer, 
  clearCurrentCustomer, 
  setSearchTerm, 
  setSorting,
  updateCustomerStats 
} = customersSlice.actions;

// Selectors
export const selectCustomers = (state) => state.customers.customers;
export const selectCurrentCustomer = (state) => state.customers.currentCustomer;
export const selectCustomersLoading = (state) => state.customers.loading;
export const selectCustomersError = (state) => state.customers.error;
export const selectSearchTerm = (state) => state.customers.searchTerm;
export const selectSorting = (state) => ({
  sortBy: state.customers.sortBy,
  sortOrder: state.customers.sortOrder
});

// Filtered and sorted customers selector with memoization
export const selectFilteredCustomers = createSelector(
  [selectCustomers, selectSearchTerm, selectSorting],
  (customers, searchTerm, { sortBy, sortOrder }) => {
    // Filter customers
    let filteredCustomers = customers;
    if (searchTerm) {
      filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort customers - create a copy to avoid mutation
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return sortedCustomers;
  }
);

export default customersSlice.reducer;