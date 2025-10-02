
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://gbalpifistzxismztknz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiYWxwaWZpc3R6eGlzbXp0a256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTIyMjcsImV4cCI6MjA3NDE4ODIyN30.mvl8p-y7yBNQP8uQDrXvrleQJmxS-0iFc_AnKlIRlkw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  role: 'candidat' | 'entreprise' | 'formateur' | 'admin';
  full_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface OffreEmploi {
  id: string;
  entreprise_id: string;
  title: string;
  description: string;
  location?: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  salary_range?: string;
  is_active: boolean;
  created_at: string;
}

export interface Formation {
  id: string;
  formateur_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  location?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Candidature {
  id: string;
  offre_id: string;
  user_id: string;
  motivation?: string;
  cv_url?: string;
  status: 'envoyée' | 'en cours' | 'acceptée' | 'refusée';
  created_at: string;
}

export interface Entreprise {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  verified: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type?: string;
  payload?: any;
  is_read: boolean;
  created_at: string;
}
