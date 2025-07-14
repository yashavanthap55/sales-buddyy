
import React, { useState } from 'react';
import { Send, Upload, Mail, MessageSquare, Eye, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const DemoDelivery = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp'>('email');
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [customMessage, setCustomMessage] = useState('');
   const { isDarkMode } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const catalogs = [
    { id: '1', name: 'Product Catalog 2024', size: '2.3 MB', lastUpdated: '2024-01-15' },
    { id: '2', name: 'Service Portfolio', size: '1.8 MB', lastUpdated: '2024-01-10' },
    { id: '3', name: 'Premium Solutions', size: '3.1 MB', lastUpdated: '2024-01-08' },
  ];

  const deliveryLogs = [
    {
      id: '1',
      recipient: 'john@acme.com',
      company: 'Acme Corporation',
      method: 'Email',
      catalog: 'Product Catalog 2024',
      sentAt: '2024-01-15 10:30 AM',
      status: 'opened',
      openedAt: '2024-01-15 11:45 AM',
      clicks: 3
    },
    {
      id: '2',
      recipient: 'sarah@techcorp.com',
      company: 'TechCorp Ltd',
      method: 'WhatsApp',
      catalog: 'Service Portfolio',
      sentAt: '2024-01-15 09:15 AM',
      status: 'delivered',
      openedAt: null,
      clicks: 0
    },
    {
      id: '3',
      recipient: 'mike@startup.io',
      company: 'Startup Inc',
      method: 'Email',
      catalog: 'Premium Solutions',
      sentAt: '2024-01-14 04:20 PM',
      status: 'clicked',
      openedAt: '2024-01-14 04:35 PM',
      clicks: 7
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSendDemo = () => {
    console.log('Sending demo:', {
      method: deliveryMethod,
      catalog: selectedCatalog,
      message: customMessage,
      file: uploadedFile
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'opened':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'clicked':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delivered':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Send className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'opened':
        return 'bg-blue-100 text-blue-800';
      case 'clicked':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${
          isDarkMode 
            ? 'text-gray-300' 
            : 'text-gray-900'
        }`}>Demo & Catalog Delivery</h1>
        <p className="text-gray-600 mt-2">
          Send product demos and catalogs to qualified leads via email or WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Send Demo</h2>

          {/* Delivery Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Method
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeliveryMethod('email')}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  deliveryMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => setDeliveryMethod('whatsapp')}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  deliveryMethod === 'whatsapp'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Catalog Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Product Catalog
            </label>
            <div className="space-y-2">
              {catalogs.map((catalog) => (
                <label key={catalog.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="catalog"
                    value={catalog.id}
                    checked={selectedCatalog === catalog.id}
                    onChange={(e) => setSelectedCatalog(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{catalog.name}</p>
                    <p className="text-xs text-gray-500">{catalog.size} • Updated {catalog.lastUpdated}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Upload New Catalog
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {uploadedFile ? uploadedFile.name : 'Upload PDF, PPT, or DOC file'}
                </p>
              </label>
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Hi there! Please find attached our ${deliveryMethod === 'whatsapp' ? 'product catalog' : 'demo presentation'}. Looking forward to discussing how we can help your business grow.`}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendDemo}
            disabled={!selectedCatalog && !uploadedFile}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send {deliveryMethod === 'email' ? 'Email' : 'WhatsApp Message'}
          </button>
        </div>

        {/* Delivery Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Status</h2>
          
          <div className="space-y-4">
            {deliveryLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{log.company}</p>
                    <p className="text-sm text-gray-600">{log.recipient}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(log.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <p>{log.catalog} • via {log.method}</p>
                  <p>Sent: {log.sentAt}</p>
                  {log.openedAt && <p>Opened: {log.openedAt}</p>}
                </div>

                {log.clicks > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-sm">
                    <p className="text-green-800 font-medium">
                      📊 {log.clicks} clicks recorded
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">This Week's Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-600">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-xs text-gray-600">Opened</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-xs text-gray-600">Clicked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDelivery;
