
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalVerifications: number;
  verifiedCount: number;
  pendingCount: number;
  suspiciousCount: number;
  failedCount: number;
  activeUsers: number;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalVerifications: 0,
    verifiedCount: 0,
    pendingCount: 0,
    suspiciousCount: 0,
    failedCount: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      // Get verification statistics
      const { data: verificationStats, error: verificationError } = await supabase
        .from('verifications')
        .select('status');

      if (verificationError) throw verificationError;

      // Calculate verification counts
      const totalVerifications = verificationStats?.length || 0;
      const verifiedCount = verificationStats?.filter(v => v.status === 'verified').length || 0;
      const pendingCount = verificationStats?.filter(v => v.status === 'pending').length || 0;
      const suspiciousCount = verificationStats?.filter(v => v.status === 'suspicious').length || 0;
      const failedCount = verificationStats?.filter(v => v.status === 'failed').length || 0;

      // Get active users count (users who have logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activeUsersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .gte('last_login_at', thirtyDaysAgo.toISOString());

      if (usersError) throw usersError;

      const activeUsers = activeUsersData?.length || 0;

      setStats({
        totalVerifications,
        verifiedCount,
        pendingCount,
        suspiciousCount,
        failedCount,
        activeUsers
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error",
        description: "Failed to load admin statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const refreshStats = () => {
    fetchAdminStats();
  };

  return {
    stats,
    loading,
    refreshStats
  };
};
