
import { useState, useEffect } from 'react';
import { supabase, Formation } from '../config/supabase';

export const useFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('formation')
        .select(`
          *,
          formateur:formateur_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('Error fetching formations:', error.message);
        setError(error.message);
      } else {
        setFormations(data || []);
      }
    } catch (err: any) {
      console.log('Exception fetching formations:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  return { formations, loading, error, refetch: fetchFormations };
};
