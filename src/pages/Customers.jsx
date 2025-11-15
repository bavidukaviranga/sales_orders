import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '../redux/hooks';
import { fetchCustomers, selectFilteredCustomers, setSearchTerm, setSorting } from '../redux/slices/customersSlice';
import { useAppSelector } from '../redux/hooks';

const Customers = () => {
  const { loading, error, dispatch } = useCustomers();
  const customers = useAppSelector(selectFilteredCustomers);
  const searchTerm = useAppSelector(state => state.customers.searchTerm);
  const sorting = useAppSelector(state => ({ sortBy: state.customers.sortBy, sortOrder: state.customers.sortOrder }));

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSort = (field) => {
    const newOrder = sorting.sortBy === field && sorting.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: field, sortOrder: newOrder }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Customers</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading customers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add New Customer
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Customers
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Name {sorting.sortBy === 'name' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('email')}
              >
                Email {sorting.sortBy === 'email' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('orders')}
              >
                Orders {sorting.sortBy === 'orders' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalSpent')}
              >
                Total Spent {sorting.sortBy === 'totalSpent' && (sorting.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    to={`/customers/${customer.id}`} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </Link>
                  <button className="text-green-600 hover:text-green-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;