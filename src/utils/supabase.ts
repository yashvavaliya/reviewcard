import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Only create client if environment variables are available and valid
export const supabase = config.isSupabaseConfigured()
  ? createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        persistSession: false // Disable auth since we're using local auth
      }
    })
  : null;

export const isSupabaseConfigured = () => {
  const isConfigured = config.isSupabaseConfigured();
  
  if (isConfigured) {
    console.log('Supabase is properly configured');
  } else {
    console.log('Supabase not configured - using localStorage only');
  }
  
  return isConfigured;
};

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    const connectionPromise = supabase
      .from('review_cards')
      .select('count')
      .limit(1);
    
    const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      review_cards: {
        Row: {
          id: string;
          business_name: string;
          category: string;
          type: string;
          description: string | null;
          location: string | null;
          slug: string;
          logo_url: string | null;
          google_maps_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          category: string;
          type: string;
          description?: string | null;
          location?: string | null;
          slug: string;
          logo_url?: string | null;
          google_maps_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          category?: string;
          type?: string;
          description?: string | null;
          location?: string | null;
          slug?: string;
          logo_url?: string | null;
          google_maps_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}