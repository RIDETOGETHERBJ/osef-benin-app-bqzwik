
import { useState, useEffect } from 'react';
import { supabase, OffreEmploi } from '../config/supabase';
import { PerformanceMonitor } from '../utils/performanceMonitor';
import { SmartCache } from '../utils/smartCache';

export const useJobs = () => {
  const [jobs, setJobs] = useState<OffreEmploi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    await PerformanceMonitor.measureAsync('fetch_jobs', async () => {
      try {
        setLoading(true);
        
        // Try to get from cache first
        const cachedJobs = await SmartCache.get<OffreEmploi[]>('jobs_list');
        if (cachedJobs) {
          setJobs(cachedJobs);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('offreemploi')
          .select(`
            *,
            entreprise:entreprise_id (
              name,
              logo_url
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.log('Error fetching jobs:', error.message);
          setError(error.message);
        } else {
          const jobsData = data || [];
          setJobs(jobsData);
          
          // Cache the results for 5 minutes
          await SmartCache.set('jobs_list', jobsData, 5 * 60 * 1000);
        }
      } catch (err: any) {
        console.log('Exception fetching jobs:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, { jobCount: 10 });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: fetchJobs };
};
