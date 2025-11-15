import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../redux/hooks';
import { setCurrentOrder, updateOrderStatus } from '../redux/slices/ordersSlice';
import { useAppSelector } from '../redux/hooks';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, dispatch } = useOrders();
  const orders = useAppSelector(state => state.orders.orders);
  const currentOrder = useAppSelector(state => state.orders.currentOrder);

  useEffect(() => {
    const orderId = parseInt(id);
    const foundOrder = orders.find(order => order.id === orderId);
    
    if (foundOrder) {
      // Add calculated fields
      const orderWithCalcs = {
        ...foundOrder,
        subtotal: foundOrder.total || 0,
        tax: (foundOrder.total || 0) * 0.08, // 8% tax
        items: foundOrder.items || []
      };
      dispatch(setCurrentOrder(orderWithCalcs));
    } else {
      // Mock data for demo if order not found
      const mockOrder = {
        id: orderId,
        customer: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
        date: '2024-01-15',
        status: 'Processing',
        items: [
          { id: 1, product: 'Laptop', quantity: 1, price: 999.99 },
          { id: 2, product: 'Mouse', quantity: 2, price: 25.00 },
        ],
        subtotal: 1049.99,
        tax: 84.00,
        total: 1133.99
      };
      dispatch(setCurrentOrder(mockOrder));
    }
  }, [id, orders, dispatch]);

  const handleStatusChange = (newStatus) => {
    if (currentOrder) {
      dispatch(updateOrderStatus({ orderId: currentOrder.id, status: newStatus }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !currentOrder) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Details #{currentOrder.id}</h1>
          <p className="text-gray-600 mt-1">Placed on {currentOrder.date}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/orders/${currentOrder.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Order
          </Link>
          <button 
            onClick={() => navigate('/orders')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{currentOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{currentOrder.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{currentOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{currentOrder.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrder.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        ${item.price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Status</h3>
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status}
              </span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange('Pending')}
                className={`w-full text-left px-3 py-2 rounded ${currentOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-100'}`}
              >
                Mark as Pending
              </button>
              <button
                onClick={() => handleStatusChange('Processing')}
                className={`w-full text-left px-3 py-2 rounded ${currentOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Mark as Processing
              </button>
              <button
                onClick={() => handleStatusChange('Completed')}
                className={`w-full text-left px-3 py-2 rounded ${currentOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
              >
                Mark as Completed
              </button>
              <button
                onClick={() => handleStatusChange('Cancelled')}
                className={`w-full text-left px-3 py-2 rounded ${currentOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`}
              >
                Mark as Cancelled
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${currentOrder.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>${currentOrder.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${(currentOrder.subtotal + currentOrder.tax)?.toFixed(2) || currentOrder.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;