
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCompanySetup } from '@/hooks/useCompanySetup';
import { useIsMobile } from '@/hooks/use-mobile';
import img from './../../public/logo.jpg'
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
  ChevronRight,
  Moon,
  Sun,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModernLayout = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, signOut } = useAuth();
  const { hasCompanySetup, loading } = useCompanySetup();
  const isMobile = useIsMobile();

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
    { 
      name: 'Toggle Theme', 
      href: '#', 
      icon: isDarkMode ? Sun : Moon,
      action: toggleDarkMode,
      isAction: true
    },
  ];

  if (isMobile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}>
        {/* Mobile Header */}
        <div className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-md shadow-lg border-b z-50 flex items-center px-4 ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <div className="flex items-center ml-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            <h1 className={`ml-3 text-lg font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`}>
              SalesBuddy
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <div className={`fixed top-16 left-0 bottom-0 w-80 backdrop-blur-md shadow-2xl overflow-y-auto ${
              isDarkMode 
                ? 'bg-gray-800/95' 
                : 'bg-white/95'
            }`}>
              <nav className="mt-6 px-4">
                {navigation.map((item) => {
                  if (item.isAction) {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3">{item.name}</span>
                      </button>
                    );
                  }
                  
                  const isLocked = !hasCompanySetup && item.href !== '/company-setup';
                  
                  if (isLocked) {
                    return (
                      <div
                        key={item.name}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 cursor-not-allowed opacity-50 ${
                          isDarkMode
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      >
                        <Lock className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3">{item.name}</span>
                      </div>
                    );
                  }
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 ${
                          isActive
                            ? isDarkMode 
                              ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-blue-400 shadow-md'
                              : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                            : isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3">{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Mobile User section */}
              <div className={`p-4 border-t mt-auto ${
                isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium truncate ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className={`${
                      isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Main content */}
        <div className="pt-16">
          <main className={`p-4 min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-transparent'
          }`}>
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Desktop Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full backdrop-blur-md shadow-2xl border-r transition-all duration-500 ease-in-out z-50 ${
          sidebarHovered ? 'w-80' : 'w-16'
        } ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Header */}
        <div className={`flex items-center h-16 px-3 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`}>
                SalesBuddy
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1">
          {navigation.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 group relative ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    {item.name}
                  </span>
                  {!sidebarHovered && (
                    <ChevronRight className="absolute left-12 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              );
            }
            
            const isLocked = !hasCompanySetup && item.href !== '/company-setup';
            
            if (isLocked) {
              return (
                <div
                  key={item.name}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 cursor-not-allowed opacity-50 ${
                    isDarkMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  <Lock className="h-5 w-5 flex-shrink-0" />
                  <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    {item.name}
                  </span>
                </div>
              );
            }
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-300 group relative ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-blue-400 shadow-md'
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
            );
          })}
        </nav>

        {/* User section */}
        <div className={`p-4 border-t transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={`ml-3 flex-1 transition-all duration-300 ${sidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>{user?.email}</p>
            </div>
            <div className={`transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main content */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${sidebarHovered ? 'ml-80' : 'ml-16'}`}>
        <main className={`p-8 min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-transparent'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
