import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Orders', href: '/orders', icon: '📦' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Reports', href: '/reports', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const isActive = (href) => {
    return location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Sales Orders</h1>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'bg-blue-100 text-blue-900 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;