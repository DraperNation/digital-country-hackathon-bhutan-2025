
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessAnalytics {
  totalBusinesses: number;
  activeBusinesses: number;
  totalFeesSpent: number;
  totalGnhContributions: number;
  averageComplianceScore: number;
  recentTransactions: Array<{
    id: string;
    transaction_id: string;
    amount: number;
    transaction_type: string;
    status: string;
    created_at: string;
  }>;
}

export const useBusinessAnalytics = () => {
  const [analytics, setAnalytics] = useState<BusinessAnalytics>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalFeesSpent: 0,
    totalGnhContributions: 0,
    averageComplianceScore: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch business registrations
      const { data: businesses, error: businessError } = await supabase
        .from('business_registrations')
        .select('id, verification_status, total_fees_paid, total_gnh_contributions');

      if (businessError) throw businessError;

      // Fetch recent transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('business_transactions')
        .select('id, transaction_id, amount, transaction_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionError) throw transactionError;

      // Fetch business analytics for compliance scores
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('compliance_score');

      if (analyticsError) throw analyticsError;

      // Calculate analytics
      const totalBusinesses = businesses?.length || 0;
      const activeBusinesses = businesses?.filter(b => b.verification_status === 'active').length || 0;
      const totalFeesSpent = businesses?.reduce((sum, b) => sum + (b.total_fees_paid || 0), 0) || 0;
      const totalGnhContributions = businesses?.reduce((sum, b) => sum + (b.total_gnh_contributions || 0), 0) || 0;
      const averageComplianceScore = analyticsData?.length 
        ? analyticsData.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / analyticsData.length 
        : 0;

      setAnalytics({
        totalBusinesses,
        activeBusinesses,
        totalFeesSpent,
        totalGnhContributions,
        averageComplianceScore,
        recentTransactions: transactions || []
      });

    } catch (err) {
      console.error('Error fetching business analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refreshAnalytics: fetchAnalytics };
};
