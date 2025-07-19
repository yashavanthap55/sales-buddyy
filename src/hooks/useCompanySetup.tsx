import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCompanySetup = () => {
  const { user } = useAuth();
  const [hasCompanySetup, setHasCompanySetup] = useState(false);
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
          setHasCompanySetup(false);
        } else {
          setHasCompanySetup(!!(profile && profile.company_name));
        }
      } catch (error) {
        console.error('Error checking company setup:', error);
        setHasCompanySetup(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompanySetup();
  }, [user]);

  return { hasCompanySetup, loading };
};