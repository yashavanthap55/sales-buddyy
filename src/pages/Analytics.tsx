
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Mail, Eye, MousePointer, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Analytics = () => {
   const { isDarkMode } = useTheme();
  const engagementData = [
    { name: 'Week 1', emails: 45, opens: 32, clicks: 18, responses: 8 },
    { name: 'Week 2', emails: 52, opens: 38, clicks: 22, responses: 12 },
    { name: 'Week 3', emails: 48, opens: 35, clicks: 19, responses: 9 },
    { name: 'Week 4', emails: 56, opens: 42, clicks: 28, responses: 15 },
  ];

  const probabilityData = [
    { stage: 'Lead', probability: 100, count: 150 },
    { stage: 'Qualified', probability: 85, count: 127 },
    { stage: 'Demo Sent', probability: 65, count: 82 },
    { stage: 'Proposal', probability: 45, count: 37 },
    { stage: 'Negotiation', probability: 25, count: 16 },
    { stage: 'Closed Won', probability: 24, count: 12 },
  ];

  const leadSourceData = [
    { name: 'LinkedIn', value: 35, color: '#0077B5' },
    { name: 'Website', value: 28, color: '#10B981' },
    { name: 'Email Campaign', value: 20, color: '#3B82F6' },
    { name: 'Referrals', value: 12, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  const metrics = [
    {
      name: 'Email Open Rate',
      value: '68.5%',
      change: '+5.2%',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Response Rate',
      value: '23.4%',
      change: '+3.1%',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Demo Conversion',
      value: '41.2%',
      change: '+8.7%',
      icon: MousePointer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Win Probability',
      value: '24.1%',
      change: '+2.3%',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${
          isDarkMode 
            ? 'text-gray-300' 
            : 'text-gray-900'
        }`}>Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track engagement levels and win/loss probability across your sales funnel
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 ml-1">{metric.change}</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Engagement Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="emails" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Emails Sent"
              />
              <Line 
                type="monotone" 
                dataKey="opens" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Opens"
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Clicks"
              />
              <Line 
                type="monotone" 
                dataKey="responses" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Responses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Sources</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {leadSourceData.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Funnel & Probability</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={probabilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar 
              yAxisId="left"
              dataKey="count" 
              fill="#3B82F6" 
              name="Count"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="probability" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Win Probability %"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-sm text-green-700">Lead Quality Score</p>
            <p className="text-xs text-gray-600 mt-1">Above industry average</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">6.2 days</p>
            <p className="text-sm text-blue-700">Avg. Response Time</p>
            <p className="text-xs text-gray-600 mt-1">24% faster than last month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">$127K</p>
            <p className="text-sm text-purple-700">Pipeline Value</p>
            <p className="text-xs text-gray-600 mt-1">Active opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
