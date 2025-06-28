import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Building2, 
  Users, 
  Target, 
  Send, 
  FileText, 
  BarChart3,
  Menu,
  X,
  LogOut,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'AI Assistant', href: '/chatbot', icon: Bot },
    { name: 'Leads', href: '/leads', icon: MessageSquare },
    { name: 'Company Setup', href: '/company-setup', icon: Building2 },
    { name: 'Lead Qualification', href: '/lead-qualification', icon: Users },
    { name: 'Lead Scoring', href: '/lead-scoring', icon: Target },
    { name: 'Demo Delivery', href: '/demo-delivery', icon: Send },
    { name: 'Quotation', href: '/quotation', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">SalesBuddy</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3 flex-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">SalesBuddy</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
