
import React, { useState } from 'react';
import { FileText, DollarSign, Send, Edit, Check, AlertCircle } from 'lucide-react';

const Quotation = () => {
  const [quote, setQuote] = useState({
    customer: 'Acme Corporation',
    contact: 'John Doe',
    email: 'john@acme.com',
    items: [
      { id: '1', name: 'Enterprise Software License', quantity: 5, unitPrice: 1200, margin: 40 },
      { id: '2', name: 'Implementation Services', quantity: 1, unitPrice: 8000, margin: 35 },
      { id: '3', name: 'Training & Support', quantity: 1, unitPrice: 3000, margin: 50 },
    ],
    discount: 10,
    validUntil: '2024-02-15'
  });

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'needs_review'>('pending');

  const calculateItemTotal = (item: any) => item.quantity * item.unitPrice;
  const calculateCost = (item: any) => item.unitPrice * (1 - item.margin / 100);
  const subtotal = quote.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const discountAmount = subtotal * (quote.discount / 100);
  const total = subtotal - discountAmount;

  const handleItemUpdate = (itemId: string, field: string, value: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSendQuote = (method: 'email' | 'whatsapp') => {
    console.log(`Sending quote via ${method}:`, quote);
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return 'text-green-600';
    if (margin >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarginBg = (margin: number) => {
    if (margin >= 40) return 'bg-green-50';
    if (margin >= 25) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Negotiation & Quotation</h1>
        <p className="text-gray-600 mt-2">
          Create and manage quotes with intelligent margin suggestions
        </p>
      </div>

      <div className="space-y-8">
        {/* Quote Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Quote #QT-2024-001</h2>
                <p className="text-sm text-gray-600">Created: January 15, 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                approvalStatus === 'needs_review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {approvalStatus === 'approved' ? 'Approved' :
                 approvalStatus === 'needs_review' ? 'Needs Review' : 'Pending Approval'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Details</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600"><strong>Company:</strong> {quote.customer}</p>
                <p className="text-sm text-gray-600"><strong>Contact:</strong> {quote.contact}</p>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {quote.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quote Details</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600"><strong>Valid Until:</strong> {quote.validUntil}</p>
                <p className="text-sm text-gray-600"><strong>Discount:</strong> {quote.discount}%</p>
                <p className="text-sm text-gray-600"><strong>Total:</strong> ${total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quote Items</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemUpdate(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemUpdate(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">${item.unitPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMarginBg(item.margin)} ${getMarginColor(item.margin)}`}>
                        {item.margin}%
                        {item.margin < 25 && <AlertCircle className="h-3 w-3 ml-1" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${calculateItemTotal(item).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        {editingItem === item.id ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quote Summary */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount ({quote.discount}%):</span>
                  <span className="text-gray-900">-${discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Margin Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Margin Analysis & Suggestions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">38%</p>
                <p className="text-sm text-green-700">Average Margin</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">${(total * 0.38).toLocaleString()}</p>
                <p className="text-sm text-blue-700">Projected Profit</p>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">15%</p>
                <p className="text-sm text-purple-700">Negotiation Room</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Pricing Suggestions</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Implementation Services margin is below target - consider value-based pricing</li>
              <li>• Training & Support shows strong margin - opportunity to expand this offering</li>
              <li>• Current discount of 10% leaves room for negotiation if needed</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setApprovalStatus('approved')}
            disabled={approvalStatus === 'approved'}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Check className="h-4 w-4 mr-2" />
            {approvalStatus === 'approved' ? 'Approved' : 'Approve Quote'}
          </button>
          <button
            onClick={() => handleSendQuote('email')}
            disabled={approvalStatus !== 'approved'}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send via Email
          </button>
          <button
            onClick={() => handleSendQuote('whatsapp')}
            disabled={approvalStatus !== 'approved'}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
