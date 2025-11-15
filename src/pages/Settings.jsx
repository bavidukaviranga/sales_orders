import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Sales Order Management',
    email: 'admin@company.com',
    phone: '+1234567890',
    address: '123 Business St, City, State 12345',
    currency: 'USD',
    taxRate: 8.0,
    notifications: {
      emailAlerts: true,
      orderUpdates: true,
      lowInventory: false,
      paymentReminders: true
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Business Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          
          <div className="space-y-3">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() => handleNotificationChange(key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;