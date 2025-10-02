
import { useState, useEffect, useCallback } from 'react';
import { supabase, Candidature } from '../config/supabase';
import { useAuthStore } from '../store/userStore';

export const useApplications = () => {
  const [applications, setApplications] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchApplications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidature')
        .select(`
          *,
          offreemploi (
            title,
            entreprise:entreprise_id (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching applications:', error.message);
        setError(error.message);
      } else {
        setApplications(data || []);
      }
    } catch (err: any) {
      console.log('Exception fetching applications:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const applyToJob = async (
    offreId: string,
    motivation?: string,
    cvUrl?: string
  ) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('candidature')
        .select('id')
        .eq('user_id', user.id)
        .eq('offre_id', offreId)
        .single();

      if (existingApplication) {
        return { error: 'Vous avez déjà postulé à cette offre' };
      }

      const { data, error } = await supabase
        .from('candidature')
        .insert([{
          user_id: user.id,
          offre_id: offreId,
          motivation: motivation,
          cv_url: cvUrl,
          status: 'envoyée',
        }])
        .select()
        .single();

      if (error) {
        console.log('Error applying to job:', error.message);
        return { error: error.message };
      }

      // Update local state
      setApplications(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.log('Exception applying to job:', err.message);
      return { error: err.message };
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('candidature')
        .delete()
        .eq('id', applicationId)
        .eq('user_id', user?.id);

      if (error) {
        console.log('Error withdrawing application:', error.message);
        return { error: error.message };
      }

      // Update local state
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      return { success: true };
    } catch (err: any) {
      console.log('Exception withdrawing application:', err.message);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    applyToJob,
    withdrawApplication,
    refetch: fetchApplications,
  };
};
