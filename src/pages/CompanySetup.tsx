
import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ModernFileUpload from '@/components/ModernFileUpload';

const CompanySetup = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    industry: '',
    companySize: '',
    website: '',
    phone: '',
    acceptTerms: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFilesUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.log('Files uploaded:', files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      console.log('Company setup submitted:', formData, uploadedFiles);
    }, 1500);
  };

  const isFormValid = formData.companyName && formData.email && formData.acceptTerms;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`backdrop-blur-sm rounded-3xl p-12 shadow-2xl border text-center ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Setup Complete!</h2>
          <p className={`mb-8 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your company profile has been created successfully. You can now start qualifying leads.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Setup Another Company
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
              <label htmlFor="companySize" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Company Size
              </label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100' 
                    : 'border-gray-300 bg-white/50 text-gray-900'
                }`}
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
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
              <label htmlFor="phone" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 bg-white/50 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
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
              <a href="#" className="text-blue-600 hover:text-blue-500 underline font-medium">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 underline font-medium">
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
            
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`ml-auto px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform ${
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
      </form>
    </div>
  );
};

export default CompanySetup;
