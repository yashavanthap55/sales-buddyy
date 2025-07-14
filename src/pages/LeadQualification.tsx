
import React, { useState } from 'react';
import { Search, ExternalLink, Building2, Mail, Phone, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LeadQualification = () => {
  const [activeTab, setActiveTab] = useState<'b2b' | 'b2c'>('b2b');
   const { isDarkMode } = useTheme();
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: ''
  });
  const [enrichmentData, setEnrichmentData] = useState<any>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrichLead = async () => {
    if (!leadData.email && !leadData.website) return;
    
    setIsEnriching(true);
    
    // Simulate API call to enrich lead data
    setTimeout(() => {
      setEnrichmentData({
        linkedin: {
          profile: 'https://linkedin.com/in/john-doe',
          title: 'VP of Sales',
          company: 'Acme Corporation',
          experience: '8+ years in B2B sales'
        },
        company: {
          name: 'Acme Corporation',
          industry: 'Technology',
          size: '500-1000 employees',
          revenue: '$50M - $100M',
          location: 'San Francisco, CA'
        },
        website: {
          technology: ['React', 'Salesforce', 'HubSpot'],
          lastUpdated: '2024-01-15',
          trafficRank: 'Medium'
        }
      });
      setIsEnriching(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl ${
          isDarkMode 
            ? 'text-gray-300' 
            : 'text-gray-900'
        } font-bold`}>Lead Qualification</h1>
        <p className="text-gray-600 mt-2">
          Qualify and enrich your leads with comprehensive data insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('b2b')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'b2b'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  B2B Lead
                </button>
                <button
                  onClick={() => setActiveTab('b2c')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'b2c'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  B2C Lead
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={leadData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={leadData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                {activeTab === 'b2b' && (
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={leadData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corporation"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={leadData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'b2b' ? 'Company Website' : 'Website/Social Profile'}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={leadData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleEnrichLead}
                  disabled={isEnriching || (!leadData.email && !leadData.website)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isEnriching ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Enriching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Enrich Lead Data
                    </>
                  )}
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Save Lead
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enrichment Sidebar */}
        <div className="space-y-6">
          {/* LinkedIn Profile */}
          {enrichmentData?.linkedin && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                LinkedIn Profile
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{enrichmentData.linkedin.title}</p>
                  <p className="text-sm text-gray-600">{enrichmentData.linkedin.company}</p>
                </div>
                <p className="text-sm text-gray-600">{enrichmentData.linkedin.experience}</p>
                <a
                  href={enrichmentData.linkedin.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  View Profile <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}

          {/* Company Info */}
          {enrichmentData?.company && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                Company Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Industry:</span>
                  <span className="text-sm font-medium text-gray-900">{enrichmentData.company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm font-medium text-gray-900">{enrichmentData.company.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="text-sm font-medium text-gray-900">{enrichmentData.company.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-900">{enrichmentData.company.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Lead Summary Card */}
          {enrichmentData && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{leadData.email}</span>
                </div>
                {leadData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{leadData.phone}</span>
                  </div>
                )}
                {leadData.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{leadData.website}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Qualification Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Qualified
                  </span>
                </div>
              </div>
            </div>
          )}

          {!enrichmentData && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Enter lead information and click "Enrich Lead Data" to see insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadQualification;
