import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CompanySetup from '@/pages/CompanySetup';
import Dashboard from '@/pages/Dashboard';
import { useTheme } from '@/contexts/ThemeContext';

const ConditionalDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isCompanySetup, setIsCompanySetup] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompanySetup = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsCompanySetup(false);
        } else {
          // If profile exists and has company_name, setup is complete
          setIsCompanySetup(profile && profile.company_name ? true : false);
        }
      } catch (error) {
        console.error('Error checking company setup:', error);
        setIsCompanySetup(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompanySetup();
  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  // If company is not set up, show company setup page
  if (!isCompanySetup) {
    return <CompanySetup onSetupComplete={() => setIsCompanySetup(true)} />;
  }

  // If company is set up, show dashboard
  return <Dashboard />;
};

export default ConditionalDashboard;