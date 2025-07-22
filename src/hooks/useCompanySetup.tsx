import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCompanySetup = () => {
  const { user } = useAuth();
  const [hasCompanySetup, setHasCompanySetup] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCompanySetup = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setHasCompanySetup(false);
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
        const hasSetup = !!(profile && profile.company_name);
        setHasCompanySetup(hasSetup);
      }
    } catch (error) {
      console.error('Error checking company setup:', error);
      setHasCompanySetup(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkCompanySetup();
  }, [checkCompanySetup]);

  // Set up real-time subscription to profiles table
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel(`profile_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile changed:', payload);
          // Small delay to ensure database is updated
          setTimeout(() => {
            checkCompanySetup();
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, checkCompanySetup]);

  return { hasCompanySetup, loading, refetch: checkCompanySetup };
};