
import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Edit, Building } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ModernFileUpload from '@/components/ModernFileUpload';

interface CompanySetupProps {
  onSetupComplete?: () => void;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ onSetupComplete }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    industry: '',
    headquarters: '',
    website: '',
    linkedin_url: '',
    acceptTerms: false,
  });
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState<{name: string, description: string}[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [existingProducts, setExistingProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;
    
    try {
      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error loading profile:', profileError);
      } else if (profile && profile.company_name) {
        setExistingProfile(profile);
        setFormData({
          companyName: profile.company_name || '',
          email: profile.email || '',
          industry: profile.industry || '',
          headquarters: profile.headquarters || '',
          website: profile.website || '',
          linkedin_url: profile.linkedin_url || '',
          acceptTerms: true
        });
      }

      // Load products data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);

      if (productsError) {
        console.error('Error loading products:', productsError);
      } else if (products) {
        setExistingProducts(products);
        setProducts(products.map(p => ({ name: p.name, description: p.description || '' })));
        setProductCount(products.length);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (existingProfile) {
      setFormData({
        companyName: existingProfile.company_name || '',
        email: existingProfile.email || '',
        industry: existingProfile.industry || '',
        headquarters: existingProfile.headquarters || '',
        website: existingProfile.website || '',
        linkedin_url: existingProfile.linkedin_url || '',
        acceptTerms: true
      });
    }
    if (existingProducts.length > 0) {
      setProducts(existingProducts.map(p => ({ name: p.name, description: p.description || '' })));
      setProductCount(existingProducts.length);
    }
  };

  const handleSetupAnotherCompany = () => {
    setFormData({
      companyName: '',
      email: '',
      industry: '',
      headquarters: '',
      website: '',
      linkedin_url: '',
      acceptTerms: false,
    });
    setProducts([]);
    setProductCount(0);
    setExistingProfile(null);
    setExistingProducts([]);
    setIsEditing(false);
    setSubmitted(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProductCountChange = (count: number) => {
    setProductCount(count);
    const newProducts = Array(count).fill(null).map((_, index) => 
      products[index] || { name: '', description: '' }
    );
    setProducts(newProducts);
  };

  const handleProductChange = (index: number, field: 'name' | 'description', value: string) => {
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleFilesUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.log('Files uploaded:', files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) {
        console.error('No user found');
        return;
      }

      // Update the user's profile with company information
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: formData.email,
          company_name: formData.companyName,
          headquarters: formData.headquarters,
          linkedin_url: formData.linkedin_url,
          industry: formData.industry,
          website: formData.website,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return;
      }

      // Handle products - delete existing and save new ones
      if (existingProducts.length > 0) {
        await supabase
          .from('products')
          .delete()
          .eq('user_id', user.id);
      }

      // Save products if any were entered manually
      if (showManualEntry && products.length > 0) {
        const productsToSave = products.filter(product => product.name.trim() !== '');
        
        if (productsToSave.length > 0) {
          const { error: productsError } = await supabase
            .from('products')
            .insert(
              productsToSave.map(product => ({
                user_id: user.id,
                name: product.name.trim(),
                description: product.description.trim()
              }))
            );

          if (productsError) {
            console.error('Error saving products:', productsError);
            return;
          }
        }
      }

      // Reload data and exit editing mode
      await loadExistingData();
      setIsEditing(false);
      toast.success('Company setup updated successfully!');
      
      if (!existingProfile) {
        setTimeout(() => {
          if (onSetupComplete) {
            onSetupComplete();
          } else {
            navigate('/', { replace: true });
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error during company setup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.companyName && formData.email && formData.acceptTerms;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show details view if user has completed setup and not editing
  if (existingProfile && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode 
              ? 'text-gray-100' 
              : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
          }`}>
            Company Details
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your company profile information
          </p>
        </div>

        {/* Company Information Display */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border mb-8 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Company Information
            </h3>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Company Name
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.company_name || 'Not provided'}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Business Email
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.email || 'Not provided'}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Industry
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.industry || 'Not provided'}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Headquarters
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.headquarters || 'Not provided'}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Website
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.website ? (
                  <a href={existingProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 underline">
                    {existingProfile.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                LinkedIn URL
              </label>
              <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {existingProfile.linkedin_url ? (
                  <a href={existingProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 underline">
                    {existingProfile.linkedin_url}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border mb-8 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <h3 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Products ({existingProducts.length})
          </h3>
          
          {existingProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {existingProducts.map((product, index) => (
                <div key={product.id} className={`p-6 border rounded-2xl ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/30' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <h4 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {product.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.description || 'No description provided'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No products added yet
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSetupAnotherCompany}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Building className="h-5 w-5" />
            Set Another Company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode 
            ? 'text-gray-100' 
            : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
        }`}>
          Company Setup
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Configure your company profile and upload your documents to get started with SalesBuddy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <h3 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Business Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="company@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="industry" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100' 
                    : 'border-gray-300 bg-white/50 text-gray-900'
                }`}
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="headquarters" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Headquarters
              </label>
              <input
                type="text"
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="e.g., New York, USA"
              />
            </div>

            <div>
              <label htmlFor="website" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="linkedin_url" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <h3 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Product Details</h3>
          
          <div className="mb-6">
            <label htmlFor="productCount" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Products
            </label>
            <input
              type="number"
              id="productCount"
              min="0"
              max="20"
              value={productCount}
              onChange={(e) => handleProductCountChange(parseInt(e.target.value) || 0)}
              className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                  : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter number of products"
            />
          </div>

          {productCount > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setShowManualEntry(true)}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                    showManualEntry
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualEntry(false)}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                    !showManualEntry
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Upload Files
                </button>
              </div>

              {showManualEntry ? (
                <div className="space-y-6">
                  {products.map((product, index) => (
                    <div key={index} className={`p-6 border rounded-2xl ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Product {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Product Name
                          </label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                            }`}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Description
                          </label>
                          <textarea
                            value={product.description}
                            onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                            }`}
                            placeholder="Enter product description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 border-2 border-dashed rounded-2xl text-center ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/30' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upload product files (catalogs, specifications, etc.)
                  </p>
                  <ModernFileUpload 
                    onFilesUpload={handleFilesUpload}
                    maxFiles={productCount}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Document Upload */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <h3 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Document Upload</h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your company documents, product catalogs, presentations, or any other relevant files.
          </p>
          
          <ModernFileUpload 
            onFilesUpload={handleFilesUpload}
            maxFiles={10}
          />
        </div>

        {/* Terms and Submit */}
        <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
              required
            />
            <label htmlFor="acceptTerms" className={`ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              I accept the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500 underline font-medium">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          <div className={`flex items-center justify-between pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {!isFormValid && (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Please fill in all required fields</span>
              </div>
            )}
            
            <div className="flex gap-4 ml-auto">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-8 py-4 rounded-2xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanySetup;
