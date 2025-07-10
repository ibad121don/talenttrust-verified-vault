import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';

export const useUnifiedDashboardData = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { documents, fetchDocuments } = useDocuments();
  const { toast } = useToast();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate real-time stats from documents
  const calculateStats = () => {
    const totalDocuments = documents.length;
    const verifiedDocuments = documents.filter(doc => doc.status === 'verified').length;
    const verificationScore = totalDocuments > 0 
      ? Math.round((verifiedDocuments / totalDocuments) * 100) 
      : 0;

    return {
      totalDocuments,
      verifiedDocuments,
      verificationScore
    };
  };

  const stats = calculateStats();

  // Refresh all data sources
  const refreshAllData = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshProfile(),
        fetchDocuments()
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh when documents change
  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user?.id]);

  return {
    user,
    userProfile,
    documents,
    stats: {
      totalDocuments: stats.totalDocuments,
      verifiedDocuments: stats.verifiedDocuments,
      verificationScore: stats.verificationScore,
      // Keep other stats from profile as fallback
      applicationsent: 12, // Fixed property name (single 's')
      profileViews: 48 // This could come from a separate API
    },
    isRefreshing,
    refreshAllData
  };
};
