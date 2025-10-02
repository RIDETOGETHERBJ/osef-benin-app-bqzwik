
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, UserProfile } from '../config/supabase';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: any) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  checkAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      hasSeenOnboarding: false,
      isAuthenticated: false,

      setUser: (user) => {
        console.log('Setting user:', user?.id);
        set({ user, isAuthenticated: !!user });
      },

      setProfile: (profile) => {
        console.log('Setting profile:', profile?.id);
        set({ profile });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),

      signIn: async (email: string, password: string) => {
        console.log('Attempting sign in for:', email);
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.log('Sign in error:', error.message);
            set({ isLoading: false });
            return { error: error.message };
          }

          if (data.user) {
            set({ user: data.user, isAuthenticated: true });
            
            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (!profileError && profileData) {
              set({ profile: profileData });
            }
          }

          set({ isLoading: false });
          return {};
        } catch (error: any) {
          console.log('Sign in exception:', error.message);
          set({ isLoading: false });
          return { error: error.message };
        }
      },

      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        console.log('Attempting sign up for:', email);
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            console.log('Sign up error:', error.message);
            set({ isLoading: false });
            return { error: error.message };
          }

          if (data.user) {
            // Create user profile
            const profileData = {
              id: data.user.id,
              email: data.user.email!,
              first_name: firstName,
              last_name: lastName,
              role: 'candidat' as const,
              location: '',
              skills: [],
              is_profile_complete: false,
            };

            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert([profileData]);

            if (profileError) {
              console.log('Profile creation error:', profileError.message);
            } else {
              set({ profile: profileData });
            }

            set({ user: data.user, isAuthenticated: true });
          }

          set({ isLoading: false });
          return {};
        } catch (error: any) {
          console.log('Sign up exception:', error.message);
          set({ isLoading: false });
          return { error: error.message };
        }
      },

      signOut: async () => {
        console.log('Signing out user');
        set({ isLoading: true });
        
        try {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            profile: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        } catch (error: any) {
          console.log('Sign out error:', error.message);
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user, profile } = get();
        if (!user || !profile) return { error: 'No user logged in' };

        console.log('Updating profile:', updates);
        set({ isLoading: true });

        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) {
            console.log('Profile update error:', error.message);
            set({ isLoading: false });
            return { error: error.message };
          }

          if (data) {
            set({ profile: data });
          }

          set({ isLoading: false });
          return {};
        } catch (error: any) {
          console.log('Profile update exception:', error.message);
          set({ isLoading: false });
          return { error: error.message };
        }
      },

      checkAuthState: async () => {
        console.log('Checking auth state');
        set({ isLoading: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            set({ user: session.user, isAuthenticated: true });
            
            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!profileError && profileData) {
              set({ profile: profileData });
            }
          } else {
            set({ user: null, profile: null, isAuthenticated: false });
          }
        } catch (error: any) {
          console.log('Auth state check error:', error.message);
          set({ user: null, profile: null, isAuthenticated: false });
        }

        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  const { setUser, setProfile } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    setUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    setUser(null);
    setProfile(null);
  }
});
