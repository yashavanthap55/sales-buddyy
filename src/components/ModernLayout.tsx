
import React, { useState } from 'react';
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
  LogOut,
  MessageSquare,
  Bot,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModernLayout = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Modern Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200/50 transition-all duration-500 ease-in-out z-50 ${
          sidebarHovered ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SalesBuddy
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                {item.name}
              </span>
              {!sidebarHovered && (
                <ChevronRight className="absolute left-12 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={`ml-3 flex-1 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className={`text-gray-500 hover:text-gray-700 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${sidebarHovered ? 'ml-80' : 'ml-16'}`}>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
