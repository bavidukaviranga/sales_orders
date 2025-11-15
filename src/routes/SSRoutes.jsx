import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import CreateOrder from '../pages/CreateOrder';
import EditOrder from '../pages/EditOrder';
import OrderDetails from '../pages/OrderDetails';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const SSRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Orders Routes */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="orders/:id/edit" element={<EditOrder />} />
          
          {/* Customers Routes */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<div className="p-6">Customer Details - Coming Soon</div>} />
          
          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="p-6 text-center">
              <h1 className="text-3xl font-bold text-gray-600 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-500">The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default SSRoutes;