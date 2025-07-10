
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('useAuthSession: Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthSession: Error getting session:', error);
        }
        
        if (mounted) {
          console.log('useAuthSession: Initial session:', session?.user?.id || 'No session');
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('useAuthSession: Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthSession: Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
