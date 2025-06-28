
import React from 'react';
import { ArrowUp, Users, Target, Send, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { name: 'Total Leads', value: '2,847', change: '+12.3%', icon: Users, color: 'text-blue-600' },
    { name: 'Qualified Leads', value: '1,234', change: '+8.1%', icon: Target, color: 'text-green-600' },
    { name: 'Demos Sent', value: '567', change: '+23.4%', icon: Send, color: 'text-purple-600' },
    { name: 'Win Rate', value: '24.5%', change: '+3.2%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Automate Your Sales Journey with SalesBuddy
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Transform your sales process with AI-powered lead qualification, 
            intelligent scoring, and automated demo delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/company-setup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
            >
              Start for Free
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              See How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 ml-1">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/company-setup"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Set Up Company Profile</p>
                <p className="text-sm text-gray-500">Configure your company details and products</p>
              </div>
            </Link>
            <Link
              to="/lead-qualification"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Qualify New Lead</p>
                <p className="text-sm text-gray-500">Add and enrich lead information</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Demo sent to Acme Corp</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New lead qualified: Tech Solutions Ltd</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Quote approved for StartupXYZ</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Trusted by leading companies</h3>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">ACME</div>
            <div className="text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-2xl font-bold text-gray-400">StartupHub</div>
            <div className="text-2xl font-bold text-gray-400">InnovateLabs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
