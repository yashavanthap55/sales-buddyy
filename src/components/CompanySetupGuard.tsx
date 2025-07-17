import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompanySetupGuardProps {
  children: React.ReactNode;
}

const CompanySetupGuard: React.FC<CompanySetupGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [hasCompanySetup, setHasCompanySetup] = useState(false);

  useEffect(() => {
    const checkCompanySetup = async () => {
      if (!user) {
        setCheckingSetup(false);
        return;
      }

      // Don't check for company setup on the company-setup page itself
      if (location.pathname === '/company-setup') {
        setCheckingSetup(false);
        setHasCompanySetup(true);
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
        } else if (!profile || !profile.company_name) {
          // User hasn't completed company setup
          setHasCompanySetup(false);
          toast({
            title: "Company Setup Required",
            description: "Fill the company setup form first",
            variant: "destructive",
          });
          navigate('/company-setup');
          return;
        } else {
          setHasCompanySetup(true);
        }
      } catch (error) {
        console.error('Error checking company setup:', error);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkCompanySetup();
  }, [user, location.pathname, navigate, toast]);

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasCompanySetup && location.pathname !== '/company-setup') {
    return null; // Will redirect to company setup
  }

  return <>{children}</>;
};

export default CompanySetupGuard;