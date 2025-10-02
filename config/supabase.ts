
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Note: These are placeholder values. 
// To enable Supabase functionality, please:
// 1. Press the Supabase button in Natively
// 2. Connect to your Supabase project
// 3. Replace these values with your actual Supabase URL and anon key

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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
  email: string;
  first_name: string;
  last_name: string;
  role: 'candidat' | 'entreprise' | 'formateur' | 'admin';
  location: string;
  skills: string[];
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface OffreEmploi {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_range: string;
  requirements: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  location: string;
  price: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  chat_id: string;
  created_at: string;
  read: boolean;
}

export interface Candidature {
  id: string;
  user_id: string;
  offre_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
  created_at: string;
  updated_at: string;
}
