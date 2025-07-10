
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserActivity {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
  activity_type: string;
}

export const useUserActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) return;
    
    try {
      // Use any to bypass TypeScript checking for the new table
      const { data, error } = await (supabase as any)
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (action: string, details: string, activityType: string = 'general') => {
    if (!user) return;

    try {
      // Use any to bypass TypeScript checking for the new table
      const { error } = await (supabase as any)
        .from('user_activities')
        .insert({
          user_id: user.id,
          action,
          details,
          activity_type: activityType
        });

      if (error) {
        console.error('Error adding activity:', error);
      } else {
        // Refresh activities after adding new one
        await fetchActivities();
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  // Set up real-time subscription for activities
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_activities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_activities',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Activity change detected, refreshing...');
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    activities,
    loading,
    addActivity,
    refreshActivities: fetchActivities
  };
};
